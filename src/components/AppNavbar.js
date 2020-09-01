import React from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faGlobe } from '@fortawesome/free-solid-svg-icons'

export default function AppNavbar({ handleShow, handleClearTodos, handleLoadFromInternet, handleSelectAll, selectAll, todosLength }) {
    return (
        <Navbar variant="dark" fixed="top">
            <Navbar.Brand href="#home">
                Todo App <small className="font-weight-light">0.1.0</small>
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Navbar.Text className="mr-5 todosCount">
                        { todosLength } more todos to complete.
                    </Navbar.Text>
                    <Form inline>
                        <div className="custom-control custom-checkbox">
                            <input 
                                type="checkbox" 
                                className="custom-control-input"
                                id="selectAll"
                                checked={selectAll}
                                onChange={handleSelectAll} />
                            <label className="custom-control-label text-white" htmlFor="selectAll">Select All</label>
                        </div>
                    </Form>
                    <Nav.Link href="#internet" className="mr-2 ml-4">
                        <FontAwesomeIcon 
                            icon={faGlobe} 
                            title="Load from internet"
                            onClick={handleLoadFromInternet} />
                    </Nav.Link>
                    <Nav.Link href="#remove" className="mr-2">
                        <FontAwesomeIcon 
                            icon={faTrash} 
                            title="Remove Completed Todo"
                            onClick={handleClearTodos} />
                    </Nav.Link>
                    <Nav.Link href="#add">
                        <FontAwesomeIcon 
                            icon={faPlus} title="Add Todo" 
                            onClick={handleShow} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}