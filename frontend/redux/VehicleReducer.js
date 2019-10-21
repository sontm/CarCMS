import { REHYDRATE } from 'redux-persist';
import AppConstants from '../constants/AppConstants'

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

// brandModelCar:[{ id: 1,name: "Toyota",models:[{id:1, name: "Vios"}]}]
// brandModelBike:{}
// expenseTypes: []
// serviceTypes: []
// defaultVehicleSetting: {userId,kmForOilCar,kmForOilBike,monthAuthoBeyond9To7Year...}

// customVehicleSetting: {userId,vehicleId,kmForOilCar,kmForOilBike,monthAuthoBeyond9To7Year...}

// vehicleList: 
    //{userId, brand: "K",model:"C",licensePlate:"18M1",checkedDate:"01/14/2019",id:3,type:"car|bike", isDefault, remark}
// fillGasList: 
    //{userId, vehicleId: 2, fillDate: "10/14/2019,11:30:14 PM",amount:2,price:100000,currentKm: 123344,id: 1,type(gas|oil),subType(not used), remark}
// fillOilList: 
    //{userId, vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1,type(gas|oil),subType(not used), remark}
// AuthorizeList:
    //{userId, vehiceId, fillDate, price, amount(not used), currentKm, id, type(auth), subType(not used), remark}
// Expense (Fine, Route, CarWash, Parking)
    //{userId, vehicleId, fillDate, price, amount(not used), currentKm, type(expense), subType (expenseType), remark}
// Service (bao tri: ...)
    //{userId, vehicleId, fillDate, price, amount(not used), currentKm, type(service), subType (serviceType), remark}

const initialState = {
    defaultVehicleId: 0,
    vehicleList:[],
    fillGasList:[],
    fillOilList:[],
    authorizeCarList:[],
    expenseList:[],
    serviceList:[]
};

export const actVehicleAddVehicle = (vehicle, syncFromServer = false) => (dispatch) => {
    console.log("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_ADD,
        payload: {data: vehicle, syncFromServer: syncFromServer}
    })
}
export const actVehicleEditVehicle = (vehicle) => (dispatch) => {
    console.log("actVehicleEditVehicle:")
    dispatch({
        type: VEHICLE_EDIT,
        payload: vehicle
    })
}
export const actVehicleDeleteVehicle = (vehicleId, licensePlate) => (dispatch) => {
    console.log("actVehicleDeleteVehicle:"+vehicleId+",licensePlate:" + licensePlate)
    dispatch({
        type: VEHICLE_DEL,
        payload: {id: vehicleId, licensePlate: licensePlate}
    })
}

export const actVehicleAddFillItem = (data, type, syncFromServer = false) => (dispatch) => {
    console.log("actVehicleAddFillItem:")
    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_ADD,
            payload: {data: data, syncFromServer: syncFromServer}
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_ADD,
            payload: {data: data, syncFromServer: syncFromServer}
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_ADD,
            payload: {data: data, syncFromServer: syncFromServer}
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_ADD,
            payload: {data: data, syncFromServer: syncFromServer}
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_ADD,
            payload: {data: data, syncFromServer: syncFromServer}
        })
    }
}

// type: gas, oil, auth, 
export const actVehicleDeleteFillItem = (itemId, type) => (dispatch) => {
    console.log("actVehicleDeleteFillItem:"+itemId+",type:" + type)
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
}

// type: gas, oil, auth, 
export const actVehicleEditFillItem = (itemId, type) => (dispatch) => {
    console.log("actVehicleEditFillItem:"+itemId+",type:" + type)
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
}

//careful, this make AsyncStorage Lost All
// case REHYDRATE:
//     let havejustLoadState = {...state};
//     console.log("HVE JUST LOAD STATE--------------")
//     return havejustLoadState;

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    // case REHYDRATE:
    //     console.log("HVE JUST LOAD STATE--------------")
    //     state.expenseList= [];
    //     state.serviceList= [];
    //     return state;
    case VEHICLE_ADD:
        if (action.payload.syncFromServer) {
            var newStateVehicleAdd = {
                ...state,
                vehicleList: [...action.payload.data]
            };
        } else {
            var newStateVehicleAdd = {
                ...state,
                vehicleList: [...state.vehicleList, action.payload.data]
            };
        }
        
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
                newStateVehicle.vehicleList[i] = {...action.payload}
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
        return newState;
    case VEHICLE_FILL_GAS_ADD:
        if (action.payload.syncFromServer) {
            return {
                ...state,
                fillGasList: [...action.payload.data]
            };
        } else {
            return {
                ...state,
                fillGasList: [...state.fillGasList, action.payload.data]
            };
        }
        
    case VEHICLE_FILL_OIL_ADD:
        if (action.payload.syncFromServer) {
            return {
                ...state,
                fillOilList: [...action.payload.data]
            };
        } else {
            return {
                ...state,
                fillOilList: [...state.fillOilList, action.payload.data]
            };
        }

    case VEHICLE_CAR_AUTH_ADD:
        if (action.payload.syncFromServer) {
            return {
                ...state,
                authorizeCarList: [...action.payload.data]
            };
        } else {
            return {
                ...state,
                authorizeCarList: [...state.authorizeCarList, action.payload.data]
            };
        }

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
        for (let i = 0; i < newStateVehicleGasEdit.fillGasList.length; i++) {
            if (newStateVehicleGasEdit.fillGasList[i].id == action.payload.id) {
                newStateVehicleGasEdit.fillGasList[i] = {...action.payload}
                break;
            }
        }
        return newStateVehicleGasEdit;
    case VEHICLE_FILL_OIL_EDIT:
        let newStateVehicleOilEdit = {...state}
        for (let i = 0; i < newStateVehicleOilEdit.fillOilList.length; i++) {
            if (newStateVehicleOilEdit.fillOilList[i].id == action.payload.id) {
                newStateVehicleOilEdit.fillOilList[i] = {...action.payload}
                break;
            }
        }
        return newStateVehicleOilEdit;
    case VEHICLE_CAR_AUTH_EDIT:
        let newStateVehicleAuthEdit = {...state}
        for (let i = 0; i < newStateVehicleAuthEdit.authorizeCarList.length; i++) {
            if (newStateVehicleAuthEdit.authorizeCarList[i].id == action.payload.id) {
                newStateVehicleAuthEdit.authorizeCarList[i] = {...action.payload}
                break;
            }
        }
        return newStateVehicleAuthEdit;


    case VEHICLE_EXPENSE_ADD:
        if (action.payload.syncFromServer) {
            return {
                ...state,
                expenseList: [...action.payload.data]
            };
        } else {
            return {
                ...state,
                expenseList: [...state.expenseList, action.payload.data]
            };
        }
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
        for (let i = 0; i < newStateVehicleExpenseEdit.expenseList.length; i++) {
            if (newStateVehicleExpenseEdit.expenseList[i].id == action.payload.id) {
                newStateVehicleExpenseEdit.expenseList[i] = {...action.payload}
                break;
            }
        }
        return newStateVehicleExpenseEdit;


    case VEHICLE_SERVICE_ADD:
        if (action.payload.syncFromServer) {
            return {
                ...state,
                serviceList: [...action.payload.data]
            };
        } else {
            return {
                ...state,
                serviceList: [...state.serviceList, action.payload.data]
            };
        }

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
        for (let i = 0; i < newStateVehicleServiceEdit.serviceList.length; i++) {
            if (newStateVehicleServiceEdit.serviceList[i].id == action.payload.id) {
                newStateVehicleServiceEdit.serviceList[i] = {...action.payload}
                break;
            }
        }
        return newStateVehicleServiceEdit;
    default:
        return state;
    }
}
