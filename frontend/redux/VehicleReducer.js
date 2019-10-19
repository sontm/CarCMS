const VEHICLE_CURRENT_VEHICLE = 'VEHICLE_CURRENT_VEHICLE';
const VEHICLE_ADD = 'VEHICLE_ADD';
const VEHICLE_DEL = 'VEHICLE_DEL';

const VEHICLE_FILL_GAS_ADD = 'VEHICLE_FILL_GAS_ADD';
const VEHICLE_FILL_OIL_ADD = 'VEHICLE_FILL_OIL_ADD';
const VEHICLE_CAR_AUTH_ADD = 'VEHICLE_CAR_AUTH_ADD';

const initialState = {
    defaultVehicleId: 0,
    vehicleList:[],
    fillGasList:[],
    fillOilList:[],
    authorizeCarList:[],
};

export const actVehicleOpenDetailVehicle = (vehicleId) => (dispatch) => {
    console.log("actVehicleOpenDetailVehicle:")
    dispatch({
        type: VEHICLE_CURRENT_VEHICLE,
        payload: vehicleId
    })
}
export const actVehicleAddVehicle = (vehicle) => (dispatch) => {
    console.log("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_ADD,
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

export const actVehicleAddFillGas = (data) => (dispatch) => {
    console.log("actVehicleAddFillGas:")
    dispatch({
        type: VEHICLE_FILL_GAS_ADD,
        payload: data
    })
}
export const actVehicleAddFillOil = (data) => (dispatch) => {
    console.log("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_FILL_OIL_ADD,
        payload: data
    })
}
export const actVehicleAddCarAuthorize = (data) => (dispatch) => {
    console.log("actVehicleAddCarAuthorize:")
    dispatch({
        type: VEHICLE_CAR_AUTH_ADD,
        payload: data
    })
}

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case VEHICLE_CURRENT_VEHICLE:
        return {
            ...state,
            defaultVehicleId: action.payload
        };
    case VEHICLE_ADD:
        return {
            ...state,
            vehicleList: [...state.vehicleList, action.payload]
        };
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
        return {
            ...state,
            fillGasList: [...state.fillGasList, action.payload]
        };
    case VEHICLE_FILL_OIL_ADD:
        return {
            ...state,
            fillOilList: [...state.fillOilList, action.payload]
        };
    case VEHICLE_CAR_AUTH_ADD:
        return {
            ...state,
            authorizeCarList: [...state.authorizeCarList, action.payload]
        };
    default:
        return state;
    }
}
