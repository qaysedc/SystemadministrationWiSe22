import React, { useState, useRef, useEffect } from 'react'
import TopicWindow from './TopicWindow'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


import ROSLIB from 'roslib';



function TopicList() {
    
    const ipAddressRef = useRef()
    const topicNameRef = useRef()
    const [alltopicslist, setTopics] = useState([])
    var ros = null
    //const [connection, setConnection] = useState(false)
    var connection = false
    var topics = null;
    
console.log("hi")

function handleConnection(e) {
    const ipAddress = ipAddressRef.current.value
    if (ipAddress === '') return
    ros = new ROSLIB.Ros({ url: "ws://"+ipAddress+":9090" });
    console.log(ipAddress)
    ros.on("connection", () => {
        document.getElementById("status").innerHTML = "successful";
        //setConnection(true)
        connection = true;
    });
    ros.on("error", (error) => {
        document.getElementById("status").innerHTML = `errored out (${error})`;
        //setConnection(false)
        connection = false
    });
}

    let hdt = function handleTopicSub(e) {
        
    // const topicName = topicNameRef.current.value
    const topicName = e.target.getAttribute("topicName");
    const msgType = e.target.getAttribute("msgType");
    console.log("Topic: " + e.target.getAttribute("topicName"));
    console.log("MsgType: " + e.target.getAttribute("msgType"));
    if (topicName === '') return
    const my_topic_listener = new ROSLIB.Topic({
        ros,
        name: topicName,
        messageType: msgType,
    });
    console.log(my_topic_listener);
    my_topic_listener.subscribe((message) => {
        // const ul = document.getElementById("messages");
        // const newMessage = document.createElement("li");
        // newMessage.appendChild(document.createTextNode(message.data));
        //ul.appendChild(newMessage);
        // const newTopics = [...alltopicslist, {name: topicName, content: msgType}];

        console.log("davor")
        //console.log(newTopics);
        console.log("danach")
        // TODO: Bug with multiple Messages -> change content to topicwindow
        setTopics(current => [...current, {name: topicName, content: msgType}]);
        // setTopics(newTopics);
        console.log(alltopicslist)
    });
    }

function getTopics() {
    var topicsClient = new ROSLIB.Service({
        ros: ros,
        name: "/rosapi/topics",
        serviceType: "rosapi/Topics"
    });

    var request = new ROSLIB.ServiceRequest();

    topicsClient.callService(request, function(result) {
        console.log("Getting topics...");
        console.log(result);
        topics = result.topics;
        const ul = document.getElementById("topics");
        for (let i = 0; i < topics.length; i++) {
        const newTopic = document.createElement("li");
        newTopic.appendChild(document.createTextNode(topics[i]));
        let btn = document.createElement("button");
        btn.onclick = hdt;
        btn.setAttribute("topicName", topics[i]);
        btn.setAttribute("msgType", result.types[i]);
        btn.innerHTML = "Subscribe Topic";
        newTopic.appendChild(btn);
        ul.appendChild(newTopic);
        }
    })
}

console.log(connection)
  return (
    <>       
        <Row className="mb-4">
            <Col xs={8}><Form.Control ref={ipAddressRef} placeholder="Ip Address"></Form.Control></Col>
            <Col xs={4}><Button variant={connection ? 'success' : 'secondary'} onClick={handleConnection}>{connection ? 'Connected' : 'Connect'}</Button></Col>
        </Row>
        <p name={connection}>Connection: <span id="status">N/A</span></p>

        <Row className="mb-4">
            <Col xs={8}><Form.Control ref={topicNameRef} placeholder="Topic Name"></Form.Control></Col>
            <Col xs={4}></Col>
        </Row>
        
        {/* <button onClick={handleTopicSub}>Subscribe</button> */}
        <p><code>/client_count</code> messages received: </p>
        <Button variant="info" onClick={getTopics}>List Topics</Button>
        <ul id="messages"></ul>
        <ul id="topics"></ul>
        <Row xs={1} md={2} className="g-4">
            {alltopicslist.map((item, index) => {
                return <TopicWindow name={item.name} content={item.content} key={index}></TopicWindow>;
            })}
        </Row>
    </>
  )
}

export default TopicList