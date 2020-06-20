import React, {useState, useEffect} from 'react'

import {Form, Select, InputNumber, Switch, Radio, Slider, Button, Upload, Rate, Checkbox, Row, Col,} from 'antd';

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function Mocks() {
    const [problemRange, setProblemRange] = useState([1, 25])
    const [problemNumber, setProblemNumber] = useState(25);
    const [topics, setTopics] = useState([]);
    const [timed, setTimed] = useState(true);

    const generateMock = (e) => {
        console.log("Problem Range:", problemRange, "\nNumber of Problems:", problemNumber, "\nTopics:", topics, "\nTimed:", timed)
    }

    return (
        <div style={{position:"absolute", width:"100%", height:"calc(100% - 65px)", marginLeft:"0px", marginRight:"0px", 
            minHeight:"700px", display:"flex", backgroundColor:"#c7f6ff", justifyContent:"center", flexWrap:"wrap",}}>
            <Form
                name="validate_other"
                style={{width:"calc(20% + 200px)", minWidth:"360px", marginTop:"calc(30px + 2%)", 
                    marginBottom:"100px", backgroundColor:"white", padding:"40px", paddingTop:"60px",}}
                onFinish={generateMock}
            >
                <div style={{fontSize:"25px", marginBottom:"40px",}}>Custom Test Parameters</div>
                <Form.Item
                    name="topics"
                    label="Topics"
                    style={{backgroundColor:"36cfc9"}}
                    rules={[{ required: true, message: 'Select some topics!' }]}
                >
                    <Select onChange={(value) => setTopics(value)} mode="multiple" placeholder="Select your topics!">
                        <Option value="Algebra">Algebra</Option>
                        <Option value="Combinatorics">Combinatorics</Option>
                        <Option value="Number Theory">Number Theory</Option>
                        <Option value="Geometry">Geometry</Option>
                        <Option value="Complex Analysis">Complex Analysis</Option>
                        <Option value="Miscellaneous">Miscellaneous</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="questions" label="No. of Questions" style={{marginTop:"45px",}}>
                    <Slider
                    min={5}
                    max={35}
                    defaultValue={25}
                    onChange={(value) => {setProblemNumber(value)}}
                    marks={{
                        5: '5',
                        15: '15',
                        25: '25',
                        35: '35'
                    }}
                    />
                </Form.Item>

                <Form.Item name="question-range" label="Question Range" style={{marginTop:"35px",}}>
                    <Slider
                        range
                        min={1}
                        max={25}
                        defaultValue={problemRange}
                        onChange={(value) => {setProblemRange(value)}}
                        marks={{
                        1: '1',
                        5: '5',
                        10: '10',
                        15: '15',
                        20: '20',
                        25: '25',
                    }}
                    />
                </Form.Item>

                <Form.Item name="timed" style={{marginTop:"30px",}} label="Timed" valuePropName="checked">
                    <Switch defaultValue={timed} onChange={(value) => setTimed(value)}/>
                </Form.Item>
                
                <Form.Item style={{ width:"100%", marginTop:"50px", display:"flex", justifyContent:"center",}}>
                    <Button type="primary" htmlType="submit">
                        Generate your mock contest!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
