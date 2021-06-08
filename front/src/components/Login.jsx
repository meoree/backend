import React from "react";
import BackendService from "../services/BackendService";
import Utils from "../utils/Utils";
import {connect} from "react-redux";
import {userActions} from "../utils/Rdx";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggingIn: false,
            submitted: false,
          //  error_message: null
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    /*Контроллируемая форма ввода */
    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    /*Вызывается после заполнения формы, по нажатию на кнопку Вход*/
    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true, loggingIn: true, error_message : null});
        const {username, password} = this.state;

        /*Возвращает объект Promise, который можно использовать для обработки результата запроса.
        Этот инструмент нужен для обработки операций, которые возвращают ответ через
                    неопределенное, возможно большое, время.*/
        BackendService.login(username, password)
            .then( resp => {
                this.props.dispatch(userActions.login(resp.data))
                this.props.history.push('/home')
            })
            .catch(
                //Информация об ошибке
                err => {
                   /* if (err.response && err.response.status === 401)
                        this.setState({error_message: "Ошибка авторизации"});
                    else
                        this.setState({error_message: err.message});*/
                    this.state({loggingIn: false})
                }
            )
    }

    /* Извлекает, нужные для прорисовки, значения из объекта состояния */
    render() {

       // console.log("render") //для отладки
        let {submitted, username, password, loggingIn} = this.state;
        return (
            <div className="col-md-6 mr-0">
                {/*
                    this.state.error_message &&
                    <div className="alert alert-danger mt-1 mr-0 ml-0"> {this.state.error_message}</div>*/
                }
                <h2>Вход</h2>
                {/* Изменяет состояние флажка submitted, поэтому компонент перерисовывается */}
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Логин</label>
                        <input type="text" className={'form-control' + (submitted && !username ? 'is-invalid' : '')}
                               name="username" value={username}
                               onChange={this.handleChange}/>
                        {submitted && !username &&
                        <div classname="help-block text-danger">Введите имя пользователя</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" className={'form-control' + (submitted && !password ? 'is-invalid' : '')}
                               name="password" value={password}
                               onChange={this.handleChange}/>
                        {submitted && !password && <div className="help-block text-danger">Введите пароль</div>}
                    </div>
                    <div><label htmlFor=""></label></div>
                    <div className="form-group">
                        <button className="btn btn-primary">
                            {loggingIn &&
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            Вход
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect()(Login);