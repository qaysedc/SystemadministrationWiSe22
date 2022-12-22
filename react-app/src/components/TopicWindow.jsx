import React from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

function TopicWindow({ name, content }) {
  return (
    <Col>
      <Card className="contentCard">
          <Card.Header><code> {name} </code></Card.Header>
          <Card.Body>
            <Card.Title> {content} </Card.Title>
            <Card.Text>
              blablabla
            </Card.Text>
          </Card.Body>
        </Card>
    </Col>
  )
}

export default TopicWindow
