import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

function TopicWindow({ id, name, messageType, listener }) {

  const [message, setMessage] = useState("")
console.log("topic-id:", id)
  listener.subscribe((message) => {
    const ul = document.getElementById("topic-"+id);
    const newMessage = document.createElement("li");
    newMessage.appendChild(document.createTextNode(message.data));
    ul.appendChild(newMessage);
    // const newTopics = [...alltopicslist, {name: topicName, content: msgType}];
    console.log("Message:")
    console.log(message)
    //setMessage(current => [...current, {message: message}])
    // let topicsCopy = [...alltopicslist]
    // let changingTopicCopy = {...alltopicslist[thisTopicId]}
    // console.log("listofItems:", topicsCopy)
    // changingTopicCopy.message = [...changingTopicCopy.message, "asdf"]
    // topicsCopy[thisTopicId] = changingTopicCopy
    // setTopics(current => [...current, topicsCopy])
    //console.log(newTopics);
});

  return (
    <Col>
      <Card className="contentCard">
          <Card.Header><code> {name} </code></Card.Header>
          <Card.Body>
            <Card.Title> {messageType} </Card.Title>
            <Card.Text>
              <div id={"topic-"+id}>

              </div>
            </Card.Text>
          </Card.Body>
        </Card>
    </Col>
  )
}

export default TopicWindow
