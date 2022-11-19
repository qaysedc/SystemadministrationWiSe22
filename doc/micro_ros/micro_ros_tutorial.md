# Micro-ROS setup tutorial (without Docker)

This is a tutorial of how to setup ROS2 and Micro-ROS

## ROS2 setup
Just follow:

https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Debians.html

## micro-ros setup with esp32

https://micro.ros.org//docs/tutorials/core/first_application_linux/

The instructions will setup a ready-to-use micro-ROS build system. The build system is in charge of downloading the required cross-compilation tools and building the apps for the platform.


The build pipeline has 4 steps:

1. Create

In this step all of the required code repositories and cross-compilation toolchains for the specific hardware are downloaded. It will also download some example apps.

2. Configuration

In this step one can select which app is going to be cross-compiled.
One also has to set options like: transport mechanism (serial, wifi, ethernet) and the agent's IP address/port.

3. Build

cross-compilation takes place and produces platform-specific binaries

4. Flash

The binaries generated in step 3 get flashed to the microcontroller

After the build of the program one has to start an "agent". The agent is responsible for making a connection between micro-Ros and the ros2 ecosystem. (See https://micro.ros.org/docs/concepts/client_library/introduction/)
Without the agent, the microcontroller cannot send messages to other devices, but (micro-ROS-)Nodes will be able to communicate on the microcontroller.

### Build System Setup
#### Installation of build system
```
# Source the ROS 2 installation
source /opt/ros/$ROS_DISTRO/setup.bash

# Create a workspace and download the micro-ROS tools
mkdir microros_ws
cd microros_ws
git clone -b $ROS_DISTRO https://github.com/micro-ROS/micro_ros_setup.git src/micro_ros_setup

# Update dependencies using rosdep
sudo apt update && rosdep update
rosdep install --from-paths src --ignore-src -y

# Install pip
sudo apt-get install python3-pip

# Build micro-ROS tools and source them
colcon build
source install/local_setup.bash
```

#### Setup firmware workspace

```
ros2 run micro_ros_setup create_firmware_ws.sh freertos esp32
```

#### Configure firmware

```
ros2 run micro_ros_setup configure_firmware.sh [program you want to run e.g. int32_publisher] -t udp -i [your local machine IP] -p 8888

ros2 run micro_ros_setup build_firmware.sh menuconfig
# An application in the shell will start. Go to
#Settings -> Transport mechanism -> Wifi Configuration
#Setup the Wifi credentials

```

#### Build firmware
```
ros2 run micro_ros_setup build_firmware.sh
source install/local_setup.bash
```

#### Flash firmware
```
# connect ESP32 to computer with a micro-USB Cable and then run:
ros2 run micro_ros_setup flash_firmware.sh
```



### Agent Setup

#### Build micro-ros agent
```
# Download micro-ROS-Agent packages
ros2 run micro_ros_setup create_agent_ws.sh

# Build step
ros2 run micro_ros_setup build_agent.sh
source install/local_setup.bash
```

### Run agent

```
ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888

# The microrontroller might not build up a connection.
# You have to press the reset button.
```

## Setup with Vbox
0. Install Vbox version 6.1.38
1. Download Ubuntu 20 image
2. create VDI with atleast 32 GB
3. Setup Ubuntu
4. update Ubuntu
5. Download Guest-Additions Version 6.1.2
6. Install Guest-Additions
7. Download VBox Extensions Pack Version 6.38
8. Setup VBox Extensions
9. Enable USB in Settings
10. add host to vboxusers group
```
sudo usermod -aG vboxusers <name>
```
11. add VBox client user to group
```
sudo usermod -aG dialout <name>
```
12. Reboot everything



## Setup with Docker
0. Prerequesits:
your user is part of docker group
your user is part of dialout group
set your the wifi credentials in sdkconfig file
replace "TEST_WIFI" and "TEST_PASSWORD"


1. go to docker/

2. run docker build .

3. docker run -it --net=host -v /dev:/dev --privileged <image-name>

Explanation: 
-it             for interactive shell
--net=host      to enable network access for container with same ip as host
-v /dev:/dev    bind mount /dev to enable live updating of tty interfaces
--privileged    enable access to ttyUSBx

4. Configure firmware:

ros2 run micro_ros_setup configure_firmware.sh [program you want to run e.g. int32_publisher] -t udp -i [your local machine IP] -p 8888

menuconfig should not be necessary but you can check if everything is set appropriately with:

ros2 run micro_ros_setup build_firmware.sh menuconfig


5. Build Firmware

ros2 run micro_ros_setup build_firmware.sh

source install/local_setup.bash

6. Flash Firmware
connect esp32

ros2 run micro_ros_setup flash_firmware.sh

7. run Docker micro-ros agent

docker run -it --net=host microros/micro-ros-agent:foxy udp4 -p 8888

8. press reset button on esp32
