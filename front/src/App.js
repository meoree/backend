
import React, {useState} from "react";//компонент реализованный в виде функции, может пользоваться состоянием
import './App.css';
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import NavigationBar from './components/NavigationBar'
import Switch from "react-bootstrap/Switch";
import Home from "./components/Home";
import Login from "./components/Login"
import Utils from "./utils/Utils";
import {connect} from "react-redux";
import SideBar from "./components/SideBar";
import CountryListComponent from "./components/CountryListComponent";
import CountryComponent from "./components/CountryComponent";
import ArtistListComponent from "./components/ArtistListComponent";
import PaintingListComponent from "./components/PaintingListComponent";
import MuseumListComponent from "./components/MuseumListComponent";

//обертка для защищенных авторизацией маршрутов приложения.
const AuthRoute = props => {
    let user = Utils.getUserName();
    if (!user) return <Redirect to="/login" />;
    return <Route {...props} />;
};

const history = createBrowserHistory();

function App(props) {
    const [exp, setExpanded] = useState(false);

    return (
        <div className = "App">
            <Router history = { history }>
                <NavigationBar toggleSideBar={()=>setExpanded(!exp)}/>
                <div className="wrapper">
                    <SideBar expanded={exp}/>
                    <div className="container-fluid">
                        {props.error_message &&
                        <div className="alert alert-danger m-1">{props.error_message}</div>}
                        <Switch>
                            <AuthRoute path="/home" component={Home} />
                            <AuthRoute path="/countries" exact component={CountryListComponent}/>
                            <AuthRoute path="/countries/:id" component={CountryComponent}/>
                            <Route path="/login" component={Login} />
                        </Switch>
                    </div>
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