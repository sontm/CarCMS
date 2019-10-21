import axios from 'axios';
import AppConstants from './AppConstants';

class Backend {
    constructor() {
    }
    createHeader() {
        //if(Cookies.get('XSRF-TOKEN')) {
            // TODO
        if (false && localStorage.getItem(AppConstants.LOCAL_CSRF_TOKEN)) {
            var headers = {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials':true,
                            'Authorization': 'CSRF-TOKEN ' + localStorage.getItem(AppContant.LOCAL_CSRF_TOKEN)
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
    postFillItemList(data, type, onOK, onError) {
        axios.post("/" + type,
            JSON.stringify(data),
            { headers: this.createHeader()})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    getAllItemList(type, onOK, onError) {
        axios.get("/" + type,
            { headers: this.createHeader()})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // USER---------------------------------------
    // login({username, password}, onOK, onError) {
    //     axios.post("/login",
    //         JSON.stringify({'username': username, 'password': password}),
    //        // { headers: this.createHeader(), withCredentials: true})
    //         { headers: this.createHeader(),})
    //         .then((response) => {onOK(response);})
    //         .catch((error) => {onError(error);});
    // }
    
    // getUserProfile(onOK, onError) {
    //     axios.get("/users/profile",
    //         { headers: this.createHeader()})
    //         .then((response) => {onOK(response);})
    //         .catch((error) => {onError(error);});
    // }


}

const backend = new Backend();
export default backend;