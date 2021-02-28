import React from 'react'
import Navbar from '../layout/navigation/Navbar.js'

import { Layout, Grid } from 'antd';
import Homepage from '../pages/homepage/Homepage';
import Mocks from '../pages/mocks/Mocks';
import ProblemsPage from '../pages/problems/ProblemsPage'
import QueueAnim from 'rc-queue-anim';

import { Route, withRouter, Switch } from 'react-router-dom'


const { Header, Content, Footer } = Layout;

const { useBreakpoint } = Grid;

function Mainpage() {
    return (
        <Layout style={{display:"flex",}} className="layout">
            <Header style={headerStyle()}>
                <Navbar screenSize={window.innerWidth} breakpoint={useBreakpoint()}/>
            </Header>
            <Content>
                <Switch>
                    <Route exact path="/(home|)"><Homepage breakpoint={useBreakpoint()}/></Route>
                    <Route exact path="/mocks"><Mocks breakpoint={useBreakpoint()}/></Route>
                    <Route exact path="/problems"><ProblemsPage breakpoint={useBreakpoint()}/></Route>
                </Switch>     
            </Content>
        </Layout>
    )
}
/* <Footer style={{textAlign:"center", backgroundColor:"white"}}>
    </Footer> */

const headerStyle = () => {
    return {
        zIndex: '1',
        backgroundColor:"#fff",
        width:'100%',
        display:'inline-flex',
        justifyContent:'left',
        position:"relative",
    }
}

export default withRouter(Mainpage);