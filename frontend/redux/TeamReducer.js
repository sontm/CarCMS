import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
const TEMP_CALCULATE_TEAMCARREPORT = 'TEMP_CALCULATE_TEAMCARREPORT';
const TEMP_CAR_LIST = 'TEMP_CAR_LIST';

const TEAM_GET_OK = 'TEAM_GET_OK';
const TEAM_GET_JOIN_REQ_OK = 'TEAM_GET_JOIN_REQ_OK';

const initialState = {
    members: [],
    joinRequests: [],
    teamCarList:[], // will have new "ownerFullName" as fullname of user
    teamCarReports: {}
};


export const actTempCalculateTeamCarReport = (currentVehicle, dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    console.log("actTempCalculateTeamCarReport cALEED WITH:" + currentVehicle.id)
    // For calcualte All Time data
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }

    AppUtils.actTempCalculateCarReportAsync(currentVehicle, options)
    .then (result => {
        dispatch({
            type: TEMP_CALCULATE_TEAMCARREPORT,
            payload: {id: currentVehicle.id, data: result}
        })
    })
    .catch (error => {
        console.log(error)
    })

}

export const actTeamGetDataOK = (data) => (dispatch) => {
    console.log("actTeamGetDataOK:")
    dispatch({
        type: TEAM_GET_OK,
        payload: data
    })
    
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
        // Calculate Data for each Car here
        let teamCarList = [];
        action.payload.forEach (mem => { // Each Member
            let newCarList = [];
            mem.vehicleList.forEach(item => {
                //New information
                item.ownerFullName = mem.fullName;
                newCarList.push(item);
            })
            teamCarList.push(...newCarList);
        })

        return {
            ...state,
            members: action.payload,
            carReports:{}, // {id: {gasReport,oilReport,authReport,moneyReport}}
            teamCarList:teamCarList,
            teamCarReports: {}
        };
    case TEMP_CALCULATE_TEAMCARREPORT:
        let newStateTeam = {
            ...state,
        };
        newStateTeam.teamCarReports[""+action.payload.id] = action.payload.data

        return newStateTeam;
    case TEMP_CAR_LIST:
        return {
            ...state,
            teamCarList: action.payload
        }
    default:
        return state;
    }
}
