import React, { useState, useEffect, useRef } from 'react';
import readXlsxFile from 'read-excel-file';
import { Modal, Button, Table } from "react-bootstrap";

import $ from 'jquery';

import AppNavbar from "./AppNavbar";

export default function App() {
    const [subject, setSubject] = useState('Subject');
    const [students, setStudents] = useState([]);
    const [show, setShow] = useState(false);
    const [invite, setInvite] = useState(false);
    const [file_valid, fileValid] = useState(false);
    const [sending, setSending] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const fileInput = useRef(null);

    function handleShow() {
        setShow(true);
    }

    function handleClose() {
        setShow(false);
    }

    function handleInviteShow() {
        setInvite(true);
    }

    function handleInviteClose() {
        setInvite(false);
    }

    function handleChange() {
        let fileName = fileInput.current.value.split("\\").pop();
        let data = fileName.split('.');
        let ext = data[1];

        if (ext === 'xlsx') {
            fileValid(true);
        } else {
            fileValid(false);
        }

        let label = fileInput.current.nextElementSibling;
        label.innerText = fileName;
    }

    function handleStudentsUpdate(id, email) {
        const newStudents = [...students];
        const student = newStudents.find(student => student.id === id);
        student.email = email;
        setStudents(newStudents);
    }

    function handleStudentsSent(id, stat) {
        const newStudents = [...students];
        const student = newStudents.find(student => student.id === id);
        student.sent = stat === 'err' ? false:true;
        setStudents(newStudents);
    }

    function handleSend() {
        let name = document.getElementById('name').value;
        let gmail = document.getElementById('gmail').value;
        let password = document.getElementById('password').value;
        let link = document.getElementById('invitation_link').value;

        if (name === '') {
            setErrMsg('Invalid name.');
            return;
        }

        if (gmail === '') {
            setErrMsg('Invalid email.');
            return;
        }

        if (password === '') {
            setErrMsg('Invalid password.');
            return;
        }

        if (link === '') {
            setErrMsg('Invalid link.');
            return;
        }

        setSending(true);

        students.forEach(student => {
            let data = {
                "name": name,
                "gmail": gmail,
                "password": password,
                "subject": subject,
                "recipient": student.email,
                "link": link
            };

            $.ajax({
                url: 'http://192.168.1.248/mailit/index.php',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: data,
                success: function(response) {
                    handleStudentsSent(student.id, response.status)
                }
            });
        });

        setSending(false);
    }

    async function handleUpload() {
        if (file_valid) {
            let file = document.getElementById('fileInput')
            let results = await readXlsxFile(file.files[0]).then((rows) => {
                return rows;
            });

            let students = [];
            results.forEach(row => {
                let data = {
                    name: row[0],
                    id: row[1],
                    course: row[2],
                    ld: row[3],
                    cn: row[4],
                    city: row[5],
                    email: '',
                    sent: false
                };
                students.push(data);
            });

            setSubject(students[0].name);
            students.shift();
            students.shift();
            setStudents(students);
            setShow(false);
        } else {
            alert('File is not valid!');
        }
    }

    return (
        <>
            <AppNavbar handleShow={ handleShow } />
            <div className="p-3 d-flex align-content-center justify-content-between">
                <h4>{ subject }</h4>
                { students.filter(student => student.sent == false).length > 0 ? (sending ? '':<Button variant="primary" onClick={ handleInviteShow }>Send All Invitation</Button>) : '' }
            </div>
            <div className="viewPort px-3 pb-3">
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Email Address</th>
                            <th>Name</th>
                            <th>ID Number</th>
                            <th>Course & Year</th>
                            <th>Learning Delivery</th>
                            <th>Contact Number</th>
                            <th>Municipality/City</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        students.map(student => {
                            return <Item key={ student.id } student={ student } handleStudentsUpdate={ handleStudentsUpdate } />
                        })
                    }
                    </tbody>
                </Table>
            </div>
            <Modal show={show} onHide={ handleClose }>
                <Modal.Header closeButton>
                    <Modal.Title>Select Excel File</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="fileInput"
                               ref={fileInput} onChange={ handleChange } />
                        <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <span className="mr-auto"><b>Note: xlsx file only!</b></span>
                    <Button variant="primary" onClick={ handleUpload }>Upload</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={invite} onHide={ handleInviteClose }>
                <Modal.Header closeButton>
                    <Modal.Title>Send All Invitation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="name">Your Name:</label>
                        <input type="text" className="form-control" id="name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gmail">Gmail:</label>
                        <input type="text" className="form-control" id="gmail" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <input type="text" className="form-control" id="message" value={ subject } readOnly="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="invitation_link">Invitation Link:</label>
                        <input type="text" className="form-control" id="invitation_link" />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <span className="mr-auto">{ errMsg }</span>
                    <Button variant="primary" onClick={ handleSend }>Send Now</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function Item({ student, handleStudentsUpdate }) {
    const { name, id, course, ld, cn, city, email, sent } = student;
    let data1 = student.name.replace(' ', '');
    let data2 = data1.split('.');
    let data3 = data2[1].split(',');
    let firstname = data3[1].replace(/ /g, "");
    let email_add = firstname + '.' + data3[0] + '@nmsc.edu.ph';

    useEffect(() => {
        handleStudentsUpdate(id, email_add.toLowerCase());
    }, [])

    return (
        <tr>
            <td>{ sent ? 'Sent':'Failed'}</td>
            <td>{ email }</td>
            <td>{ name }</td>
            <td>{ id }</td>
            <td>{ course }</td>
            <td>{ ld }</td>
            <td>{ cn }</td>
            <td>{ city }</td>
        </tr>
    );
}