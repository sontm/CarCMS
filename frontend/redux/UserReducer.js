import { REHYDRATE } from 'redux-persist';
import AppConstants from '../constants/AppConstants'
import AppUtils from '../constants/AppUtils'
import apputils from '../constants/AppUtils';
import backend from '../constants/Backend';

var _ = require('lodash');

const VEHICLE_SYNC_FROMSERVER = 'VEHICLE_SYNC_FROMSERVER';
const VEHICLE_SYNC_TOSERVER = 'VEHICLE_SYNC_TOSERVER';

const VEHICLE_ADD = 'VEHICLE_ADD';
const VEHICLE_EDIT = 'VEHICLE_EDIT';
const VEHICLE_DEL = 'VEHICLE_DEL';

const VEHICLE_FILL_GAS_ADD = 'VEHICLE_FILL_GAS_ADD';
const VEHICLE_FILL_OIL_ADD = 'VEHICLE_FILL_OIL_ADD';
const VEHICLE_CAR_AUTH_ADD = 'VEHICLE_CAR_AUTH_ADD';
const VEHICLE_EXPENSE_ADD = 'VEHICLE_EXPENSE_ADD';
const VEHICLE_SERVICE_ADD = 'VEHICLE_SERVICE_ADD';

const VEHICLE_FILL_GAS_DEL = 'VEHICLE_FILL_GAS_DEL';
const VEHICLE_FILL_OIL_DEL = 'VEHICLE_FILL_OIL_DEL';
const VEHICLE_CAR_AUTH_DEL = 'VEHICLE_CAR_AUTH_DEL';
const VEHICLE_EXPENSE_DEL = 'VEHICLE_EXPENSE_DEL';
const VEHICLE_SERVICE_DEL = 'VEHICLE_SERVICE_DEL';

const VEHICLE_FILL_GAS_EDIT = 'VEHICLE_FILL_GAS_EDIT';
const VEHICLE_FILL_OIL_EDIT = 'VEHICLE_FILL_OIL_EDIT';
const VEHICLE_CAR_AUTH_EDIT = 'VEHICLE_CAR_AUTH_EDIT';
const VEHICLE_EXPENSE_EDIT = 'VEHICLE_EXPENSE_EDIT';
const VEHICLE_SERVICE_EDIT = 'VEHICLE_SERVICE_EDIT';

const USER_LOGIN_OK = 'USER_LOGIN_OK';
const USER_UPDATEPROFILE_OK = 'USER_UPDATEPROFILE_OK';
const USER_REGISTER_OK = 'USER_REGISTER_OK';
const USER_LOGOUT = 'USER_LOGOUT';
const USER_CREATE_TEAM_OK = 'USER_CREATE_TEAM_OK';
const USER_LEAVE_TEAM_OK = 'USER_LEAVE_TEAM_OK';

const USER_SET_MAX_METER = 'USER_SET_MAX_METER';
const USER_GET_APPNOTIFICATION = 'USER_GET_APPNOTIFICATION';
const USER_SAW_ALL_APPNOTIFICATION = 'USER_SAW_ALL_APPNOTIFICATION';

const TEMP_CALCULATE_CARREPORT = 'TEMP_CALCULATE_CARREPORT';
const TEMP_CALCULATE_CARREPORT_ALL = 'TEMP_CALCULATE_CARREPORT_ALL';

const SETTING_MAINTAIN_TYPE = 'SETTING_MAINTAIN_TYPE';
const SETTING_REMIND = 'SETTING_REMIND';

const USER_SYNC_PRIVATE_START = 'USER_SYNC_PRIVATE_START';
const USER_SYNC_PRIVATE_DONE = 'USER_SYNC_PRIVATE_DONE';
const USER_SYNC_TEAM_START = 'USER_SYNC_TEAM_START';
const USER_SYNC_TEAM_DONE = 'USER_SYNC_TEAM_DONE';
const USER_INIT_DATA = 'USER_INIT_DATA';
const USER_FORCE_CLOSE_MODAL = 'USER_FORCE_CLOSE_MODAL';

const USER_GOT_MY_JOINREQUEST = 'USER_GOT_MY_JOINREQUEST';

const CUSTOM_ADD_SERVICEMODULE = 'CUSTOM_ADD_SERVICEMODULE';
const CUSTOM_ADD_SERVICEMODULE_BIKE = 'CUSTOM_ADD_SERVICEMODULE_BIKE';
const CUSTOM_DEL_SERVICEMODULE = 'CUSTOM_DEL_SERVICEMODULE';
const CUSTOM_DEL_SERVICEMODULE_BIKE = 'CUSTOM_DEL_SERVICEMODULE_BIKE';

const DEFAULT_SETTING_REMIND = {
    kmForOilRemind: 50,
    dayForAuthRemind: 15,
    dayForInsuranceRemind: 15,
    dayForRoadFeeRemind: 15,
}
const DEFAULT_SETTING_SERVICE = {
    Km: [5000, 10000, 20000, 40000, 80000],
    Month: [6, 12, 24, 48, 96],
    KmBike: [4000, 8000, 12000, 16000, 20000],
    MonthBike: [4, 8, 12, 18, 24],
}
// Each Item: fillDate: new Date().toLocaleString(),amount: "",price: "",currentKm: "",type: "oil",subType: "",remark: "",
const initialState = {
    // Below will Sync. Special when User Leave Team, Join Team...
    teamInfo: {},//"code": "bfOdOi7L", "id": "","name": "PhuPhuong", canMemberViewReport
    // Below will Sync; Updated in Login
    userProfile: {},//"email": "tester3","fullName": "Test3","id": "","phone": "","type": "local", teamId, teamCode, class:"freeUser", pictureUrl, roleInTeam
    isLogined: false,
    token: "",
    defaultVehicleId: "",


    // Below will Sync
    vehicleList:[],//fillGasList:[],fillOilList:[],authorizeCarList:[],expenseList:[],serviceList:[]/
                    // Each item: maxMeter ...
                    // "id":"isDefault": false,"licensePlate","model": "CRV","ownerFullName", userId":, maxMeter
    carReports:{}, // {vehicleid: {gasReport,authReport,moneyReport,maintainRemind, scheduledNotification}}

    // Below will Sync
    customServiceModules: [],
    // Below will Sync
    customServiceModulesBike: [],

    // Below will Sync
    settings: DEFAULT_SETTING_REMIND, //kmForOilRemind,dayForAuthRemind,dayForInsuranceRemind,dayForRoadFeeRemind
    // Below will Sync
    settingService: DEFAULT_SETTING_SERVICE,

    // WIll Sync from Server
    notifications: [], //  "content","enable","forAll","id","issueDate","teamId",title",userId". Will add notSeen Locally
    // WIll Sync from Server
    myJoinRequest: {}, // "email" "fullName" "id" "phone" "status" "teamCode""teamName""updatedOn" "userId"

    countNotSeenNoti: 0,

    modalState: 0, // 1: syncPrivate, 2: syncTeam, 0: close. ++ when start each sync, -- when done each

    lastSyncFromServerOn: null, // date of last sync
    lastSyncToServerOn: null,
};

export const reCalculateCarReports = (currentVehicle, prevUserData, theDispatch, vehicleId) => {
    // For calcualte All Time data
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }

    // If currentVehicle is NULL, need get by vehicleId
    if (!currentVehicle) {
        console.log("=====vehicleNull, id:" + vehicleId + "ml:" + prevUserData.vehicleList.length)
        for (let l = 0; l < prevUserData.vehicleList.length; l++ ) {
            console.log("   list id:" + prevUserData.vehicleList[l].id)
            if (prevUserData.vehicleList[l].id == vehicleId) {
                currentVehicle = prevUserData.vehicleList[l];
            }
        }
    }
    if (currentVehicle) {
        AppUtils.actTempCalculateCarReportAsyncWrapper(currentVehicle, options, 
            prevUserData.settings, prevUserData.carReports, prevUserData.settingService)
        .then (result => {
            console.log("<<<<<<<reCalculateCarReports FINISH")
            if (theDispatch) {
                theDispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            } else {
                dispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            }
        })
        .catch (error => {
            console.log(error)
        })
    }
}

export const actSettingSetMaintainType = (data) => (dispatch) => {
    console.log("actSettingSetMaintainType:")
    dispatch({
        type: SETTING_MAINTAIN_TYPE,
        payload: data
    })
}
export const actSettingSetRemind = (data) => (dispatch) => {
    console.log("actSettingSetRemind:")
    dispatch({
        type: SETTING_REMIND,
        payload: data
    })
}

export const actUserRegisterOK = (data) => (dispatch) => {
    console.log("actUserRegisterOK:")
    dispatch({
        type: USER_REGISTER_OK,
        payload: data
    })
}

export const actUserCreateTeamOK = (data) => (dispatch) => {
    console.log("actCreateTeamOK:")
    console.log(data)
    dispatch({
        type: USER_CREATE_TEAM_OK,
        payload: data
    })
}
export const actUserLeaveTeamOK = (data) => (dispatch) => {
    console.log("actUserLeaveTeamOK:")
    dispatch({
        type: USER_LEAVE_TEAM_OK
    })
}

// data will have fullname, phone and token if needed
export const actUserUpdateProfileOK = (data) => (dispatch) => {
    console.log("actUserUpdateProfileOK:")
    dispatch({
        type: USER_UPDATEPROFILE_OK,
        payload: data
    })
}

//{user,token,teamInfo}
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





export const actVehicleAddVehicle = (vehicle, prevUserData) => (dispatch, getState) => {
    console.log("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_ADD,
        payload: vehicle
    })
    let {userData} = getState();
    reCalculateCarReports(vehicle, userData, dispatch)
}
export const actVehicleEditVehicle = (vehicle, prevUserData) => (dispatch, getState) => {
    console.log("actVehicleEditVehicle:")
    dispatch({
        type: VEHICLE_EDIT,
        payload: vehicle
    })
    let {userData} = getState();
    reCalculateCarReports(vehicle, userData, dispatch)
}
export const actVehicleDeleteVehicle = (vehicleId, licensePlate) => (dispatch) => {
    console.log("actVehicleDeleteVehicle:"+vehicleId+",licensePlate:" + licensePlate)
    dispatch({
        type: VEHICLE_DEL,
        payload: {id: vehicleId, licensePlate: licensePlate}
    })
}

export const actVehicleAddFillItem = (data, type, prevUserData) => (dispatch, getState) => {
    console.log("actVehicleAddFillItem:")
    //AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(data.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_ADD,
            payload: data
        })
    }
    let {userData} = getState();
    reCalculateCarReports(null, userData, dispatch, data.vehicleId)
}

// type: gas, oil, auth, 
export const actVehicleDeleteFillItem = (vehicleId, itemId, type, prevUserData) => (dispatch, getState) => {
    console.log("actVehicleDeleteFillItem:"+itemId+",type:" + type)
    //AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(itemId.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    }

    let {userData} = getState();
    reCalculateCarReports(null, userData, dispatch, itemId.vehicleId)
}

// type: gas, oil, auth, 
export const actVehicleEditFillItem = (itemId, type, prevUserData) => (dispatch, getState) => {
    console.log(">>>>>>>>>>>>> Start Dispatch actVehicleEditFillItem:"+itemId+",type:" + type)
    console.log(itemId)
    AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(itemId.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_EDIT,
            payload: itemId
        })
    }

    console.log("<<<<<<<<<<<< END Dispatch actVehicleEditFillItem:"+itemId+",type:" + type)
    let {userData} = getState();
    // console.log(prevUserData.vehicleList[0].authorizeCarList)
    // console.log("  >>>>>>>>>>>> Start reCalculateCarReports")
    // console.log(userData.vehicleList[0].authorizeCarList)

    reCalculateCarReports(null, userData, dispatch, itemId.vehicleId)
}





export const actTempCalculateCarReport = (currentVehicle, options, prevUserData, theDispatch) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    if (!prevUserData || !prevUserData.carReports || !prevUserData.carReports[currentVehicle.id] || 
            AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id) >= 0) {
        console.log(">>>actTempCalculateCarReport in User:")
        // if (!prevUserData || !prevUserData.carReports) {
        //     // Maybe from Sync from Server, clear all Notifications
        //     apputils.cancelAllAppLocalNotification();
        // }
        let theIdx = AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id);
        AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.splice(theIdx, 1);
        // For calcualte All Time data
        options = {
            durationType: "month",
            tillDate: new Date(),
            duration: 300,
        }

        AppUtils.actTempCalculateCarReportAsyncWrapper(currentVehicle, options, 
            prevUserData.settings, prevUserData.carReports, prevUserData.settingService)
        .then (result => {
            console.log("<<<<<<<actTempCalculateCarReport FINISH")
            if (theDispatch) {
                theDispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            } else {
                dispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            }
        })
        .catch (error => {
            console.log(error)
        })
    }
}

// data will have
// vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
    // teamInfo: teamInfo
// oldProps have both userData, teamData
export const actVehicleSyncAllFromServer = (data, oldProps) => (dispatch) => {
    console.log("actVehicleSyncFromServer:")
    dispatch({
        type: VEHICLE_SYNC_FROMSERVER,
        payload: data
    })

    // TODO for when SYnc, need re-calcualte Report
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }
    let allCarReports = {};
    let needProcess = 0;
    let doneProcess = 0;
    if (data.vehicleList && data.vehicleList.length > 0) {
        data.vehicleList.forEach ((vehicle, index) => {
            // Deep Compare Object here
            let isSameData = false;
            for (let l = 0; l < oldProps.userData.vehicleList.length; l++) {
                if (oldProps.userData.vehicleList[l].id == vehicle.id) {
                    // Found Matched Vehicle, Compare is Same
                    if (_.isEqual(vehicle, oldProps.userData.vehicleList[l])) {
                        isSameData = true;
                        break;
                    }
                }
            }
            if (isSameData && oldProps.userData.carReports[""+vehicle.id]) {
                console.log("&&&&&&&&&&&&&&^^^^^^^^ Yeah Same Data when sync from Server, No need Reports:"+ vehicle.licensePlate)
                allCarReports[""+vehicle.id] = oldProps.userData.carReports[""+vehicle.id]
            } else {
                needProcess++;
                AppUtils.actTempCalculateCarReportAsyncWrapper(vehicle, options)
                .then (result => {
                    console.log("  OK User Calculate Report:" + vehicle.licensePlate)
                    allCarReports[""+vehicle.id] = result
                    doneProcess++;
                    
                    //if (index == data.vehicleList.length - 1) {
                    if (doneProcess == needProcess) {
                        oldProps.actUserStartSyncPrivateDone();

                        console.log("======================= Final Dispatch User Reports:")
                        dispatch({
                            type: TEMP_CALCULATE_CARREPORT_ALL,
                            payload: allCarReports
                        })
                    }
                })
                .catch (error => {
                    console.log("  Error User Calculate Report:" + vehicle.licensePlate)
                    console.log(error)
                })
            }
        })
    }
    if (needProcess == 0) {
        // Nothing New,
        oldProps.actUserStartSyncPrivateDone();
    }
}




export const actUserInitializeInitialDataWhenAppStart = () => (dispatch) => {
    console.log("actUserInitializeInitialDataWhenAppStart:")
    dispatch({
        type: USER_INIT_DATA
    })
}
export const actUserStartSyncPrivate = () => (dispatch) => {
    console.log("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_PRIVATE_START
    })
}
export const actUserStartSyncPrivateDone = () => (dispatch) => {
    console.log("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_PRIVATE_DONE
    })
}
export const actUserStartSyncTeam = () => (dispatch) => {
    console.log("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_TEAM_START
    })
}
export const actUserStartSyncTeamDone = () => (dispatch) => {
    console.log("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_TEAM_DONE
    })
}
export const actUserForCloseModal = () => (dispatch) => {
    console.log("actUserForCloseModal:")
    dispatch({
        type: USER_FORCE_CLOSE_MODAL
    })
}





export const actVehicleSyncToServerOK = (data) => (dispatch) => {
    console.log("actVehicleSyncToServerOK:")
    dispatch({
        type: VEHICLE_SYNC_TOSERVER
    })
}


export const actCustomAddServiceModule = (data) => (dispatch) => {
    console.log("actCustomAddServiceModule:")
    dispatch({
        type: CUSTOM_ADD_SERVICEMODULE,
        payload: data
    })
}
export const actCustomAddServiceModuleBike = (data) => (dispatch) => {
    console.log("actCustomAddServiceModuleBike:")
    dispatch({
        type: CUSTOM_ADD_SERVICEMODULE_BIKE,
        payload: data
    })
}
export const actCustomDelServiceModule = (data) => (dispatch) => {
    console.log("actCustomDelServiceModule:")
    dispatch({
        type: CUSTOM_DEL_SERVICEMODULE,
        payload: data
    })
}
export const actCustomDelServiceModuleBike = (data) => (dispatch) => {
    console.log("actCustomDelServiceModuleBike:")
    dispatch({
        type: CUSTOM_DEL_SERVICEMODULE_BIKE,
        payload: data
    })
}


// data: {vehicleId, maxMeter}
export const actUserSetMaxOdometer = (data) => (dispatch) => {
    console.log("actUserSetMaxOdometer:")
    dispatch({
        type: USER_SET_MAX_METER,
        payload: data
    })
}

export const actUserGetNotifications = (prevUserProps) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    console.log("actUserGetNotifications, token:" + prevUserProps.token)
    let notiIds = [];
    if (prevUserProps.notifications) {
        prevUserProps.notifications.forEach(item => {
            notiIds.push(item.id)
        })
    }
    backend.getAllNotification(notiIds, prevUserProps.token,
    response => {
        console.log("  OK Got Notification:" )
        console.log(response.data)
        dispatch({
            type: USER_GET_APPNOTIFICATION,
            payload: response.data
        })
    },error => {
        console.log("  Error Got Notificationt:")
        console.log(error.response)
    })
}

export const actUserSawAllNotifications = () => (dispatch) => {
    dispatch({
        type: USER_SAW_ALL_APPNOTIFICATION,
    })
}

export const actUserGotMyJoinRequest = (data) => (dispatch) => {
    console.log("  actUserGotMyJoinRequest" )
    dispatch({
        type: USER_GOT_MY_JOINREQUEST,
        payload: data
    })
}


function checkNameExistInServiceModule(arr, value) {
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name == value) {
                return i;
            }
        }
    }
    return -1;
}
// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    // case REHYDRATE:
    //     console.log("HVE JUST LOAD STATE--------------")
    //     let newAA = {...state}; // THis code will Lose all
    //     if (!state.vehicleList) state.vehicleList= [];
    //     return newAA;
    case USER_CREATE_TEAM_OK:
        return {
            ...state,
            teamInfo: action.payload,
            userProfile: {...state.userProfile, 
                teamId: action.payload.id,
                teamCOde: action.payload.code,
                roleInTeam: "manager"
            },
            myJoinRequest: {},
        };
    case USER_LEAVE_TEAM_OK:
        let prevStateLeaveTEam = {...state};
        prevStateLeaveTEam.teamInfo= {};
        prevStateLeaveTEam.userProfile.teamId = null;
        prevStateLeaveTEam.userProfile.teamCode = null;
        prevStateLeaveTEam.userProfile.roleInTeam = null;
        prevStateLeaveTEam.myJoinRequest= {};

        return prevStateLeaveTEam;
    case USER_LOGIN_OK:
        return {
            ...state,
            userProfile: action.payload.user,
            token: action.payload.token,
            teamInfo: action.payload.teamInfo,
            myJoinRequest: {},
            isLogined: true
        };
    case USER_LOGOUT:
        return {
            ...state,
            userProfile: {},
            isLogined: false,
            token: "",
            teamInfo: {},
            defaultVehicleId: "",
            vehicleList:[],
            carReports:{},
            settings: DEFAULT_SETTING_REMIND,
            settingService: DEFAULT_SETTING_SERVICE,
            notifications: [],
            myJoinRequest: {},
            countNotSeenNoti: 0,

            lastSyncFromServerOn: null, // date of last sync
            lastSyncToServerOn: null,
        };
    case USER_UPDATEPROFILE_OK:
        let prevStateUpdateProfile = {...state};
        if (action.payload.fullName) {
            prevStateUpdateProfile.userProfile.fullName = action.payload.fullName;
        }
        if (action.payload.phone) {
            prevStateUpdateProfile.userProfile.phone = action.payload.phone;
        }
        if (action.payload.token) {
            prevStateUpdateProfile.token = action.payload.token;
        }
        return prevStateUpdateProfile;
    case VEHICLE_SYNC_FROMSERVER:
        // Process Notification Sync Here 
        let receivedNotis0 = action.payload.notifications;
        let newNotis0 = [];
        if (receivedNotis0 && receivedNotis0.length > 0) {
            newNotis0 = receivedNotis0;
        }
        newNotis0.sort(function(a, b) {
            let aDate = new Date(a.issueDate);
            let bDate = new Date(b.issueDate);
            // Descending
            return bDate - aDate;
        })

        let newStateSyncFrom = {
            ...state,
            vehicleList: action.payload.vehicleList,
            customServiceModules: action.payload.customServiceModules,
            customServiceModulesBike: action.payload.customServiceModulesBike,
            settings: action.payload.settings,
            settingService: action.payload.settingService,
            notifications: newNotis0,
            myJoinRequest: action.payload.myJoinRequest,
            countNotSeenNoti: 0,

            teamInfo: action.payload.teamInfo,
            //carReports: {},// this will be updated during Caluclation,because some may not need to Re-calculate
            lastSyncFromServerOn: new Date()
        }
        if (!newStateSyncFrom.settingService) {
            newStateSyncFrom.settingService = DEFAULT_SETTING_SERVICE;
        }
        

        return newStateSyncFrom;
    case VEHICLE_SYNC_TOSERVER:
        return {
            ...state,
            lastSyncToServerOn: new Date()
        }
    case VEHICLE_ADD:
        var newStateVehicleAdd = {
            ...state,
        };
        if (!newStateVehicleAdd.vehicleList) {
            newStateVehicleAdd.vehicleList = [];
        }
        newStateVehicleAdd.vehicleList = [...newStateVehicleAdd.vehicleList, action.payload]
        
        // Handle if this Vehicle is Default, change all Others
        if (action.payload.isDefault) {
            newStateVehicleAdd.defaultVehicleId = action.payload.id;
            for (let i = 0; i < newStateVehicleAdd.vehicleList.length; i++) {
                if (newStateVehicleAdd.vehicleList[i].id != action.payload.id) {
                    newStateVehicleAdd.vehicleList[i].isDefault = false
                }
            } 
        }
        return newStateVehicleAdd;
    case VEHICLE_EDIT:
        let newStateVehicle = {...state}
        for (let i = 0; i < newStateVehicle.vehicleList.length; i++) {
            if (newStateVehicle.vehicleList[i].id == action.payload.id) {
                newStateVehicle.vehicleList[i] = {...newStateVehicle.vehicleList[i], ...action.payload}
                break;
            }
        }
        // Handle if this Vehicle is Default, change all Others
        if (action.payload.isDefault) {
            newStateVehicle.defaultVehicleId = action.payload.id;
            for (let i = 0; i < newStateVehicle.vehicleList.length; i++) {
                if (newStateVehicle.vehicleList[i].id != action.payload.id) {
                    newStateVehicle.vehicleList[i].isDefault = false
                }
            } 
        }
        return newStateVehicle;
    case VEHICLE_DEL:
        // Remove element from array
        let newState = {...state};
        for (let i = 0; i < newState.vehicleList.length; i++) {
            if ((newState.vehicleList[i].id && newState.vehicleList[i].id == action.payload.id)
                    || (newState.vehicleList[i].licensePlate == action.payload.licensePlate)) {
                newState.vehicleList.splice(i, 1);
                break;
            }
        }
        // Remove from carReports
        if (newState.carReports[""+action.payload.id]) {
            delete newState.carReports[""+action.payload.id];
        }

        return newState;
    case VEHICLE_FILL_GAS_ADD:
        // add to Vehicle 
        let newStateAddGas = {...state};
        for (let i = 0; i < newStateAddGas.vehicleList.length; i++) {
            if (newStateAddGas.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)

                newStateAddGas.vehicleList[i].fillGasList = 
                    [...newStateAddGas.vehicleList[i].fillGasList, action.payload];
                    
                newStateAddGas.vehicleList[i].fillGasList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })

                break;
            }
        }
        return newStateAddGas;
        
    case VEHICLE_FILL_OIL_ADD:
        // add to Vehicle 
        let newStateAddOil = {...state};
        for (let i = 0; i < newStateAddOil.vehicleList.length; i++) {
            if (newStateAddOil.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddOil.vehicleList[i].fillOilList = 
                    [...newStateAddOil.vehicleList[i].fillOilList, action.payload];
                
                newStateAddOil.vehicleList[i].fillOilList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }
        return newStateAddOil;

    case VEHICLE_CAR_AUTH_ADD:
        // add to Vehicle 
        let newStateAddAuth = {...state};
        for (let i = 0; i < newStateAddAuth.vehicleList.length; i++) {
            if (newStateAddAuth.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddAuth.vehicleList[i].authorizeCarList = 
                    [...newStateAddAuth.vehicleList[i].authorizeCarList, action.payload];
                
                newStateAddAuth.vehicleList[i].authorizeCarList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }
        return newStateAddAuth;
    case VEHICLE_EXPENSE_ADD:
        // add to Vehicle 
        let newStateAddExpense = {...state};
        for (let i = 0; i < newStateAddExpense.vehicleList.length; i++) {
            if (newStateAddExpense.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddExpense.vehicleList[i].expenseList = 
                    [...newStateAddExpense.vehicleList[i].expenseList, action.payload];
                    newStateAddExpense.vehicleList[i].expenseList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }
        return newStateAddExpense;
    case VEHICLE_SERVICE_ADD:
        // add to Vehicle 
        let newStateAddService = {...state};
        for (let i = 0; i < newStateAddService.vehicleList.length; i++) {
            if (newStateAddService.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddService.vehicleList[i].serviceList = 
                    [...newStateAddService.vehicleList[i].serviceList, action.payload];
                    
                newStateAddService.vehicleList[i].serviceList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }
        return newStateAddService;

    case VEHICLE_FILL_GAS_DEL:
        let delState1 = {...state};
        let  findVehicle1 = delState1.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle1) {
            for (let i = 0; i < findVehicle1.fillGasList.length; i++) {
                if (findVehicle1.fillGasList[i].id == action.payload.itemId) {
                    findVehicle1.fillGasList.splice(i, 1);
                    break;
                }
            }
        }
        return delState1;

    case VEHICLE_FILL_OIL_DEL:
        let delState2 = {...state};
        let  findVehicle2 = delState2.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle2) {
            for (let i = 0; i < findVehicle2.fillOilList.length; i++) {
                if (findVehicle2.fillOilList[i].id == action.payload.itemId) {
                    findVehicle2.fillOilList.splice(i, 1);
                    break;
                }
            }
        }
        return delState2;

    case VEHICLE_CAR_AUTH_DEL:
        let delState3 = {...state};
        let  findVehicle3 = delState3.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle3) {
            for (let i = 0; i < findVehicle3.authorizeCarList.length; i++) {
                if (findVehicle3.authorizeCarList[i].id == action.payload.itemId) {
                    findVehicle3.authorizeCarList.splice(i, 1);
                    break;
                }
            }
        }
        return delState3;

    case VEHICLE_FILL_GAS_EDIT:
        let newStateVehicleGasEdit = {...state}
        for (let i = 0; i < newStateVehicleGasEdit.vehicleList.length; i++) {
            if (newStateVehicleGasEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let j = 0; j < newStateVehicleGasEdit.vehicleList[i].fillGasList.length; j++) {
                    if (newStateVehicleGasEdit.vehicleList[i].fillGasList[j].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleGasEdit.vehicleList[i].fillGasList[j] = {...action.payload}

                        newStateVehicleGasEdit.vehicleList[i].fillGasList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        return newStateVehicleGasEdit;
    case VEHICLE_FILL_OIL_EDIT:
        let newStateVehicleOilEdit = {...state}
        for (let i = 0; i < newStateVehicleOilEdit.vehicleList.length; i++) {
            if (newStateVehicleOilEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let j = 0; j < newStateVehicleOilEdit.vehicleList[i].fillOilList.length; j++) {
                    if (newStateVehicleOilEdit.vehicleList[i].fillOilList[j].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleOilEdit.vehicleList[i].fillOilList[j] = {...action.payload}

                        newStateVehicleOilEdit.vehicleList[i].fillOilList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        return newStateVehicleOilEdit;
    case VEHICLE_CAR_AUTH_EDIT:
        let newStateVehicleAuthEdit = {...state}
        for (let i = 0; i < newStateVehicleAuthEdit.vehicleList.length; i++) {
            if (newStateVehicleAuthEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleAuthEdit.vehicleList[i].authorizeCarList.length; k++) {
                    if (newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[k] = {...action.payload}

                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        console.log("================= End EDIT VEHICLE_CAR_AUTH_EDIT")
        return newStateVehicleAuthEdit;
    
    case VEHICLE_EXPENSE_DEL:
        let delState4 = {...state};
        let  findVehicle4 = delState4.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle4) {
            for (let i = 0; i < findVehicle4.expenseList.length; i++) {
                if (findVehicle4.expenseList[i].id == action.payload.itemId) {
                    findVehicle4.expenseList.splice(i, 1);
                    break;
                }
            }
        }
        return delState4;
    case VEHICLE_EXPENSE_EDIT:
        let newStateVehicleExpenseEdit = {...state}
        for (let i = 0; i < newStateVehicleExpenseEdit.vehicleList.length; i++) {
            if (newStateVehicleExpenseEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleExpenseEdit.vehicleList[i].expenseList.length; k++) {
                    if (newStateVehicleExpenseEdit.vehicleList[i].expenseList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleExpenseEdit.vehicleList[i].expenseList[k] = {...action.payload}

                        newStateVehicleExpenseEdit.vehicleList[i].expenseList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        return newStateVehicleExpenseEdit;

    case VEHICLE_SERVICE_DEL:
        let delState5 = {...state};
        let  findVehicle5 = delState5.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle5) {
            for (let i = 0; i < findVehicle5.expenseList.length; i++) {
                if (findVehicle5.expenseList[i].id == action.payload.itemId) {
                    findVehicle5.expenseList.splice(i, 1);
                    break;
                }
            }
        }
        return delState5;

    case VEHICLE_SERVICE_EDIT:
        let newStateVehicleServiceEdit = {...state}
        for (let i = 0; i < newStateVehicleServiceEdit.vehicleList.length; i++) {
            if (newStateVehicleServiceEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleServiceEdit.vehicleList[i].serviceList.length; k++) {
                    if (newStateVehicleServiceEdit.vehicleList[i].serviceList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleServiceEdit.vehicleList[i].serviceList[k] = {...action.payload}

                        newStateVehicleServiceEdit.vehicleList[i].serviceList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        return newStateVehicleServiceEdit;

    case TEMP_CALCULATE_CARREPORT:
        let newStateCarReport = {
            ...state,
        };
        newStateCarReport.carReports[""+action.payload.id] = action.payload.data

        return newStateCarReport;
    case TEMP_CALCULATE_CARREPORT_ALL:
        let newStateCarReportAll = {
            ...state,
        };
        newStateCarReportAll.carReports = action.payload
        newStateCarReportAll.modalState = (newStateCarReportAll.modalState-1 >= 0) ? (newStateCarReportAll.modalState-1) : 0

        return newStateCarReportAll;

    case SETTING_REMIND:
        return {
            ...state,
            settings: action.payload
        };
    case SETTING_MAINTAIN_TYPE:
        return {
            ...state,
            settingService: action.payload
        };

    case CUSTOM_ADD_SERVICEMODULE:
        let prevStateService = {...state};
        if ( !prevStateService.customServiceModules ) {
            prevStateService.customServiceModules = [];
        }
        let idxa0 = checkNameExistInServiceModule(prevStateService.customServiceModules, 
            action.payload.name);
        if ( idxa0 < 0) {
            // when not exist, add
            prevStateService.customServiceModules.push(action.payload)
        }

        return prevStateService;
    case CUSTOM_ADD_SERVICEMODULE_BIKE:
        let prevStateServiceBike = {...state};
        if ( !prevStateServiceBike.customServiceModulesBike ) {
            prevStateServiceBike.customServiceModulesBike = [];
        }
        let idxa1 = checkNameExistInServiceModule(prevStateServiceBike.customServiceModulesBike, 
            action.payload.name);
        if ( idxa1 < 0) {
            // when not exist, add
            prevStateServiceBike.customServiceModulesBike.push(action.payload)
        }

        return prevStateServiceBike;
    case CUSTOM_DEL_SERVICEMODULE:
        let prevStateServiceDel = {...state};
        if ( !prevStateServiceDel.customServiceModules ) {
            prevStateServiceDel.customServiceModules = [];
        }
        let idx = checkNameExistInServiceModule(prevStateService.customServiceModules, 
            action.payload.name);
        if ( idx >= 0) {
            prevStateServiceDel.customServiceModules.splice(idx, 1);
        }

        return prevStateServiceDel;
    case CUSTOM_DEL_SERVICEMODULE_BIKE:
        let prevStateServiceDelBike = {...state};
        if ( !prevStateServiceDelBike.customServiceModulesBike ) {
            prevStateServiceDelBike.customServiceModulesBike = [];
        }
        let idx2 = checkNameExistInServiceModule(prevStateServiceDelBike.customServiceModulesBike, 
            action.payload.name);
        if ( idx2 >= 0) {
            prevStateServiceDelBike.customServiceModulesBike.splice(idx2, 1);
        }

        return prevStateServiceDelBike;
    case USER_SET_MAX_METER:
        let prevStateSetMeter = {...state};
        for (let i = 0; i < prevStateSetMeter.vehicleList.length; i++) {
            if (prevStateSetMeter.vehicleList[i].id == action.payload.vehicleId ) {
                prevStateSetMeter.vehicleList[i].maxMeter = action.payload.maxMeter;

                break;
            }
        }
        return prevStateSetMeter;
    case USER_GET_APPNOTIFICATION:
        let prevNotis = state.notifications;
        if (!prevNotis) {
            prevNotis = [];
        }
        // add to notifications list if not exist ID
        let receivedNotis = action.payload;
        let newNotis = [...prevNotis];
        let isHaveNew = false;
        let countNotSeenNoti = 0;
        receivedNotis.forEach (item => {
            let existedItem = prevNotis.find(noti => noti.id == item.id);
            if (!existedItem) {
                isHaveNew = true;
                // Not Exist, Add
                // New Item is not Seen
                item.notSeen = true;
                countNotSeenNoti++;

                newNotis.unshift(item);
            }
        })
        // Sort by Time
        if (isHaveNew) {
            newNotis.sort(function(a, b) {
                let aDate = new Date(a.issueDate);
                let bDate = new Date(b.issueDate);
                // Descending
                return bDate - aDate;
            })
        }
        // console.log("  FInal Notifications")
        // console.log(newNotis)

        return {
            ...state,
            notifications: newNotis,
            countNotSeenNoti: countNotSeenNoti
        }
    case USER_SAW_ALL_APPNOTIFICATION:
        let prevNotis2 = state.notifications;
        if (!prevNotis2) {
            prevNotis2 = [];
        }
        let newNotis2 = [...prevNotis2];
        newNotis2.forEach(item => {
            item.notSeen = false;
        })
        return {
            ...state,
            notifications: newNotis2,
            countNotSeenNoti: 0
        }
    case USER_GOT_MY_JOINREQUEST:
        return {
            ...state,
            myJoinRequest: action.payload
        }

    case USER_SYNC_PRIVATE_START:
        return {
            ...state,
            modalState: 1
        }
    case USER_SYNC_PRIVATE_DONE:
        return {
            ...state,
            modalState: (state.modalState-1 >= 0) ? (state.modalState-1) : 0
        }
    case USER_SYNC_TEAM_START:
        return {
            ...state,
            modalState: state.modalState+1
        }
    case USER_SYNC_TEAM_DONE:
        return {
            ...state,
            modalState: (state.modalState-1 >= 0) ? (state.modalState-1) : 0
        }
    case USER_INIT_DATA:
        return {
            ...state,
            modalState: 0
        }
    case USER_FORCE_CLOSE_MODAL:
        return {
            ...state,
            modalState: 0
        }
    default:
        return state;
    }
}
