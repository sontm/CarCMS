import { REHYDRATE } from 'redux-persist';
import AppConstants from '../constants/AppConstants'
import AppUtils from '../constants/AppUtils'
import apputils from '../constants/AppUtils';

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

const TEMP_CALCULATE_CARREPORT = 'TEMP_CALCULATE_CARREPORT';
const TEMP_CALCULATE_CARREPORT_ALL = 'TEMP_CALCULATE_CARREPORT_ALL';

const SETTING_MAINTAIN_TYPE = 'SETTING_MAINTAIN_TYPE';
const SETTING_REMIND = 'SETTING_REMIND';

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
    teamInfo: {},//"code": "bfOdOi7L", "id": "","name": "PhuPhuong", canMemberViewReport
    userProfile: {},//"email": "tester3","fullName": "Test3","id": "","phone": "","type": "local", teamId, teamCode, class:"freeUser", pictureUrl, roleInTeam
    isLogined: false,
    token: "",
    defaultVehicleId: "",
    vehicleList:[],//fillGasList:[],fillOilList:[],authorizeCarList:[],expenseList:[],serviceList:[]
                    // "id":"isDefault": false,"licensePlate","model": "CRV","ownerFullName", userId":
    carReports:{}, // {vehicleid: {gasReport,authReport,moneyReport,maintainRemind, scheduledNotification}}

    customServiceModules: [],
    customServiceModulesBike: [],

    settings: DEFAULT_SETTING_REMIND, //kmForOilRemind,dayForAuthRemind,dayForInsuranceRemind,dayForRoadFeeRemind
    settingService: DEFAULT_SETTING_SERVICE,
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
export const actVehicleDeleteFillItem = (itemId, type, prevUserData) => (dispatch, getState) => {
    console.log("actVehicleDeleteFillItem:"+itemId+",type:" + type)
    //AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(itemId.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_DEL,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_DEL,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_DEL,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_DEL,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_DEL,
            payload: itemId
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

export const actVehicleSyncAllFromServer = (data) => (dispatch) => {
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
    data.forEach ((vehicle, index) => {
        AppUtils.actTempCalculateCarReportAsyncWrapper(vehicle, options)
        .then (result => {
            console.log("  OK User Calculate Report:" + vehicle.licensePlate)
            allCarReports[""+vehicle.id] = result

            if (index == data.length - 1) {
                console.log("======================= Final Dispatch User Reports")
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
            userProfile: {...state.userProfile, roleInTeam: "manager"}
        };
    case USER_LEAVE_TEAM_OK:
        let prevStateLeaveTEam = {...state};
        prevStateLeaveTEam.teamInfo= {};
        prevStateLeaveTEam.userProfile.teamId = null;
        prevStateLeaveTEam.userProfile.teamCode = null;
        prevStateLeaveTEam.userProfile.roleInTeam = null;

        return prevStateLeaveTEam;
    case USER_LOGIN_OK:
        return {
            ...state,
            userProfile: action.payload.user,
            token: action.payload.token,
            teamInfo: action.payload.teamInfo,
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
        let newStateSyncFrom = {
            ...state,
            vehicleList: action.payload,
            carReports: {},
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
                newStateAddGas.vehicleList[i].fillGasList = 
                    [...newStateAddGas.vehicleList[i].fillGasList, action.payload];
                break;
            }
        }
        return newStateAddGas;
        
    case VEHICLE_FILL_OIL_ADD:
        // add to Vehicle 
        let newStateAddOil = {...state};
        for (let i = 0; i < newStateAddOil.vehicleList.length; i++) {
            if (newStateAddOil.vehicleList[i].id == action.payload.vehicleId ) {
                newStateAddOil.vehicleList[i].fillOilList = 
                    [...newStateAddOil.vehicleList[i].fillOilList, action.payload];
                break;
            }
        }
        return newStateAddOil;

    case VEHICLE_CAR_AUTH_ADD:
        // add to Vehicle 
        let newStateAddAuth = {...state};
        for (let i = 0; i < newStateAddAuth.vehicleList.length; i++) {
            if (newStateAddAuth.vehicleList[i].id == action.payload.vehicleId ) {
                newStateAddAuth.vehicleList[i].authorizeCarList = 
                    [...newStateAddAuth.vehicleList[i].authorizeCarList, action.payload];
                break;
            }
        }
        return newStateAddAuth;
    case VEHICLE_EXPENSE_ADD:
        // add to Vehicle 
        let newStateAddExpense = {...state};
        for (let i = 0; i < newStateAddExpense.vehicleList.length; i++) {
            if (newStateAddExpense.vehicleList[i].id == action.payload.vehicleId ) {
                newStateAddExpense.vehicleList[i].expenseList = 
                    [...newStateAddExpense.vehicleList[i].expenseList, action.payload];
                break;
            }
        }
        return newStateAddExpense;
    case VEHICLE_SERVICE_ADD:
        // add to Vehicle 
        let newStateAddService = {...state};
        for (let i = 0; i < newStateAddService.vehicleList.length; i++) {
            if (newStateAddService.vehicleList[i].id == action.payload.vehicleId ) {
                newStateAddService.vehicleList[i].serviceList = 
                    [...newStateAddService.vehicleList[i].serviceList, action.payload];
                break;
            }
        }
        return newStateAddService;

    case VEHICLE_FILL_GAS_DEL:
        let newStateGasDel = {...state};
        for (let i = 0; i < newStateGasDel.fillGasList.length; i++) {
            if (newStateGasDel.fillGasList[i].id == action.payload) {
                newStateGasDel.fillGasList.splice(i, 1);
                break;
            }
        }
        return newStateGasDel;
    case VEHICLE_FILL_OIL_DEL:
        let newStateOilDel = {...state};
        for (let i = 0; i < newStateOilDel.fillOilList.length; i++) {
            if (newStateOilDel.fillOilList[i].id == action.payload) {
                newStateOilDel.fillOilList.splice(i, 1);
                break;
            }
        }
        return newStateOilDel;
    case VEHICLE_CAR_AUTH_DEL:
        let newStateAuthDel = {...state};
        for (let i = 0; i < newStateAuthDel.authorizeCarList.length; i++) {
            if (newStateAuthDel.authorizeCarList[i].id == action.payload) {
                newStateAuthDel.authorizeCarList.splice(i, 1);
                break;
            }
        }
        return newStateAuthDel;


    case VEHICLE_FILL_GAS_EDIT:
        let newStateVehicleGasEdit = {...state}
        for (let i = 0; i < newStateVehicleGasEdit.vehicleList.length; i++) {
            if (newStateVehicleGasEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let j = 0; j < newStateVehicleGasEdit.vehicleList[i].fillGasList.length; j++) {
                    if (newStateVehicleGasEdit.vehicleList[i].fillGasList[j].id == action.payload.id) {
                        newStateVehicleGasEdit.vehicleList[i].fillGasList[j] = {...action.payload}
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
                        newStateVehicleOilEdit.vehicleList[i].fillOilList[j] = {...action.payload}
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
                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[k] = {...action.payload}
                        break;
                    }
                }
            }
        }
        console.log("================= End EDIT VEHICLE_CAR_AUTH_EDIT")
        return newStateVehicleAuthEdit;
    
    case VEHICLE_EXPENSE_DEL:
        let newStateExpenseDel = {...state};
        for (let i = 0; i < newStateExpenseDel.expenseList.length; i++) {
            if (newStateExpenseDel.expenseList[i].id == action.payload) {
                newStateExpenseDel.expenseList.splice(i, 1);
                break;
            }
        }
        return newStateExpenseDel;
    case VEHICLE_EXPENSE_EDIT:
        let newStateVehicleExpenseEdit = {...state}
        for (let i = 0; i < newStateVehicleExpenseEdit.vehicleList.length; i++) {
            if (newStateVehicleExpenseEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleExpenseEdit.vehicleList[i].expenseList.length; k++) {
                    if (newStateVehicleExpenseEdit.vehicleList[i].expenseList[k].id == action.payload.id) {
                        newStateVehicleExpenseEdit.vehicleList[i].expenseList[k] = {...action.payload}
                        break;
                    }
                }
            }
        }
        return newStateVehicleExpenseEdit;

    case VEHICLE_SERVICE_DEL:
        let newStateServiceDel = {...state};
        for (let i = 0; i < newStateServiceDel.serviceList.length; i++) {
            if (newStateServiceDel.serviceList[i].id == action.payload) {
                newStateServiceDel.serviceList.splice(i, 1);
                break;
            }
        }
        return newStateServiceDel;
    case VEHICLE_SERVICE_EDIT:
        let newStateVehicleServiceEdit = {...state}
        for (let i = 0; i < newStateVehicleServiceEdit.vehicleList.length; i++) {
            if (newStateVehicleServiceEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleServiceEdit.vehicleList[i].serviceList.length; k++) {
                    if (newStateVehicleServiceEdit.vehicleList[i].serviceList[k].id == action.payload.id) {
                        newStateVehicleServiceEdit.vehicleList[i].serviceList[k] = {...action.payload}
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
    default:
        return state;
    }
}
