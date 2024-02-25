import React from 'react'
import "./Home.css"



const Home = () => {

  const isAuthToken = localStorage.getItem('auth-token');


  return (
    <div className='home'>{isAuthToken ? "Welcome to our website" : "Please click on login to proceed"}</div>
  )
}

export default Home