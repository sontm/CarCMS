import AppConstants from './AppConstants'

const dateFormat = require('dateformat');
// dateFormat.i18n = {
//     dayNames: [
//         'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
//         'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
//     ],
//     monthNames: [
//         'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
//         'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
//     ],
//     timeNames: [
//         'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
//     ]
// };
dateFormat.i18n = {
    dayNames: [
        'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
        'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
    ],
    monthNames: [
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11','T12',
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11','Tháng 12',
    ],
    timeNames: [
        'S', 'C', 'S', 'C', 'S', 'C', 'S', 'C'
    ]
};

class AppUtils {
    formatDateMonthDayVN(t) {
        return dateFormat(new Date(t), "d/mmm");
    }
    formatDateMonthDayYearVN(t) {
        return dateFormat(new Date(t), "d-mmmm-yyyy");
    }
    getVietnamNameOfFillItemType(type) {
        if (type == AppConstants.FILL_ITEM_GAS) {
            return "Xăng Dầu";
        } else if (type == AppConstants.FILL_ITEM_OIL) {
            return "Dầu Nhớt";
        } else if (type == AppConstants.FILL_ITEM_AUTH) {
            return "Đăng Kiểm";
        } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
            return "Chi Phí";
        } else if (type == AppConstants.FILL_ITEM_SERVICE) {
            return "Sửa Chữa";
        }
    }
    // input: [{vehicleId: 1, fillDate: "", amount: 5, price: 3423434, currentKm: 1123, id: 2}]

    // Output of Average KM Weekly/Monthly
    // [{x:dateFillGas, y:average}]
    getStatForGasUsage(fillGasListAll, ofVehicleId) {
        // Sort by fill Date
        // TODO
        if (!fillGasListAll) {
            return {};
        }
        let fillGasList = fillGasListAll;
        if (ofVehicleId) {
            fillGasList = fillGasListAll.filter(item => item.vehicleId == ofVehicleId);
        }
        let lastKm = 0;
        let totalMoneyGas = 0;
        let lastDate = 0;
        let todayLiter = 0;

        let beginKm = 0;
        let beginDate = 0;

        let arrMoneyPerWeek = [];
        let arrKmPerWeek = [];

        if (fillGasList && fillGasList.length > 0) {
            fillGasList.forEach((item, index) => {
                if (index == 0) {
                    beginKm = item.currentKm;
                    beginDate = new Date(item.fillDate);
                } else if (index == fillGasList.length -1) {
                    lastKm = item.currentKm;
                    lastDate = new Date(item.fillDate);
                }

                // For money and Litre, not use the Last Fill date (because that fill is for next)
                if (index != fillGasList.length -1) {
                    totalMoneyGas += item.price;
                    todayLiter += item.amount;
                }

                // Calculate Average KM from Previous Fill Gas
                if (index > 0) {
                    const diffTime = Math.abs(new Date(item.fillDate) - 
                        new Date(fillGasList[index-1].fillDate)); // in ms
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                    let averageKMPerDay = (item.currentKm - fillGasList[index-1].currentKm)/diffDays;
                    // Money is from Previous Fill time
                    let averageMoneyPerDay = fillGasList[index-1].price/diffDays;

                    arrMoneyPerWeek.push({x: new Date(item.fillDate), y: averageMoneyPerDay*7})
                    arrKmPerWeek.push({x: new Date(item.fillDate), y: averageKMPerDay*7})
                } 
            })
        }
        if (todayLiter) {
            // Calculate Passed duration between begin and last date
            const diffTime = Math.abs(lastDate - beginDate); // in ms
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            // 1.Average KM per Lit
            let averageKmPerLiter = (lastKm - beginKm) / todayLiter;
            // 2. Average Money per Lit
            let averageMoneyPerLiter = totalMoneyGas/ todayLiter;
            // 3. Average Money per Day
            let averageMoneyPerDay = totalMoneyGas/ diffDays;
            // 4. Average of KM per Day
            let averageKmPerDay = (lastKm - beginKm)/ diffDays;
            // 5. Mothly Report perMonth: KM, 
            // TODO

            return {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas};
        } else {
            return {};
        }

    }

    // input: [{vehicleId: 1, fillDate: "10/15/2018, 11:02:58 PM", price: 50000, currentKm: 90, id: 1}]
    getInfoForOilUsage(fillOilListAll, ofVehicleId, lastDate, lastKm, averageKmPerDay) {
        // Sort by fill Date
        // TODO
        if (!fillOilListAll) {
            return {};
        }
        let fillOilList = fillOilListAll;
        if (ofVehicleId) {
            fillOilList = fillOilListAll.filter(item => item.vehicleId == ofVehicleId);
        }
        let lastKmOil = 0;
        let totalMoneyOil = 0;
        let lastDateOil = 0;
        if (fillOilList && fillOilList.length > 0) {
            fillOilList.forEach((item, index) => {
                if (index == fillOilList.length -1) {
                    lastKmOil = item.currentKm;
                    lastDateOil = new Date(item.fillDate);
                }

                // For money and Litre, not use the Last Fill date (because that fill is for next)
                if (index != fillOilList.length -1) {
                    totalMoneyOil += item.price;
                }
            })

            // 1. Passed Km to Next Fill Oil
            let passedKmFromPreviousOil = lastKm - lastKmOil;
            // 2. Estimate date to Next Fill Oil
            let daysToNextOil = (AppConstants.SETTING_KM_NEXT_OILFILL -  passedKmFromPreviousOil) / averageKmPerDay;
            let nextEstimateDateForOil = new Date(lastDateOil)
            nextEstimateDateForOil = nextEstimateDateForOil.setDate(nextEstimateDateForOil.getDate() + daysToNextOil);
            
            nextEstimateDateForOil = new Date(nextEstimateDateForOil)

            return {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil};
        }
        return {};
    }

    getInfoCarAuthorizeDate(authorizeListAll, ofVehicleId) {
        if (!authorizeListAll) {
            return {};
        }
        let authorizeList = authorizeListAll;
        if (ofVehicleId) {
            authorizeList = authorizeListAll.filter(item => item.vehicleId == ofVehicleId);
        }
        let totalMoneyAuthorize = 0;
        let lastDate = null;
        if (authorizeList && authorizeList.length > 0) {
            authorizeList.forEach((item, index) => {
                if (index == authorizeList.length -1) {
                    lastDate = new Date(item.fillDate);
                }
                //if (index != authorizeList.length -1) {
                    totalMoneyAuthorize += item.price;
                //}
            })
        }
        if (lastDate) {
            let today = new Date();
            let nextAuthorizeDate = new Date(lastDate)
            nextAuthorizeDate = nextAuthorizeDate.setDate(nextAuthorizeDate.getDate() + AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR);

            const diffTime = Math.abs(today - lastDate); // in ms
            const diffDayFromLastAuthorize = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            nextAuthorizeDate = new Date(nextAuthorizeDate)

            return {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize};
        } else {
            return {}
        }
    }
}

const apputils = new AppUtils();

export default apputils;