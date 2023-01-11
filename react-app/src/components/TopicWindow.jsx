import React, { useState, useRef, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

function TopicWindow({ id, name, messageType, listener }) {

  const [messages, setMessages] = useState([])
  const ref = useRef(null);
  console.log("topic-id:", id)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, ref]);

  listener.subscribe((message) => {
    setMessages([...messages, message])
    // if (ref.current) {
    //   ref.current.scrollTop = ref.current.scrollHeight;
    // }
    // const ul = document.getElementById("topic-"+id);
    // const newMessage = document.createElement("li");
    // console.log(message)
    // newMessage.appendChild(document.createTextNode(message));
    // ul.appendChild(newMessage);
    // const newTopics = [...alltopicslist, {name: topicName, content: msgType}];
    // console.log("Message:")
    // console.log(message)
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
              <div className='scrollbox' ref={ref} id={"topic-"+id}>
                {messages.map((item) => {
                  const strjyObj = JSON.stringify(item)
                  ref.current.scrollTop = ref.current.scrollHeight;
                  return <p>{strjyObj}</p>
                })}
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
    </Col>
  )
}

export default TopicWindow
