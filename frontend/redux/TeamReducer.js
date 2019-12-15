import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
var _ = require('lodash');

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

export const actTeamGetDataOK = (data, userData, oldTeamData) => (dispatch) => {
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

    let myCarIdArr = [];
    userData.vehicleList.forEach(item => {
        myCarIdArr.push(item.id);
    })

    let teamCarReportsAll = {};
    let needProcessCount = 0;
    let doneProcessCount = 0;
    for (let idxMem = 0; idxMem < data.length; idxMem++) {
        let mem = data[idxMem];
    //data.forEach ((mem, idxMem )=> {
        // if (mem.id == userData.userProfile.id) {
        //     // nothing
        // } else 
        for (let idx = 0; idx < mem.vehicleList.length; idx++) {
            let item = mem.vehicleList[idx];
        //mem.vehicleList.forEach((item, idx) => {
            // If Exclude My Car, NoNeed
            if (userData.teamInfo.excludeMyCar && myCarIdArr.indexOf(item.id) >= 0 ) {
                // no thing
            } else {
                // Deep Compare Object here
                let isSameData = false;
                if (oldTeamData && oldTeamData.teamCarList && oldTeamData.teamCarList.length > 0) {
                    for (let l = 0; l < oldTeamData.teamCarList.length; l++) {
                       if (oldTeamData.teamCarList[l].id == item.id) {
                            //Found Matched Vehicle, Compare is Same
                            // comapre every data because there is ownerName added to each car
                            if (_.isEqual(item.fillGasList, oldTeamData.teamCarList[l].fillGasList) &&
                                    _.isEqual(item.authorizeCarList, oldTeamData.teamCarList[l].authorizeCarList) &&
                                    _.isEqual(item.expenseList, oldTeamData.teamCarList[l].expenseList) &&
                                    _.isEqual(item.serviceList, oldTeamData.teamCarList[l].serviceList)) {
                                isSameData = true;
                                break;
                            }
                       }
                    }
                }
                if (isSameData && oldTeamData.teamCarReports[""+item.id]) {
                    console.log("&&&&&&&&&&&&&&^^^^^^ TEAM Yeah Same Data when sync from Server, No need Reports:"+ item.licensePlate)
                    teamCarReportsAll[""+item.id] = oldTeamData.teamCarReports[""+item.id]
                } else {
                    needProcessCount++;
                    //actTempCalculateTeamCarReport(item, dispatch)
                    AppUtils.actTempCalculateCarReportAsyncWrapper(item, options)
                    .then (result => {
                        doneProcessCount++;
                        teamCarReportsAll[""+item.id] = result

                        //if ( idxMem == data.length -1 && idx == mem.vehicleList.length-1) {
                        if ( doneProcessCount == needProcessCount) {
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
                }
            }
        }
    }
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
            teamCarList:teamCarList,
            //teamCarReports: {},// {id: {gasReport,oilReport,authReport,moneyReport}}
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
