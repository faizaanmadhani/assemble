import React from 'react';
import logo from './logo.svg';

import Routes from './routes/Routes'

import './App.css';
import { BrowserRouter as Router, Route }  from 'react-router-dom'
import 'antd/dist/antd.css'


function App() {
  return (
    <Routes/>
  );
}

export default App;
