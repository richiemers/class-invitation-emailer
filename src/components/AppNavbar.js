import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

export default function AppNavbar({ handleShow }) {

    return (
        <Navbar variant="dark" fixed="top">
            <Navbar.Brand href="#home">
                Email Send <small className="font-weight-light">0.1.0</small>
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="#internet" className="mr-2 ml-4" onClick={handleShow}>
                        <FontAwesomeIcon 
                            icon={faUpload}
                            title="Upload Excel File" />&nbsp;&nbsp;&nbsp;Upload Excel File
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}