import React from 'react'
import Mainpage from '../components/mainpage/Mainpage'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

export default function Routes() {
    return (
        <Router>
            <Switch>
                <Route exact path="/(home|problems|mocks|)" component={Mainpage}/>
            </Switch>
        </Router>
    )
}
