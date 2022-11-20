import React, { useState, useRef, useEffect } from 'react'
import ROSLIB from 'roslib';

export default function Dashboard() {
  const ipAddressRef = useRef()
  const topicNameRef = useRef()
  var ros = null

  function handleConnection(e) {
    const ipAddress = ipAddressRef.current.value
    if (ipAddress === '') return
    ros = new ROSLIB.Ros({ url: "ws://"+ipAddress+":9090" });
    console.log(ipAddress)
    ros.on("connection", () => {
      document.getElementById("status").innerHTML = "successful";
    });
    ros.on("error", (error) => {
      document.getElementById("status").innerHTML = `errored out (${error})`;
    });
  }

  function handleTopicSub(e) {
    const topicName = topicNameRef.current.value
    if (topicName === '') return
    const my_topic_listener = new ROSLIB.Topic({
      ros,
      name: "/"+topicName,
      messageType: "std_msgs/msg/Int32",
    });

    my_topic_listener.subscribe((message) => {
      const ul = document.getElementById("messages");
      const newMessage = document.createElement("li");
      newMessage.appendChild(document.createTextNode(message.data));
      ul.appendChild(newMessage);
    });
  }

  return (
    <>
      <div>Dashboard</div>
      <input ref={ipAddressRef} type="text" placeholder="Ip Address" />
      <button onClick={handleConnection}>Connect</button>
      <p>Connection: <span id="status">N/A</span></p>
      <input ref={topicNameRef} type="text" placeholder="Topic Name" />
      <button onClick={handleTopicSub}>Subscribe</button>
      <p><code>/client_count</code> messages received: </p>
      <ul id="messages"></ul>
    </>
  )
}
