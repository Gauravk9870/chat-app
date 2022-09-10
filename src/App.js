import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
// import "./style.scss";
import "./test.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from "./context/AuthContext";


const App = () => {

  const {currentUser} = useContext(AuthContext);
  const ProtectedRoutes = ({children}) => {
    if(!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  } 


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes><Home/></ProtectedRoutes> }/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App