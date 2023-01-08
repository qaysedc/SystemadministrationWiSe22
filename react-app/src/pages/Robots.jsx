import React from 'react'

import Joypad from '../components/Joypad';

import Card from 'react-bootstrap/Card';

export default function Robots() {
  return (
    <>
      <Card className="mainCard">
        <Card.Header>Robots</Card.Header>
        <Card.Body>
          <Card.Title> Robots </Card.Title>
          <Card.Text>
            <Joypad />
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
