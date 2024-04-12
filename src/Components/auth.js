import React, {useState} from 'react';
import {Button, Form, Col, Row} from 'react-bootstrap';
import { auth , googleProvider} from '../Config/firbase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth, email, password)
        } catch(error){
          console.log(error)
        }
    }

    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleProvider)
        } catch(error){
          console.log(error)
        }
    }

    const logOut = async () => {
        try{
            await signOut(auth)
        } catch(error){
          console.log(error)
        }
    }

    //console.log(auth?.currentUser?.email)

  return (
    <>
     <Row>
        <Col md={{span: 6, offset:3}}>
            <Form>
                <Form.Group className="mb-3 mt-5" >
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group> 
                <Form.Group className="mb-3 mt-3" >
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button className='mx-2' variant="primary" type="submit" onClick={signIn}>
                    Sign In
                </Button>
                <Button className='mx-2' variant="secondary" type="submit" onClick={signInWithGoogle}>
                    Sign In With Google
                </Button>
                <Button variant="danger" type="submit" onClick={logOut}>
                    LogOut
                </Button>
            </Form>
        </Col>
    </Row>
    </>
  )
}

export default Auth