import React, { useState, useRef, useEffect } from 'react'
import logo from './logo.svg';
import Sidebar from './components/Sidebar'

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Robots from './pages/Robots'
import Topics from './pages/Topics'
import Console from './pages/Console'

function App() {
  
  


  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path='/'element={<Dashboard/>}/>
          <Route path='/dashboard'element={<Dashboard/>}/>
          <Route path='/about'element={<About/>}/>
          <Route path='/robots'element={<Robots/>}/>
          <Route path='/topics'element={<Topics/>}/>
          <Route path='/console'element={<Console/>}/>
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
