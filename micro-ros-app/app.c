#include <stdio.h>
#include <unistd.h>
#include <inttypes.h>
#include <math.h>

#include <rcl/rcl.h>
#include <rcl/error_handling.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>

#include <geometry_msgs/msg/twist.h>
#include <std_msgs/msg/int32.h>

#include <driver/gpio.h>
#include <driver/ledc.h>


#ifdef ESP_PLATFORM
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#endif

#define RCCHECK(fn) { rcl_ret_t temp_rc = fn; if((temp_rc != RCL_RET_OK)){printf("Failed status on line %d: %d. Aborting.\n",__LINE__,(int)temp_rc);vTaskDelete(NULL);}}
#define RCSOFTCHECK(fn) { rcl_ret_t temp_rc = fn; if((temp_rc != RCL_RET_OK)){printf("Failed status on line %d: %d. Continuing.\n",__LINE__,(int)temp_rc);}}

#define LED_BUILTIN 33
#define GPIO_LEFT1_IN1 12
#define GPIO_LEFT2_IN2 13

#define GPIO_RIGHT1_IN3 15
#define GPIO_RIGHT2_IN4 14

#define GPIO_ENA 0
#define GPIO_ENB 16

// Pin 4 is internally connected to the flashlight... 
// Pin 0 is internally connected to en/disable flashing mode
//https://randomnerdtutorials.com/esp32-cam-ai-thinker-pinout/


#define PWM_CHANNEL_LEFT LEDC_CHANNEL_2
#define PWM_CHANNEL_RIGHT LEDC_CHANNEL_3

#define PWM_MOTOR_MIN 750    // The value where the motor starts moving, this can only be found out by testing
#define PWM_MOTOR_MAX 1023

#define FRAME_TIME 300 // 1000 / FRAME_TIME = FPS
#define SLEEP_TIME 10

#define HIGH 1
#define LOW 0

geometry_msgs__msg__Twist msg;


// Other PWM settings
#define PWM_FREQUENCY 50
#define PWM_RESOLUTION LEDC_TIMER_12_BIT
#define PWM_TIMER LEDC_TIMER_1
#define PWM_MODE LEDC_HIGH_SPEED_MODE

void setupPins();
void setupROS();
void cmd_vel_callback(const void *msgin);
void timer_callback(rcl_timer_t *timer, int64_t last_call_time);
void set_wheel_direction(gpio_num_t first_pin, gpio_num_t second_pin, int direction);
void set_wheel_speed( ledc_channel_t pwm_channel, int speed);
int calc_pwm_speed(double movement);

double constrain(double amount, double low, double high);
int sign_i(int num);
double sign_d(double num);

void appMain(void * arg) {
	setupPins();
	setupROS();
}


void setupPins(){

	int pins[7] = {LED_BUILTIN, GPIO_LEFT1_IN1, GPIO_LEFT2_IN2, GPIO_RIGHT1_IN3, GPIO_RIGHT2_IN4, GPIO_ENA, GPIO_ENB};

	int pin_array_size = sizeof(pins)/sizeof(int);
	for(int i = 0; i < pin_array_size; i++){
		int pin_num = pins[i];
		gpio_reset_pin(pin_num);
		gpio_set_direction(pin_num, GPIO_MODE_INPUT_OUTPUT);
	}

	// Configure timer
    ledc_timer_config_t ledc_timer = {
        .duty_resolution = PWM_RESOLUTION,
        .freq_hz = PWM_FREQUENCY,
        .speed_mode = PWM_MODE,
        .timer_num = PWM_TIMER,
        .clk_cfg = LEDC_AUTO_CLK,
    };
    ledc_timer_config(&ledc_timer);


	// Configure 2 PWM channels and assign output pins
    ledc_channel_config_t ledc_channel[2] =
	{
        {
            .channel    = PWM_CHANNEL_LEFT,
            .duty       = 0,
            .gpio_num   = GPIO_ENA,
            .speed_mode = PWM_MODE,
            .hpoint     = 0,
            .timer_sel  = LEDC_TIMER_1
        },
		{	.channel    = PWM_CHANNEL_RIGHT,
            .duty       = 0,
            .gpio_num   = GPIO_ENB,
            .speed_mode = PWM_MODE,
            .hpoint     = 0,
            .timer_sel  = LEDC_TIMER_1
		},
	};

	for (int i = 0; i < 2; i++) {
        ledc_channel_config(&ledc_channel[i]);
    }

};



void setupROS(){

    // Micro ROS
    rcl_allocator_t allocator = rcl_get_default_allocator();
    rclc_support_t support;

    // create init_options
    RCCHECK(rclc_support_init(&support, 0, NULL, &allocator));

    // create node
    rcl_node_t node;
    RCCHECK(rclc_node_init_default(&node, "ros_esp32cam_diffdrive", "", &support));

    // create subscriber
    rcl_subscription_t subscriber;
    RCCHECK(rclc_subscription_init_default(
        &subscriber,
        &node,
        ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist),
        "/cmd_vel"));

    // create timer,
    rcl_timer_t timer;
    RCCHECK(rclc_timer_init_default(
        &timer,
        &support,
        RCL_MS_TO_NS(FRAME_TIME),
        timer_callback));

    // create executor
    rclc_executor_t executor;
    RCCHECK(rclc_executor_init(&executor, &support.context, 2, &allocator));
    RCCHECK(rclc_executor_add_subscription(&executor, &subscriber, &msg, &cmd_vel_callback, ON_NEW_DATA));
    RCCHECK(rclc_executor_add_timer(&executor, &timer));

    while (1) {
        rclc_executor_spin_some(&executor, RCL_MS_TO_NS(SLEEP_TIME));
        usleep(SLEEP_TIME * 1000);
    }

    // free resources
    RCCHECK(rcl_subscription_fini(&subscriber, &node));
    RCCHECK(rcl_node_fini(&node));

    vTaskDelete(NULL);

};

void cmd_vel_callback(const void *msgin) {
//    const geometry_msgs__msg__Twist *msg = (const geometry_msgs__msg__Twist *) msgin;
//    printf("Message received: %f %f\n", msg->linear.x, msg->angular.z);
}

void timer_callback(rcl_timer_t *timer, int64_t last_call_time) {

	RCLC_UNUSED(last_call_time);
	if (timer == NULL) {
        return;
    }

	
	gpio_set_level(LED_BUILTIN, !gpio_get_level(LED_BUILTIN));


	// constrain linear and angular values
	double linear = constrain(msg.linear.x, -1.0, 1.0);

	double angular = constrain(msg.angular.z, -1.0, 1.0);


	// Optimization for computation

	/* 
	Used to calculate the "signed" Pythagoras
	Instead of a ** 2 + b ** 2 = c ** 2

	we have a part p for each side

	p = sign(l) * l ** 2  ° sign(a) * a ** 2
	with ° as - or + dependent of the wheel side

	And the resulting movement:

	m = sign(p) * sqrt( abs(p) );

	This enables the robot to turn on the spot.
	This can probably also be done with imaginary numbers.
	*/

	double linear_part = sign_d(linear) * linear * linear;

	double angular_part = sign_d(angular) * angular * angular;


	// LEFT WHEEL
	double left_movement = linear_part - angular_part;

	int left_direction = (int)sign_d(left_movement);

	int left_speed = calc_pwm_speed(left_movement);


	// RIGHT WHEEL
	double right_movement = linear_part + angular_part;

	int right_direction = (int)(-1.0 * sign_d(right_movement));

	int right_speed = calc_pwm_speed(right_movement);


	// UPDATE VALUES
	// LEFT DIRECTION
	set_wheel_direction(GPIO_LEFT1_IN1, GPIO_LEFT2_IN2, left_direction);
	
	// RIGHT DIRECTION
	set_wheel_direction(GPIO_RIGHT1_IN3, GPIO_RIGHT2_IN4, right_direction);

	
	// LEFT SPEED
	//printf("left_direction: %i \n left_speed: % i\n right_direction: %i\n right_speed: %i\n\n ", left_direction, left_speed, right_direction, right_speed);
	set_wheel_speed(PWM_CHANNEL_LEFT, left_speed);

	// RIGHT SPEED
	set_wheel_speed(PWM_CHANNEL_RIGHT, right_speed);
}

void set_wheel_direction(gpio_num_t first_pin, gpio_num_t second_pin, int direction){

	// FORWARDS
	if(direction == 1){
		// first high, second low
		gpio_set_level(first_pin, HIGH);
		gpio_set_level(second_pin, LOW);
		return;
	}

	// BACKWARDS
	if(direction == -1){

		// first low, second high
		gpio_set_level(first_pin, LOW);
		gpio_set_level(second_pin, HIGH);
		return;
	}

	// STOP
	// IF 0 or something is off

	gpio_set_level(first_pin, LOW);
	gpio_set_level(second_pin, LOW);
	return;
}

void set_wheel_speed( ledc_channel_t pwm_channel, int speed){
	
	printf("set channel %i speed: %i\n", pwm_channel, speed);
	if (speed < PWM_MOTOR_MIN || speed > PWM_MOTOR_MAX){
		speed = 0;
	}

	ledc_set_duty(PWM_MODE, pwm_channel, speed);
	ledc_update_duty(PWM_MODE, pwm_channel);
}

int calc_pwm_speed(double movement){
	double abs_movement = fabs(movement);
	if(abs_movement < 0.1*0.1){
		return 0;
	}

	return (int) constrain((sqrt(abs_movement) * (PWM_MOTOR_MAX - PWM_MOTOR_MIN) + PWM_MOTOR_MIN), 0, PWM_MOTOR_MAX);
}

// HELPER-FUNCTIONS

double constrain(double amount, double low, double high){
	if(amount < low){
		return low;
	}

	if(amount > high){
		return high;
	}

	return amount;
}

int sign_i(int num){

	if (num > 0){
		return 1;
	}
	if(num == 0){
		return 0;
	}
	
	return -1;
}

double sign_d(double num){
	if (num > 0.0){
		return 1.0;
	}

	if(num == 0.0){
		return 0.0;
	}

	return -1.0;
}