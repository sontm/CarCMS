const TEAM_GET_OK = 'TEAM_GET_OK';

const initialState = {
    members: []
};

export const actTeamGetDataOK = (data) => (dispatch) => {
    console.log("actSettingSetVehicleDefault:")
    dispatch({
        type: TEAM_GET_OK,
        payload: data
    })
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case TEAM_GET_OK:
        return {
            ...state,
            members: action.payload
        };
    default:
        return state;
    }
}
