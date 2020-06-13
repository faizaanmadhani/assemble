import React, { Component } from 'react'
import Navbar from '../../layout/navigation/Navbar.js'
import MathJax from 'react-mathjax'

import { Radio, Layout, Grid } from 'antd';
import Homepagecontent from './Homepagecontent';
import QueueAnim from 'rc-queue-anim';

const { Header, Content, Footer } = Layout;

const { useBreakpoint } = Grid;

function Homepage() {
    return (
        <Layout style={{display:"flex",}} className="layout">
            <Header style={headerStyle()}>
                <Navbar screenSize={window.innerWidth} breakpoint={useBreakpoint()}/>
            </Header>
            <Content style={{margin:"0x", backgroundColor:"#36cfc9", paddingBottom:"680px", width:"100%", position:"relative", justifyContent:"center", textAlign:"center"}}>
                <Homepagecontent breakpoint={useBreakpoint()}/>         
            </Content>
            <Footer style={{textAlign:"center", backgroundColor:"white"}}>
            </Footer>
        </Layout>
    )
}

const headerStyle = () => {
    return {
        zIndex: '1',
        backgroundColor:"#fff",
        width:'100%',
        display:'inline-flex',
        justifyContent:'left',
        position:"fixed",
    }
}

export default Homepage;