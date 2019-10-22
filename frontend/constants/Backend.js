import axios from 'axios';
import {AsyncStorage} from 'react-native';
import AppConstants from './AppConstants';
import { connect } from 'react-redux';

class Backend {
    constructor() {
    }
    createHeader(token) {
        if (token && token.length > 15) { // TODO carefull with this 15 length of token
            var headers = {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials':true,
                            'Authorization': 'Bearer ' + token
                        };
        } else {
            var headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials':true
            };
        }
        return headers;
    }

    // Gas, Oil, Auth, Expense, Service List
    // token is JWT token
    postFillItemList(data, token, type, onOK, onError) {
        axios.post("/" + type,
            JSON.stringify(data),
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    getAllItemList(type, token, onOK, onError) {
        axios.get("/" + type,
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // USER---------------------------------------
    login({email, password}, onOK, onError) {
        axios.post("/login",
            JSON.stringify({'email': email, 'password': password}),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    registerUser(data, onOK, onError) {
        axios.post("/users",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    
    // getUserProfile(onOK, onError) {
    //     axios.get("/users/profile",
    //         { headers: this.createHeader()})
    //         .then((response) => {onOK(response);})
    //         .catch((error) => {onError(error);});
    // }


}

const backend = new Backend();
export default backend;