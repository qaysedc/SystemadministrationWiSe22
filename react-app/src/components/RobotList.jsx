import { useState, useContext } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

export default function RobotList() {
    const { ros, setRos, connection } = useContext(AppContext)
    const [ipAddress, setIpAddress] = useState("172.17.0.3")
    console.log(ros)
  return (
    <Table striped bordered hover variant='dark'>
        <thead>
            <tr>
            <th>#</th>
            <th>IP Address</th>
            <th>Connection</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
        {ros?.map((item, index) => (
            <tr>
                <td>{index}</td>
                <td>{item.newRos.socket.url}</td>
                <td>{item.newRos.socket.url && "Connected"}</td>
                <td><Button>Disconnect</Button></td>
          </tr>
        ))}
        </tbody>
    </Table>
  )
}
