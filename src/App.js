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
    password:'',
    photo:'',
    error:'',
    success: false
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
        photo:'',
        
      }
      setUser(UserSignOut);
    })
    .catch( err => {
      console.log(err);
    })

    alert('User sign out successful !');
  }


  // user input
  // handle submit
  const handleSubmit = (event) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res)
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
      })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    event.preventDefault();
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
      const isPassword = event.target.value.length > 5;
      const isPasswordNumber = /\d{1}/.test(event.target.value)
      isFieldValid = isPasswordNumber && isPassword;
    }

    if(isFieldValid){
      const newUserID = {...user};
      newUserID[event.target.name] = event.target.value;
      setUser(newUserID);
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

      <p>Name : {user.name}</p>
      <p>Email : {user.email}</p>
      <p>Password : {user.password}</p>

      <form onClick={handleSubmit}>
        <input type="text" name='name' onBlur={handleBlur} placeholder='Enter Name' required className='form-control text-center mt-3'/>
        <br/>
        <input type="text" name='email' onBlur={handleBlur} placeholder='Enter Email' required className='form-control text-center mt-2'/>
        <br/>
        <input type="password" name='password' onBlur={handleBlur} placeholder='password' required className='form-control text-center' />
        <br/>
        <input type="submit" value="Submit" className='btn btn-success'/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green',fontSize:'25px'}}>You have successfully registered!</p>
      }

    </div>
  );
}

export default App;
