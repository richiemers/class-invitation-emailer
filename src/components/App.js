import React, { useState, useEffect, useRef } from 'react';
import uuid from "react-uuid";
import { Modal, Button } from 'react-bootstrap';

import AppNavbar from './AppNavbar';
import TodoItem from './TodoItem';

const LOCAL_STORAGE_KEY = 'richi.todos';

export default function App() {
    const [hasInternet, setHasInternet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [todos, setTodos] = useState([]);
    const [show, setShow] = useState(false);
    const [actionMsg, setActionMsg] = useState(null);

    const todoName = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setHasInternet(navigator.onLine)
    }, [navigator.onLine]);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (storedTodos) setTodos(storedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    function handleAddTodo (e) {
        const description = todoName.current.value;
        if (description.length < 1) {
            setActionMsg('Invalid todo description.');
            return;
        }
        setTodos(prevTodos => {
            return [...prevTodos, { id: uuid(), title: description, completed: false }];
        });
        todoName.current.value = null;
        setActionMsg(null);
        setShow(false);
    }

    function toggleTodo(id) {
        const currentTodos = [...todos];
        const todo = currentTodos.find(todo => todo.id === id);
        todo.completed = !todo.completed;
        setTodos(currentTodos);
    }

    function handleSelectAll() {
        const currentTodos = [...todos];
        currentTodos.map(todo => todo.completed = !selectAll);
        setTodos(currentTodos);
        setSelectAll(!selectAll);
    }

    function toggleSelectAll() {
        const currentTodos = [...todos];
        if (currentTodos.length === currentTodos.filter(todo => todo.completed).length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }

    function handleClearTodos() {
        const currentTodos = todos.filter(todo => !todo.completed);
        setTodos(currentTodos);
        setSelectAll(false);
    }

    function handleLoadFromInternet() {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(data => {
                setTodos(data);
                setLoading(false);
            });
    }

    const moreTodos = todos.filter(todo => !todo.completed).length;

    return (
        <>
            <AppNavbar 
                handleShow={handleShow} 
                handleClearTodos={handleClearTodos}
                handleLoadFromInternet={handleLoadFromInternet}
                handleSelectAll={handleSelectAll}
                selectAll={selectAll}
                todosLength={moreTodos} />
            <div className="smDevice p-2 text-right text-secondary">{moreTodos > 0 ? moreTodos + ' more incomplete todos.':''}</div>    
            <div className="container-fluid pb-3 pt-2">
                {hasInternet ? '':<div className="p-2">No internet connection!</div>}
                {loading && hasInternet ? <div className="p-2">Loading from internet..</div>:''}
                {todos.length < 1 && !loading ? <div className="p-2">No todo created!</div>:''}
                {todos.map(todo => <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} toggleSelectAll={toggleSelectAll} />)}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input type="text" ref={todoName} className="form-control" id="description" />
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between align-content-center">
                    <div>{ actionMsg }</div>
                    <Button variant="primary" onClick={handleAddTodo}>Save</Button>
                </Modal.Footer>
            </Modal>
            <div className="about">
                Richie Mers Software Creation 2020.
            </div>
        </>
    );

}