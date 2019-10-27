const TEAM_GET_OK = 'TEAM_GET_OK';
const TEAM_GET_JOIN_REQ_OK = 'TEAM_GET_JOIN_REQ_OK';

const initialState = {
    members: [],
    joinRequests: []
};

export const actTeamGetDataOK = (data) => (dispatch) => {
    console.log("actSettingSetVehicleDefault:")
    dispatch({
        type: TEAM_GET_OK,
        payload: data
    })
}

export const actTeamGetJoinRequestOK = (data) => (dispatch) => {
    console.log("actTeamGetJoinRequestOK:")
    dispatch({
        type: TEAM_GET_JOIN_REQ_OK,
        payload: data
    })
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case TEAM_GET_JOIN_REQ_OK:
        return {
            ...state,
            joinRequests: action.payload
        };
    case TEAM_GET_OK:
        return {
            ...state,
            members: action.payload
        };
    default:
        return state;
    }
}
