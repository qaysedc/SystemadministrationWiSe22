import { useState, useContext, useReducer } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

export default function Joypad() {
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
            updateTwist({angular: {...twist.angular, x: twist.angular.x + 0.01}})
            publishTwistMessage()
        }
        if (e.key === 'd' || e.key === 'D') {
            updateTwist({angular: {...twist.angular, x: twist.angular.x - 0.01}})
            publishTwistMessage()
        }
    }
  return (
    <div>
        <input type="text" onKeyPress={joypad} />
    </div>
  )
}
