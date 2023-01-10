import React, { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

// Components
import TopicWindow from './TopicWindow'
import Connection from './Connection';
import Publish from './Publish';

// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import TopicListItem from './TopicListItem';


function TopicList(props) {
    //const { ros } = useContext(AppContext)
    const [ros, setRos] = useState(props.ros)
    const [availableTopics, setAvailableTopics] = useState([])
    
    const topicNameRef = useRef()
    const [alltopicslist, setTopics] = useState([])

    var topics = null;
    
    console.log(props.ros)
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
    //const [message, setMessage] = useState([])
    //let thisTopicId = alltopicslist.length === 0 ? 1 : alltopicslist[alltopicslist.length - 1].id + 1
    setTopics(current => [...current, {
        id: current.length === 0 ? 1 : current[current.length - 1].id + 1,
        name: topicName, 
        messageType: msgType,
        listener: my_topic_listener
    }]);
    
    
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
        console.log("result", result)
        let topicObjs = []
        for (let i=0; i<result.topics.length; i++) {
            topicObjs.push({
                name: result.topics[i],
                msgType: result.types[i]
            }) 
        }
        setAvailableTopics([...availableTopics, ...topicObjs])
        
        // topics = result.topics;
        // const ul = document.getElementById("topics");
        // for (let i = 0; i < topics.length; i++) {
        // const newTopic = document.createElement("li");
        // newTopic.appendChild(document.createTextNode(topics[i]));
        // let btn = document.createElement("button");
        // btn.onclick = hdt;
        // btn.setAttribute("topicName", topics[i]);
        // btn.setAttribute("msgType", result.types[i]);
        // btn.innerHTML = "Subscribe Topic";
        // newTopic.appendChild(btn);
        // ul.appendChild(newTopic);
        // }
    })
}

  return (
    <>       
        <Publish />
        <Row xs={12} md={12} className="g-4 mb-4">
            <Col>
                <Button variant="info" onClick={getTopics}>List Topics</Button>
            </Col>
        </Row>
        
        {/* <ul id="messages"></ul> */}
        {/* <ul id="topics"></ul> */}
        <Row xs={12} md={12} className="g-4 mb-4">
            <Col>
                <ListGroup as="ol" numbered>
                    {availableTopics.map((item) => {
                        return <TopicListItem name={item.name} subFunction={hdt} msgType={item.msgType} />
                    })}
                </ListGroup>
            </Col>
        </Row>
        <Row xs={1} md={2} className="g-4">
            {alltopicslist.map((item, index) => {
                return <TopicWindow id={item.id} name={item.name} messageType={item.messageType} listener={item.listener} key={index}></TopicWindow>;
            })}
        </Row>
    </>
  )
}

export default TopicList