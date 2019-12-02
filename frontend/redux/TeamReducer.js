import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
const TEMP_CALCULATE_TEAMCARREPORT = 'TEMP_CALCULATE_TEAMCARREPORT';

const TEMP_CALCULATE_TEAMCARREPORT_ALL = 'TEMP_CALCULATE_TEAMCARREPORT_ALL';

const TEMP_CAR_LIST = 'TEMP_CAR_LIST';

const TEAM_GET_OK = 'TEAM_GET_OK';
const TEAM_GET_JOIN_REQ_OK = 'TEAM_GET_JOIN_REQ_OK';

const TEMP_USER_LOGOUT = 'TEMP_USER_LOGOUT';

const initialState = {
    members: [],
    joinRequests: [],
    teamCarList:[], // will have new "ownerFullName" as fullname of user
    teamCarReports: {},
    lastSyncFromServerOn: null
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

    AppUtils.actTempCalculateCarReportAsyncWrapper(currentVehicle, options)
    .then (result => {
        console.log("  OK Team Calculate Report:" + currentVehicle.licensePlate)
        dispatch({
            type: TEMP_CALCULATE_TEAMCARREPORT,
            payload: {id: currentVehicle.id, data: result}
        })
    })
    .catch (error => {
        console.log("  Error Team Calculate Report:" + currentVehicle.licensePlate)
        console.log(error)
    })
}

export const actTeamUserWillLogout = () => (dispatch) => {
    console.log("actTeamUserWillLogout:")
    dispatch({
        type: TEMP_USER_LOGOUT,
    })
}

export const actTeamGetDataOK = (data) => (dispatch) => {
    console.log("actTeamGetDataOK:")
    dispatch({
        type: TEAM_GET_OK,
        payload: data
    })
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }

    let teamCarReportsAll = {};
    data.forEach ((mem, idxMem )=> {
        mem.vehicleList.forEach((item, idx) => {
            //actTempCalculateTeamCarReport(item, dispatch)
            AppUtils.actTempCalculateCarReportAsyncWrapper(item, options)
            .then (result => {
                console.log("  OK Team Calculate Report:" + item.licensePlate)
                teamCarReportsAll[""+item.id] = result

                if ( idxMem == data.length -1 && idx == mem.vehicleList.length-1) {
                    console.log("======================= Final Dispatch Team Reports")
                    dispatch({
                        type: TEMP_CALCULATE_TEAMCARREPORT_ALL,
                        payload: teamCarReportsAll
                    })
                }
            })
            .catch (error => {
                console.log("  Error Team Calculate Report:" + item.licensePlate)
                console.log(error)
            })
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
            teamCarReports: {},
            lastSyncFromServerOn: new Date()
        };
    case TEMP_CALCULATE_TEAMCARREPORT:
        let newStateTeam = {
            ...state,
        };
        newStateTeam.teamCarReports[""+action.payload.id] = action.payload.data

        return newStateTeam;
    case TEMP_CALCULATE_TEAMCARREPORT_ALL:
        let newStateTeamAll = {
            ...state,
        };
        newStateTeamAll.teamCarReports = action.payload

        return newStateTeamAll;
    case TEMP_CAR_LIST:
        return {
            ...state,
            teamCarList: action.payload
        }
    case TEMP_USER_LOGOUT:
        return {
            members: [],
            joinRequests: [],
            teamCarList:[], // will have new "ownerFullName" as fullname of user
            teamCarReports: {},
            lastSyncFromServerOn: null
        }
    default:
        return state;
    }
}
