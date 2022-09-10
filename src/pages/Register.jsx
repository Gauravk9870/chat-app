import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

import Google from "../assests/logo/google-logo.svg"
import Add from "../assests/logo/add-photo.svg"
import FormImgSvg from "../assests/images/login-img.svg"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";



const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();


  const GoogleAuthHandler = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);
      const { displayName, email, photoURL, uid } = res.user;
      const user = { displayName, email, photoURL, uid };
      const docRef = doc(db, "users", res.user.uid);
      await setDoc(docRef, user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }

  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const displayName = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const file = e.target.img.files[0];

    try {
      // create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // add user to firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // create empty users chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    }
    catch (err) {
      setErr(true);
    }
  };

  return (
    <div className='formContainer'>
      <div className="wrapper-outer">
        <div className="wrapper-inner-first">
          <div className="formOuter">
            <div className="header">
              <span>Register</span>
              <span>Enter your credentials to create your account</span>
            </div>
            <div className="auth">
              <button onClick={GoogleAuthHandler}>
                <img src={Google} alt="" />
                Sign up with Google
              </button>
            </div>

            <form className="form" onSubmit={submitHandler}>

              <div className="inputSelectImg">
                <div className="inputFeild registerUsername">
                  <label htmlFor="">Username </label>
                  <input type="text" placeholder='Username' name='username' />
                </div>

                <div className="inputImg">
                  <input type="file" id='file' style={{ display: "none" }} name="img" />
                  <label htmlFor="file">
                    <img src={Add} alt="" />
                  </label>

                </div>

              </div>
              <div className="inputFeild">
                <label htmlFor="">Email address </label>
                <input type="text" placeholder='name@gmail.com' name='email' />
              </div>
              <div className="inputFeild">
                <label htmlFor="">Password </label>
                <input type="password" placeholder='password' name='password' />
              </div>
              <div className="btn">
                <button>Sign up</button>
              </div>
              <div className="accountOrNot">
                <span>Already have an account? <span className='loginOrRegister'><Link to="/login" >Login</Link></span></span>
              </div>

            </form>
          </div>
        </div>
        <div className='wrapper-inner-second'>
          <img src={FormImgSvg} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Register