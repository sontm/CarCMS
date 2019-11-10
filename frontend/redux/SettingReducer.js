const SETTING_VEHICLE_SET_DEFAULT = 'SETTING_VEHICLE_SET_DEFAULT';

//defaultVehicleSetting
    //kmForOilCar: 10000,
    // kmForOilBike: 2000,
    // monthAuthoBeyond9To7Year: 18,
    // monthAuthoBeyond9From7To12Year: 12,
    // monthAuthoBeyond9Over12Year: 6,
    // monthAuthoOver9: 6,
    // monthAuthoAdvanceTo7Year: 12,
    // monthAuthoAdvanceOver7Year: 6,
const initialState = {
    defaultVehicleSetting: {}
};

export const actSettingSetVehicleDefault = (data) => (dispatch) => {
    console.log("actSettingSetVehicleDefault:")
    dispatch({
        type: SETTING_VEHICLE_SET_DEFAULT,
        payload: data
    })
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case SETTING_VEHICLE_SET_DEFAULT:
        return {
            ...state,
            defaultVehicleSetting: action.payload
        };
    default:
        return state;
    }
}
