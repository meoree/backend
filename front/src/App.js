
import React from "react";
import './App.css';
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import NavigationBar from './components/NavigationBar'
import Switch from "react-bootstrap/Switch";
import Home from "./components/Home";
import Login from "./components/Login"
import Utils from "./utils/Utils";
import {connect} from "react-redux";

const history = createBrowserHistory();
//обертка для защищенных авторизацией маршрутов приложения.
const AuthRoute = props => {
    let user = Utils.getUserName();
    if (!user) return <Redirect to="/login" />;
    return <Route {...props} />;
};

function App(props) {
  return (
    <div className="App">
     <Router history = { history }>
         <NavigationBar/>
         <div className="container-fluid">
             {props.error_message &&
             <div className="alert alert-danger m-1">{props.error_message}</div>}
             <Switch>
                 <Route path="/home/" exact component={Home}/>
                 <Route path="/login" exact component={Login}/>
             </Switch>
         </div>
     </Router>
    </div>
  );
}

function mapStateToProps(state) {
    const {msg} = state.alert;
    return {error_message: msg};
}

export default connect(mapStateToProps)(App);
