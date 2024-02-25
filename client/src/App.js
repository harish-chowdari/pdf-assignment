import React from 'react'
import "./App.css"
import Navbar from './Components/Navbar/Navbar.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import PdfForm from "./Components/PdfForm/PdfForm.jsx"
import Home from './Components/Home/Home.jsx'


const App = () => {

  const authToken = localStorage.getItem('auth-token');


  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Routes>
        
          
          <Route path='/' element={<Home/>} />

          <Route path="/login" element={<Login />} />

          <Route path='/signup' element={<Signup/>} />
          {authToken && <Route path='/pdf' element={<PdfForm/>} />}
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
