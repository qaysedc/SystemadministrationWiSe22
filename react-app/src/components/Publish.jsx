import { useState, useContext } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useReducer } from 'react';

export default function Publish() {
  const { ros } = useContext(AppContext)
  const [twist, updateTwist] = useReducer(
    (state, updates) => ({...state, ...updates }),
    {
    linear: {
      x: 0,
      y: 0,
      z: 0
    },
    angular: {
      x: 0,
      y: 0,
      z: 0
    }
  })

  const publishTwistMessage = () => {
    var cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist"
    })

    var twistMsg = new ROSLIB.Message(twist)
    cmdVel.publish(twistMsg)
  }

  return (
    <div>
        <div className="mb-2">Publish to <code>/cmd_vel</code></div>
        <Row className="mb-4">
            <Col xs={4}>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, x: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, y: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, z: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
            </Col>

            <Col xs={4}>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, x: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, y: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, z: parseFloat(e.target.value)}})} className="mb-2"></Form.Control>
            </Col>

            <Col xs={4}>
              <Button variant="success" onClick={publishTwistMessage}>Publish Twist Message</Button>
            </Col>

        </Row>
    </div>
  )
}
