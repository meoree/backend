import Utils from "./Utils";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger/src";

/* ACTIONS
Действие, это JSON объект, содержащий поле type и дополнительные параметры.
*/

const userConstants = {
    LOGIN: 'USER_LOGIN', //вход в приложение
    LOGOUT: 'USER_LOGOUT',
};

//Константы для сообщения об ошибке и сброса ‘ошибочного состояния’
const alertConstants = {
    ERROR: 'ERROR',
    CLEAR: 'CLEAR',
};

/* ACTION GENERATORS */

export const alertActions = {
    error,
    clear
};

function error(msg) {
    return {type: alertConstants.ERROR, msg}
}

function clear() {
    return {type: alertConstants.CLEAR}
}

export const userActions = {
    login,
    logout
};

function login(user) {
    Utils.saveUser(user)
    return {type: userConstants.LOGIN, user}
}

function logout() {
    Utils.removeUser()
    return {type: userConstants.LOGOUT}
}

/* REDUCERS
*  логически не связанных между собой процессов
изменяющих состояние хранилища redux.
*  */

let user = Utils.getUserName()
const initialState = user ? {user}: {}

function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN:
            return {user: action.user};
        case userConstants.LOGOUT:
            return { };
        default:
            return state
    }
}

function alert(state = {}, action) {
    console.log("alert")
    switch(action.type) {
        case alertConstants.ERROR:
            return {msg: action.msg};
        case alertConstants.CLEAR:
            return { };
        default:
            return state
    }
}

/* STORE */

const rootReducer = combineReducers({
    authentication, alert
});

const loggerMiddleware = createLogger();//логгер, выводящий сообщения в консоль браузера


export const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware) //позволяет внедрить дополнительные обработчики в процесс управления хранилищем
);