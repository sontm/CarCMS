const TEMP_CALCULATE_CARREPORT = 'TEMP_CALCULATE_CARREPORT';
import AppUtils from '../constants/AppUtils'
const initialState = {
    carReports:{}, // {id: {gasReport,oilReport,authReport,moneyReport}}
};

async function actTempCalculateCarReportAsync(currentVehicle, options) {
    return new Promise((resolve, reject) => {
        if ( !options ) {
            // Default
            options = {
                durationType: "month",
                tillDate: new Date(),
                duration: 12,
            }
        }

        //let {lastDate, lastKm, averageKmPerDay} = AppUtils.getLastDateAndKmFromGas(currentVehicle.fillGasList);
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
            avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
            = AppUtils.getStatForGasUsage(currentVehicle.fillGasList, 
                options.duration, options.durationType, options.tillDate);

        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage(currentVehicle.fillOilList, 
                lastDate, lastKm, averageKmPerDay);
        let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
            = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend}
            = AppUtils.getInfoMoneySpendByTime(currentVehicle);

        let {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
            = AppUtils.getInfoMoneySpend(currentVehicle);
        
        let {arrExpenseTypeSpend} = AppUtils.getInfoMoneySpendInExpense(currentVehicle.expenseList);

        let result = {
            gasReport: {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly},
            oilReport: {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil},
            authReport: {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize},
            moneyReport: {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,
                totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend},
            expenseReport: {arrExpenseTypeSpend}
        }
        resolve(result)
    });
}
export const actTempCalculateCarReport = (currentVehicle, options, prevTempData) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    if (!prevTempData.carReports[currentVehicle.id]) {
        console.log(">>>actTempCalculateCarReport:")
        actTempCalculateCarReportAsync(currentVehicle, options)
        .then (result => {
            console.log("<<<actTempCalculateCarReport FINISH")
            dispatch({
                type: TEMP_CALCULATE_CARREPORT,
                payload: {id: currentVehicle.id, data: result}
            })
        })
        .catch (error => {
            console.log(error)
        })
    }
    
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case TEMP_CALCULATE_CARREPORT:

        let newState = {
            ...state,
        };
        newState.carReports[""+action.payload.id] = action.payload.data

        return newState;
    default:
        return state;
    }
}
