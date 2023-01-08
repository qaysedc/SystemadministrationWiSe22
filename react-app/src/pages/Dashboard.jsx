import React, { useState, useRef, useEffect } from 'react'

import TopicList from '../components/TopicList'

import Card from 'react-bootstrap/Card';
import Connection from '../components/Connection';
import RobotList from '../components/RobotList';

export default function Dashboard() {
  

  return (
    <>
      <Card className="mainCard">
          <Card.Header>Dashboard</Card.Header>
          <Card.Body>
            <Card.Title> Card Title </Card.Title>
            <Card.Text>
              <Connection />
              <RobotList />
            </Card.Text>
          </Card.Body>
        </Card>
    </>
  )
}
