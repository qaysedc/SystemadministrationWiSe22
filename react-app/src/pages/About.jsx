import React from 'react'

import Card from 'react-bootstrap/Card';

export default function About() {
  return (
    <>
      <Card className="mainCard">
        <Card.Header>About</Card.Header>
        <Card.Body>
          <Card.Title> About </Card.Title>
          <Card.Text>
            Content...
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
