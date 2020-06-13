import React, { Component } from 'react'

import { Drawer, Menu, Button, Form, Col, Row, Input, Select, DatePicker  } from 'antd';
import { PlusOutlined, MenuOutlined, PieChartOutlined, ContainerOutlined, DesktopOutlined, MenuFoldOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu

const { Option } = Select;

class Navbar extends Component {
    state = { 
        visible: false,
    };

    mainMenuStyle = () => {
        return {
            borderWidth:"0px",
            position:"relative",
        }
    }

    titleStyle = () => {
        if(!this.props.breakpoint.lg) {
            return {
                paddingRight: "50px",
                fontSize: "20px",
                whiteSpace: "nowrap",
                position:"absolute",
                left:"30px",
            }
        }
        else {
            return {
                paddingRight: "50px",
                fontSize: "20px",
                whiteSpace: "nowrap",
            }
        }
    }

    
        
    toggleCollapsed = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };
    
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    //onMouseEnter={() => setIsShown(true)}
    //onMouseLeave={() => setIsShown(false) }
    
    mainNav = (
        <Menu style={this.mainMenuStyle()} mode="horizontal" theme="light" align="center" >
            <Menu.Item icon={<MailOutlined />}>
                Home 
            </Menu.Item>
            <Menu.Item icon={<AppstoreOutlined />}>
                Problems
            </Menu.Item>
            <Menu.Item>
                Mock Problem Sets    
            </Menu.Item>
            <SubMenu icon={<SettingOutlined />} title="Navigation Three - Submenu">
                <Menu.ItemGroup title="Item 1">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
                </Menu.ItemGroup>
            </SubMenu>
        </Menu>
    )

    collapsedNav = (
        <React.Fragment>
          <Button type="primary" shape="round" size="lg" style={{paddingTop:"2.3px", boxShadow:"none", textShadow:"none", display:"inline", margin:"0px", position:"absolute", right:"85px", top:"26%", backgroundColor:"#fff", color:"black", borderWidth:"1.5px", borderColor:"gray"}}>
            Sign up
          </Button>
          <Button type="primary" onClick={this.showDrawer} style={{shadow:"none", textShadow:"none", display:"inline", position:"absolute", right:"25px", top:"26%", backgroundColor:"#d9d9d9", borderColor:"black", borderWidth:"0px"}}>
            <MenuOutlined style={{color: "black"}}/>
          </Button>
        </React.Fragment>
    ) 

    render() {
        return (
            <React.Fragment>
                <div>
                    <h1 style={this.titleStyle()}>Mock AMC</h1>
                </div>
                {this.props.breakpoint.lg? this.mainNav : this.collapsedNav}
                <Drawer
                    title="Create a new account"
                    width={280}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={<div style={{textAlign: 'right',}}>
                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button onClick={this.onClose} type="primary">
                  Submit
                </Button>
              </div>
            }>
            <Menu mode="inline" openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} style={{ width:"280px", position:"absolute", left:"0px", }}>
              <SubMenu
                key="sub1"
                title={<span><MailOutlined /><span>Navigation One</span></span>}>
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="7">Option 7</Menu.Item>
                  <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </Menu>
          </Drawer>
          </React.Fragment>
        )
    }
}

export default Navbar;