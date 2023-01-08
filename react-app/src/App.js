import React, { createContext, useState } from 'react'
//import logo from './logo.svg';
import Sidebar from './components/Sidebar'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Robots from './pages/Robots'
import Topics from './pages/Topics'
import Console from './pages/Console'

export const AppContext = createContext({defaultOptions: {
  queries: {
    refetchOnWindowFocus: false,
  },
}})

function App() {
  
  const [ros, setRos] = useState([])
  const [connection, setConnection] = useState(null)

  // ros[0]?.on("connection", () => {
  //   document.getElementById("status").innerHTML = "successful";
  //   //setConnection(true)
  //   setConnection(true)
  // });
  // ros[0]?.on("error", (error) => {
  //   document.getElementById("status").innerHTML = `errored out (${error})`;
  //   //setConnection(false)
  //   setConnection(false)
  // });

  ros?.map((item) => (
    item.newRos.on("connection", () => {
      document.getElementById("status").innerHTML = "successful";
     setConnection(true)
    })
  ))
  ros?.map((item) => (
    item.newRos.on("error", (error) => {
      document.getElementById("status").innerHTML = `errored out (${error})`;
      setConnection(false)
    })
  ))


  return (
    <AppContext.Provider value={{ros, setRos, connection}}>
      <BrowserRouter>
        <Sidebar>
          <Routes>
            <Route path='/'element={<Dashboard/>}/>
            <Route path='/dashboard'element={<Dashboard/>}/>
            <Route path='/about'element={<About/>}/>
            <Route path='/robots'element={<Robots/>}/>
            {ros?.map((item, index) => (
                <Route path={"/topics"+index} element={<Topics ros={item.newRos}/>}/>  
            ))}   
            <Route path='/topics'element={<Topics/>}/>
            <Route path='/console'element={<Console/>}/>
          </Routes>
        </Sidebar>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
