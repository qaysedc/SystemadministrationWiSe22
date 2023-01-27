import { useState, useContext } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useReducer } from 'react';

export default function Publish(props) {
  // const { ros } = useContext(AppContext)
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
      ros: props.ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist"
    })

    var twistMsg = new ROSLIB.Message(twist)
    cmdVel.publish(twistMsg)
  }

  const resetTwistMessage = () => {
    var cmdVel = new ROSLIB.Topic({
      ros: props.ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist"
    })

    var twistObj = {
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
    }
    var twistMsg = new ROSLIB.Message(twistObj)
    updateTwist(twistObj)
    cmdVel.publish(twistMsg)
  }

  const joypad = (e) => {
    e.preventDefault()
    if (e.key === 'w' || e.key === 'W') {
        updateTwist({linear: {...twist.linear, x: twist.linear.x + 0.01}})
        publishTwistMessage()
    }
    if (e.key === 's' || e.key === 'S') {
        updateTwist({linear: {...twist.linear, x: twist.linear.x - 0.01}})
        publishTwistMessage()
    }
    if (e.key === 'a' || e.key === 'A') {
        updateTwist({angular: {...twist.angular, z: twist.angular.z + 0.01}})
        publishTwistMessage()
    }
    if (e.key === 'd' || e.key === 'D') {
        updateTwist({angular: {...twist.angular, z: twist.angular.z - 0.01}})
        publishTwistMessage()
    }
    if (e.key === 'r' || e.key === 'R') {
      resetTwistMessage()
    }
  }

  return (
    <div>
        <div className="mb-2">Publish to <code>/cmd_vel</code></div>
        <Row className="mb-4">
            <Col xs={2}>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, x: parseFloat(e.target.value)}})} className="mb-2" placeholder='linear X'></Form.Control>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, y: parseFloat(e.target.value)}})} className="mb-2" placeholder='linear Y'></Form.Control>
                <Form.Control onChange={(e) => updateTwist({linear: {...twist.linear, z: parseFloat(e.target.value)}})} className="mb-2" placeholder='linear Z'></Form.Control>
            </Col>

            <Col xs={2}>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, x: parseFloat(e.target.value)}})} className="mb-2" placeholder='angular X'></Form.Control>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, y: parseFloat(e.target.value)}})} className="mb-2" placeholder='angular Y'></Form.Control>
                <Form.Control onChange={(e) => updateTwist({angular: {...twist.angular, z: parseFloat(e.target.value)}})} className="mb-2" placeholder='angular Z'></Form.Control>
            </Col>

            <Col xs={4}>
              <Button variant="success" onClick={publishTwistMessage} className="mb-2">Publish Twist Message</Button>
              <br />
              <Button variant="danger" onClick={resetTwistMessage}>Reset</Button>
            </Col>

            <Col xs={4}>
              <p>Keyboard Control for Robot</p>
              <Form.Control onKeyPress={joypad} className="mb-2" placeholder="Focus HERE"></Form.Control>
              <p><code>W A S D</code> for speed & direction control <br /> <code>R</code> to reset</p>
            </Col>
        </Row>
    </div>
  )
}
