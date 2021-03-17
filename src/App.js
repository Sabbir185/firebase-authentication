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
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const [newUser, setNewUser] = useState(false);

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
    // user sign up
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
      })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    // user sign in
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then( res => {
        const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in info ', res.user);
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


  // handle fb sign in
  const handleFbSignIn = () =>{
    firebase
    .auth()
    .signInWithPopup(fbProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      var user = result.user;
      var accessToken = credential.accessToken;
      console.log(user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }


  const updateUserName = (name) =>{
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('user name updated successful');
    }).catch(function(error) {
      console.log(error);
    });
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
      <button className='btn btn-success' onClick={handleFbSignIn}>FB Sign In</button>
      {
        user.isUserSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1 className='mt-4'>User Input Authentication</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser"> New user sign up</label>

      <form onClick={handleSubmit}>
        {newUser && <input type="text" name='name' onBlur={handleBlur} placeholder='Enter Name' required className='form-control text-center mt-3'/>}
        <br/>
        <input type="text" name='email' onBlur={handleBlur} placeholder='Enter Email' required className='form-control text-center mt-2'/>
        <br/>
        <input type="password" name='password' onBlur={handleBlur} placeholder='password' required className='form-control text-center' />
        <br/>
        <input type="submit" value={newUser ? "Sign Up" : "Log In"} className='btn btn-success'/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green',fontSize:'25px'}}>User {newUser ? 'created':'logged in'} successfully!</p>
      }

    </div>
  );
}

export default App;
