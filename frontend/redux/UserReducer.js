const USER_LOGIN_OK = 'USER_LOGIN_OK';
const USER_REGISTER_OK = 'USER_REGISTER_OK';
const USER_LOGOUT = 'USER_LOGOUT';

const initialState = {
    userProfile: {},
    isLogined: false,
    token: ""
};

export const actUserRegisterOK = (data) => (dispatch) => {
    console.log("actUserRegisterOK:")
    dispatch({
        type: USER_REGISTER_OK,
        payload: data
    })
}
export const actUserLoginOK = (data) => (dispatch) => {
    console.log("actUserLoginOK:")
    dispatch({
        type: USER_LOGIN_OK,
        payload: data
    })
}
export const actUserLogout = () => (dispatch) => {
    console.log("actUserLogout:")
    dispatch({
        type: USER_LOGOUT,
    })
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case USER_LOGIN_OK:
        return {
            userProfile: action.payload.user,
            token: action.payload.token,
            isLogined: true
        };
    case USER_LOGOUT:
        return {
            userProfile: {},
            isLogined: false,
            token: ""
        };
    default:
        return state;
    }
}
