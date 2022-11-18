FROM osrf/ros:foxy-desktop

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y sudo apt-utils dialog


RUN adduser --home /home/docker --disabled-password --gecos '' docker
RUN adduser docker sudo
RUN usermod -aG dialout docker
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER docker
WORKDIR /home/docker

RUN mkdir -p uros_ws
WORKDIR uros_ws

RUN git clone -b $ROS_DISTRO https://github.com/micro-ROS/micro_ros_setup.git src/micro_ros_setup \
&&  source /opt/ros/$ROS_DISTRO/setup.bash \
&&  sudo apt-get install -y ed python3-pip \
&&  rosdep update --rosdistro $ROS_DISTRO\
&&  rosdep install --from-paths src --ignore-src -y \
&&  colcon build \
&&  source install/local_setup.bash

COPY ./micro-ros_entrypoint.sh /micro-ros_entrypoint.sh

ENV RMW_IMPLEMENTATION=rmw_microxrcedds
ENV RTOS_TYPE=freertos
ENV MCU_TYPE=esp32
ENV PATH="~/.local/bin:${PATH}"

RUN echo ". /opt/ros/$ROS_DISTRO/setup.bash" >> ~/.bashrc
RUN echo ". ~/uros_ws/install/local_setup.bash" >> ~/.bashrc

RUN /bin/bash -c "source /opt/ros/$ROS_DISTRO/setup.bash; source ~/uros_ws/install/local_setup.bash; ros2 run micro_ros_setup create_firmware_ws.sh freertos esp32;"

#COPY

#RUN /bin/bash -c "source /opt/ros/$ROS_DISTRO/setup.bash; source ~/uros_ws/install/local_setup.bash; ros2 run micro_ros_setup build_firmware.sh;"


ENTRYPOINT ["/micro-ros_entrypoint.sh"]
CMD ["bash"]

