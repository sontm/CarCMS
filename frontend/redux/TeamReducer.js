import {actTempCalculateTeamCarReport, actTempSetTeamCarList} from './TempDataReducer'

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
    

    // Calculate Data for each Car here
    let teamCarList = [];
    data.forEach (mem => { // Each Member
        teamCarList.push(...mem.vehicleList);
    })
    actTempSetTeamCarList(teamCarList, dispatch);

    data.forEach (mem => {
        mem.vehicleList.forEach((item, idx) => {
            actTempCalculateTeamCarReport(item, dispatch)
        })
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
