import { useState, useContext } from 'react'
import { AppContext } from '../App'
import ROSLIB from 'roslib';

// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Connection() {
    const { setRos, connection } = useContext(AppContext)
    const [ipAddress, setIpAddress] = useState("172.17.0.3")

    const handleConnection = (e) => {
        if (ipAddress === '') return
        setRos(new ROSLIB.Ros({ url: "ws://"+ipAddress+":9090" }))
    }

  return (
    <div>
        <Row className="mb-4">
            <Col xs={8}>
                <Form.Control
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Ip Address (Default: 172.17.0.3)">
                </Form.Control>
            </Col>
            <Col xs={4}>
                <Button 
                    variant={connection ? 'success' : 'secondary'}
                    onClick={handleConnection}
                >
                    {connection ? 'Connected' : 'Connect'}
                </Button>
            </Col>
        </Row>
        <p name={connection}>Connection: <span id="status">N/A</span></p>
    </div>
  )
}
