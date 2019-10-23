import { REHYDRATE } from 'redux-persist';
import AppConstants from '../constants/AppConstants'

const VEHICLE_SYNC_FROMSERVER = 'VEHICLE_SYNC_FROMSERVER';

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

export const actVehicleAddVehicle = (vehicle) => (dispatch) => {
    console.log("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_ADD,
        payload: vehicle
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

export const actVehicleAddFillItem = (data, type) => (dispatch) => {
    console.log("actVehicleAddFillItem:")
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


export const actVehicleSyncAllFromServer = (data) => (dispatch) => {
    console.log("actVehicleSyncFromServer:")
    dispatch({
        type: VEHICLE_SYNC_FROMSERVER,
        payload: data
    })
    
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
    //     //let newAA = {...state}; // THis code will Lose all
    //     state.expenseList= [];
    //     state.serviceList= [];
    //     return state;
    case VEHICLE_SYNC_FROMSERVER:
        return {
            ...state,
            vehicleList: action.payload.vehicle,
            fillGasList: action.payload.gas,
            fillOilList: action.payload.oil,
            authorizeCarList: action.payload.authcheck,
            expenseList: action.payload.expense,
            serviceList: action.payload.service,
        }
    case VEHICLE_ADD:
        var newStateVehicleAdd = {
            ...state,
            vehicleList: [...state.vehicleList, action.payload]
        };
        
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
                for (let i = 0; i < newStateVehicleGasEdit.vehicleList[i].fillGasList.length; i++) {
                    if (newStateVehicleGasEdit.vehicleList[i].fillGasList[i].id == action.payload.id) {
                        newStateVehicleGasEdit.vehicleList[i].fillGasList[i] = {...action.payload}
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
                for (let i = 0; i < newStateVehicleOilEdit.vehicleList[i].fillOilList.length; i++) {
                    if (newStateVehicleOilEdit.vehicleList[i].fillOilList[i].id == action.payload.id) {
                        newStateVehicleOilEdit.vehicleList[i].fillOilList[i] = {...action.payload}
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
                for (let i = 0; i < newStateVehicleAuthEdit.vehicleList[i].authorizeCarList.length; i++) {
                    if (newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[i].id == action.payload.id) {
                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[i] = {...action.payload}
                        break;
                    }
                }
            }
        }
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
                for (let i = 0; i < newStateVehicleExpenseEdit.vehicleList[i].expenseList.length; i++) {
                    if (newStateVehicleExpenseEdit.vehicleList[i].expenseList[i].id == action.payload.id) {
                        newStateVehicleExpenseEdit.vehicleList[i].expenseList[i] = {...action.payload}
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
                for (let i = 0; i < newStateVehicleServiceEdit.vehicleList[i].serviceList.length; i++) {
                    if (newStateVehicleServiceEdit.vehicleList[i].serviceList[i].id == action.payload.id) {
                        newStateVehicleServiceEdit.vehicleList[i].serviceList[i] = {...action.payload}
                        break;
                    }
                }
            }
        }
        return newStateVehicleServiceEdit;
    default:
        return state;
    }
}
