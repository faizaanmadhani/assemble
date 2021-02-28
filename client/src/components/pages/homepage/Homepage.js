import React, { Component } from 'react'
import {Radio, Button} from 'antd'
import Animate from 'rc-animate'

class Homepage extends Component {
    state = {
        current: 1,
      };

    onChange = (e) => {
        console.log(e.target.value)
        this.setState({
                current: e.target.value,
            })
      };

    buttonStyle = (id) => {
        if (id == this.state.current) 
        { 
            return {
                paddingLeft: "11px",
                paddingRight: "11px",
                margin:"6px",
                fontSize:"12px",
                fontStyle:"bold", 
                borderWidth:"1.5px",
                borderColor:"#40a9ff", 
                backgroundColor:"white",
        } 
    } 
        else {
            return {
                paddingLeft: "11px",
                paddingRight: "11px",
                margin:"6px",
                fontSize:"12px",
                fontStyle:"bold", 
                borderWidth:"1.5px",
                borderColor:"white",
                backgroundColor:"#f2f2f2",
            }
        }
    }

    imageStyle = () => {
        if(this.props.breakpoint.xl) {
            return {
                position:"absolute", 
                left:"37px", 
                top:"200px", 
            }
        }
        else {
            return {
                position:"absolute", 
                left:"9%", 
                top:"23%", 
                maxWidth:"80%",
            }
        }
    }

    getComponent = () => { 
        if (this.state.current == 1) {
            return (
                <img style={this.imageStyle()} src={require("../../../images/aops-logo.png")}/>
            )
        }
    }

    render() {
        return (
            <React.Fragment>
            <div style={{margin:"0x", backgroundColor:"#c7f6ff", paddingBottom:"680px", width:"100%", position:"relative", justifyContent:"center", textAlign:"center"}}>
                <Animate component=""
                        transitionName="fade">
                        {this.getComponent()}
                </Animate>
                <Animate component=""
                        transitionName="fade">
                    <div style={{position:"absolute", right:"25px", bottom:"25px", }}>
                        <Radio.Group onChange={this.handleSizeChange}>
                            <Radio.Button value="1" style={this.buttonStyle(1)} onClick={this.onChange}>1</Radio.Button>
                            <Radio.Button value="2" style={this.buttonStyle(2)} onClick={this.onChange}>2</Radio.Button>
                            <Radio.Button value="3" style={this.buttonStyle(3)} onClick={this.onChange}>3</Radio.Button>
                            <Radio.Button value="4" style={this.buttonStyle(4)} onClick={this.onChange}>4</Radio.Button>
                        </Radio.Group>
                    </div>
                </Animate>
            </div>
            </React.Fragment>
        )
    }
}

export default Homepage
