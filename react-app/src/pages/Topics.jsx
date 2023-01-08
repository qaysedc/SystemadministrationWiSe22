import React, { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../App'

import Card from 'react-bootstrap/Card';
import TopicList from '../components/TopicList';

export default function Topics(props) {
  const { ros } = useContext(AppContext)
  return (
    <>
      <Card className="mainCard">
        <Card.Header>Topics</Card.Header>
        <Card.Body>
          <Card.Title> Topics </Card.Title>
          <Card.Text>
              <TopicList ros={props.ros} />
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
