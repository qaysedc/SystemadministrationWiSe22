import React from 'react'
import { Button } from 'react-bootstrap';

import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

export default function TopicListItem(props) {
  return (
    <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{props.name}</div>
          <code>{props.msgType}</code>
        </div>
        <Button onClick={props.subFunction} topicName={props.name} msgType={props.msgType}>Subscribe</Button>
      </ListGroup.Item>
  )
}
