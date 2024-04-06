// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Registration from './components/Registration';
import RegSuccess from './components/RegSuccess';
import LoginSuccess from './components/LoginSuccess';
import ForgetPassword from './components/ForgetPassword';
import Dashboard from './components/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />


        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/regsuccess" element={<RegSuccess />} />
        <Route path="/loginsuccess" element={<LoginSuccess />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;