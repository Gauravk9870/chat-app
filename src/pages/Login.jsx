import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import Google from "../assests/logo/google-logo.svg"
import FormImgSvg from "../assests/images/login-img.svg"


const Login = () => {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

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
              <span>Login</span>
              <span>Enter your credentials to access your account</span>
            </div>
            <div className="auth">
              <button>
                <img src={Google} alt="" />
                Login with Google
              </button>
            </div>
            <div
              style={{
                textAlign: "center",
                width: "80%",
                color: "gray",
                marginBottom: "30px"

              }}>
              or
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputFeild">
                <label htmlFor="">Email address </label>
                <input type="text" placeholder='name@gmail.com' name="email" />
              </div>
              <div className="inputFeild">
                <label htmlFor="">Password </label>
                <input type="password" placeholder='password' name="password" />
              </div>
              <div className="btn">
                <button>Login</button>
              </div>

              {err && <span className='err' style={{ textAlign: "center", color: "red", fontSize: "12px" }}>Something went wrong </span>}

              <div className="accountOrNot">
                <span>Don't have an account? <span style={{ color: "#2f69fe", cursor: "pointer" }}><Link to="/register">Sign up</Link></span></span>
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

export default Login