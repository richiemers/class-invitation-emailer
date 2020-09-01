import React from 'react';

export default function TodoItem({ todo, toggleTodo, toggleSelectAll }) {

    function handleTodoClick() {
        toggleTodo(todo.id);
        toggleSelectAll();
    }

    return (
        <div className="p-2 mb-2 d-flex align-items-center justify-content-between todo">
            <div className="">
                <h4>{ todo.title }</h4>
                <small className="text-secondary">{todo.completed ? 'Completed':'Not yet done.'}</small>
            </div>
            <div className="custom-control custom-checkbox">
                <input 
                    type="checkbox" 
                    className="custom-control-input" 
                    id={'check' + todo.id}
                    checked={todo.completed}
                    onChange={handleTodoClick} />
                <label className="custom-control-label" htmlFor={'check' + todo.id}></label>
            </div>
        </div>
    );
}