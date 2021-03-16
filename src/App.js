import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);


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

  return (
    <div className='App'>
      {
        user.isUserSignIn ? <button className='btn btn-warning  mb-5' onClick={handleSignOut}>Sign Out</button> :
        <button className='btn btn-primary' onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isUserSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
