import React from 'react';
import logo from './logo.svg';

import Homepage from './components/pages/Mainpage/Homepage'

import './App.css';
import { BrowserRouter as Router, Route }  from 'react-router-dom'
import 'antd/dist/antd.css'


function App() {
  return (
    <Homepage/>
  );
}

export default App;
