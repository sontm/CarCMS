const USER_LOGIN_OK = 'USER_LOGIN_OK';
const USER_REGISTER_OK = 'USER_REGISTER_OK';
const USER_LOGOUT = 'USER_LOGOUT';
const USER_CREATE_TEAM_OK = 'USER_CREATE_TEAM_OK';

const initialState = {
    teamInfo: {},//"code": "bfOdOi7L", "id": "5db0564ed74e760f4a2c3db9","name": "PhuPhuong",
    userProfile: {},//"email": "tester3","fullName": "Test3","id": "","phone": "","type": "local", teamId, teamCode
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

export const actUserCreateTeamOK = (data) => (dispatch) => {
    console.log("actCreateTeamOK:")
    dispatch({
        type: USER_CREATE_TEAM_OK,
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
    case USER_CREATE_TEAM_OK:
        return {
            ...state,
            teamInfo: action.payload
        };
    case USER_LOGIN_OK:
        return {
            ...state,
            userProfile: action.payload.user,
            token: action.payload.token,
            isLogined: true
        };
    case USER_LOGOUT:
        return {
            userProfile: {},
            isLogined: false,
            token: "",
            teamInfo: {}
        };
    default:
        return state;
    }
}
