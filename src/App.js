import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else{
  firebase.app();
}


function App() {
  const provider = new firebase.auth.GoogleAuthProvider();

  const [user, setUser] = useState({
    isUserSignIn: false,
    name:'',
    email:'',
    photo:''
  })

  const handleSignIn = () =>{
    firebase.auth()
    .signInWithPopup(provider)
    .then( res => {
      const {displayName, email, photoURL} = res.user;
      const signedInUser = {
        isUserSignIn: true,
        name : displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const UserSignOut = {
        isUserSignIn: false,
        name:'',
        email:'',
        photo:''
      }
      setUser(UserSignOut);
    })
    .catch( err => {
      console.log(err);
    })

    alert('User sign out successful !');
  }


  // user input
  const inputHandle = () => {

  }

  const changeHandler = (event) => {
    console.log(event.target.name, event.target.value)
    if(event.target.name === 'email'){
      const isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
      console.log(isEmailValid);
    }
    if(event.target.name === 'password'){
      const isValidPassword = /\d{1}/.test(event.target.value)
        console.log(isValidPassword);
    }
  }

  return (
    <div className='App'>
      {
        user.isUserSignIn ? <button className='btn btn-warning  mb-5' onClick={handleSignOut}>Sign Out</button> :
        <button className='btn btn-primary' onClick={handleSignIn}>Sign in with gmail</button>
      }
      {
        user.isUserSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1 className='mt-4'>User Input Authentication</h1>
      <form onClick={inputHandle}>
        <input type="text" name='email' onBlur={changeHandler} placeholder='Enter Email' required className='form-control text-center mt-3'/>
        <br/>
        <input type="password" name='password' onBlur={changeHandler} placeholder='password' required className='form-control text-center' />
        <br/>
        <input type="submit" value="Submit" className='btn btn-success'/>
      </form>

    </div>
  );
}

export default App;
