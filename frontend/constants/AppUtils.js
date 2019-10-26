import AppConstants from './AppConstants'
import Backend from '../constants/Backend';

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
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    formatDateMonthDayVN(t) {
        return dateFormat(new Date(t), "d/mmm");
    }
    formatDateMonthYearVN(t) {
        return dateFormat(new Date(t), "yyyy/mm");
    }
    formatDateMonthDayYearVN(t) {
        return dateFormat(new Date(t), "d-mmmm-yyyy");
    }
    formatMoneyToK(v) {
        return (v/1000).toFixed(0) + "K";
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
    makeRandomAlphaNumeric(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    // Set the Time to End of that day
    normalizeFillDate(input) {
        return new Date(input.getFullYear()
            ,input.getMonth()
            ,input.getDate()
            ,23,59,59); //23:59:59
    }
    // Set the Time to Begin of that day
    normalizeDateBegin(input) {
        return new Date(input.getFullYear()
            ,input.getMonth()
            ,input.getDate()
            ,0,0,1); //23:59:59
    }

    // input: [{vehicleId: 1, fillDate: "", amount: 5, price: 3423434, currentKm: 1123, id: 2}]
    // Output of Average KM Weekly/Monthly
    // [{x:dateFillGas, y:average}]
    getStatForGasUsage(fillGasList) {
        // Sort by fill Date
        // TODO
        if (!fillGasList) {
            return {};
        }
        let lastKm = 0;
        let totalMoneyGas = 0;
        let lastDate = 0;
        let todayLiter = 0;

        let beginKm = 0;
        let beginDate = 0;

        let arrMoneyPerWeek = [];
        let arrKmPerWeek = [];

        let arrTotalKmMonthly = []; // Key is Month: i.e 6/2019: value {x, y}
        let objTotalKmMonthly = {}; // Key is Month: i.e 6/2019: value

        let arrTotalMoneyMonthly = [];
        let objTotalMoneyMonthly = {}; // Key is Month: i.e 6/2019: value

        if (fillGasList && fillGasList.length > 0) {
            beginKm = fillGasList[0].currentKm;
            beginDate = this.normalizeFillDate(new Date(fillGasList[0].fillDate))

            lastKm = fillGasList[fillGasList.length -1].currentKm;
            lastDate = this.normalizeFillDate(new Date(fillGasList[fillGasList.length -1].fillDate))

            fillGasList.forEach((item, index) => {
                
                // For money and Litre, not use the Last Fill date (because that fill is for next)
                if (index != fillGasList.length -1) {
                    totalMoneyGas += item.price;
                    todayLiter += item.amount;
                }

                // Calculate Average KM from Previous Fill Gas
                if (index > 0) {
                    let currentDate = this.normalizeFillDate(new Date(fillGasList[index].fillDate));
                    let prevDate = this.normalizeFillDate(new Date(fillGasList[index-1].fillDate));
                    
                    let currentMonthKey = "" + currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) ;
                    let prevMonthKey = "" + prevDate.getFullYear() + "/" + (prevDate.getMonth() + 1);

                    const diffTime = Math.abs(currentDate - prevDate); // in ms
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                    let averageKMPerDay = (item.currentKm - fillGasList[index-1].currentKm)/diffDays;
                    // Money is from Previous Fill time
                    let averageMoneyPerDay = fillGasList[index-1].price/diffDays;

                    arrMoneyPerWeek.push({x: new Date(item.fillDate), y: averageMoneyPerDay*30})
                    arrKmPerWeek.push({x: new Date(item.fillDate), y: averageKMPerDay*30})

                    let firstDayOfCurrentMonth = this.normalizeFillDate(new Date(currentDate.getFullYear(),currentDate.getMonth(),1))
                    let lastDayOfPrevMonth = this.normalizeFillDate(new Date(prevDate.getFullYear(),prevDate.getMonth()+1,0))
                    const diffDayCurrentToFirst = Math.ceil(Math.abs(currentDate - firstDayOfCurrentMonth) / (1000 * 60 * 60 * 24)); 
                    const diffDayPrevToLast = Math.ceil(Math.abs(lastDayOfPrevMonth - prevDate) / (1000 * 60 * 60 * 24)); 
                    
                    
                    if (currentDate.getMonth() != prevDate.getMonth()) {
                        // two or three Diffirent Month

                        if (!objTotalKmMonthly[""+prevMonthKey]) {
                            // Not exist, create new
                            objTotalKmMonthly[""+prevMonthKey] = {
                                y: averageKMPerDay * diffDayPrevToLast,
                                x: this.normalizeDateBegin(new Date(prevDate.getFullYear(),prevDate.getMonth()+1,0))
                            }
                            objTotalMoneyMonthly[""+prevMonthKey] = {
                                y: averageMoneyPerDay * diffDayPrevToLast,
                                x: this.normalizeDateBegin(new Date(prevDate.getFullYear(),prevDate.getMonth()+1,0))
                            }
                        } else {
                            // Exist, increase
                            objTotalKmMonthly[""+prevMonthKey].y += averageKMPerDay * diffDayPrevToLast;
                            objTotalMoneyMonthly[""+prevMonthKey].y += averageMoneyPerDay * diffDayPrevToLast;
                        }
                        if (!objTotalKmMonthly[""+currentMonthKey]) {
                            // Not exist, create new
                            objTotalKmMonthly[""+currentMonthKey] = {
                                y: averageKMPerDay * diffDayCurrentToFirst,
                                x: this.normalizeDateBegin(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0))
                            }
                            objTotalMoneyMonthly[""+currentMonthKey] = {
                                y: averageMoneyPerDay * diffDayCurrentToFirst,
                                x: this.normalizeDateBegin(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0))
                            }
                        } else {
                            // Exist, increase
                            objTotalKmMonthly[""+currentMonthKey].y += averageKMPerDay * diffDayCurrentToFirst;
                            objTotalMoneyMonthly[""+currentMonthKey].y += averageMoneyPerDay * diffDayCurrentToFirst;
                        }

                        // Loop Every Month Between Two Fill Date time
                        let loopFirstDateOfMonth = new Date(
                            lastDayOfPrevMonth.setDate(lastDayOfPrevMonth.getDate() + 1)
                            );
                        
                        while (loopFirstDateOfMonth.getMonth() < firstDayOfCurrentMonth.getMonth() || 
                        loopFirstDateOfMonth.getFullYear() < firstDayOfCurrentMonth.getFullYear()) {
                            let loopLastdateOfMonth = new Date(loopFirstDateOfMonth.getFullYear(),loopFirstDateOfMonth.getMonth()+1,0);                            

                            let diffDayPrevLast2FirstCurrent = 
                                Math.ceil(Math.abs(loopLastdateOfMonth - loopFirstDateOfMonth) / (1000 * 60 * 60 * 24))
                                + 1; 
                            let loopMonthKey = "" + loopFirstDateOfMonth.getFullYear() + "/" + (loopFirstDateOfMonth.getMonth() + 1) ;
                            
                            if (!objTotalKmMonthly[""+loopMonthKey]) {
                                // Not exist, create new
                                objTotalKmMonthly[""+loopMonthKey] = {
                                    y:averageKMPerDay * diffDayPrevLast2FirstCurrent,
                                    x: this.normalizeDateBegin(new Date(loopFirstDateOfMonth.getFullYear(),
                                    loopFirstDateOfMonth.getMonth()+1,0))
                                }
                                objTotalMoneyMonthly[""+loopMonthKey] = {
                                    y:averageMoneyPerDay * diffDayPrevLast2FirstCurrent,
                                    x: this.normalizeDateBegin(new Date(loopFirstDateOfMonth.getFullYear(),
                                    loopFirstDateOfMonth.getMonth()+1,0))
                                }
                            } else {
                                // Exist, increase
                                objTotalKmMonthly[""+loopMonthKey].y += averageKMPerDay * diffDayPrevLast2FirstCurrent;
                                objTotalMoneyMonthly[""+loopMonthKey].y += averageMoneyPerDay * diffDayPrevLast2FirstCurrent;
                            }

                            loopFirstDateOfMonth = new Date(
                                loopLastdateOfMonth.setDate(loopLastdateOfMonth.getDate() + 1)
                                );
                        }
                    } else {

                        // Same Month
                        if (!objTotalKmMonthly[""+currentMonthKey]) {
                            // Not exist, create new
                            objTotalKmMonthly[""+currentMonthKey] = {
                                y: averageKMPerDay * diffDays,
                                x: this.normalizeFillDate(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0))
                            }
                            objTotalMoneyMonthly[""+currentMonthKey] = {
                                y: averageMoneyPerDay * diffDays,
                                x: this.normalizeDateBegin(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0))
                            }
                        } else {
                            // Exist, increase
                            objTotalKmMonthly[""+currentMonthKey].y += averageKMPerDay * diffDays;
                            objTotalMoneyMonthly[""+currentMonthKey].y += averageMoneyPerDay * diffDays;
                        }

                    }
                } 
            })

            // convert to Array for Chart
            for (var prop in objTotalKmMonthly) {
                if (Object.prototype.hasOwnProperty.call(objTotalKmMonthly, prop)) {
                    arrTotalKmMonthly.push(objTotalKmMonthly[""+prop])
                }
            }
            arrTotalKmMonthly.sort(function (a, b) {
                return a.x.getTime() - b.x.getTime();
            })

            // convert to Array for Chart
            for (var prop in objTotalMoneyMonthly) {
                if (Object.prototype.hasOwnProperty.call(objTotalMoneyMonthly, prop)) {
                    arrTotalMoneyMonthly.push(objTotalMoneyMonthly[""+prop])
                }
            }
            arrTotalMoneyMonthly.sort(function (a, b) {
                return a.x.getTime() - b.x.getTime();
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
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly};
        } else {
            return {};
        }

    }

    // input: [{vehicleId: 1, fillDate: "10/15/2018, 11:02:58 PM", price: 50000, currentKm: 90, id: 1}]
    getInfoForOilUsage(fillOilList, lastDate, lastKm, averageKmPerDay) {
        // Sort by fill Date
        // TODO
        if (!fillOilList) {
            return {};
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

    getInfoCarAuthorizeDate(authorizeList) {
        if (!authorizeList) {
            return {};
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
    getInfoMoneySpend(gasList, oilList, authList, expenseList, serviceList) {
        let arrGasSpend = [];
        let objGasSpend = {};
        let totalGasSpend = 0;
        if (gasList && gasList.length > 0) {
            gasList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (objGasSpend[""+dateKey]) {
                    // Exist, add more
                    objGasSpend[""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objGasSpend[""+dateKey] = {
                        x: this.normalizeDateBegin(new Date(itemDate.getFullYear(),itemDate.getMonth()+1,0)),
                        y: item.price
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objGasSpend) {
            if (Object.prototype.hasOwnProperty.call(objGasSpend, prop)) {
                arrGasSpend.push(objGasSpend[""+prop])
                totalGasSpend += objGasSpend[""+prop].y;
            }
        }
        arrGasSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        //------Oil
        let arrOilSpend = [];
        let objOilSpend = {};
        let totalOilSpend = 0;
        if (oilList && oilList.length > 0) {
            oilList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (objOilSpend[""+dateKey]) {
                    // Exist, add more
                    objOilSpend[""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objOilSpend[""+dateKey] = {
                        x: this.normalizeDateBegin(new Date(itemDate.getFullYear(),itemDate.getMonth()+1,0)),
                        y: item.price
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objOilSpend) {
            if (Object.prototype.hasOwnProperty.call(objOilSpend, prop)) {
                arrOilSpend.push(objOilSpend[""+prop])
                totalOilSpend += objOilSpend[""+prop].y;
            }
        }
        arrOilSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })


        //------Auth
        let arrAuthSpend = [];
        let objAuthSpend = {};
        let totalAuthSpend = 0;
        if (authList && authList.length > 0) {
            authList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (objAuthSpend[""+dateKey]) {
                    // Exist, add more
                    objAuthSpend[""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objAuthSpend[""+dateKey] = {
                        x: this.normalizeDateBegin(new Date(itemDate.getFullYear(),itemDate.getMonth()+1,0)),
                        y: item.price
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objAuthSpend) {
            if (Object.prototype.hasOwnProperty.call(objAuthSpend, prop)) {
                arrAuthSpend.push(objAuthSpend[""+prop])
                totalAuthSpend += objAuthSpend[""+prop].y;
            }
        }
        arrAuthSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })



        //------Expense
        let arrExpenseSpend = [];
        let objExpenseSpend = {};
        let totalExpenseSpend = 0;
        if (expenseList && expenseList.length > 0) {
            expenseList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (objExpenseSpend[""+dateKey]) {
                    // Exist, add more
                    objExpenseSpend[""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objExpenseSpend[""+dateKey] = {
                        x: this.normalizeDateBegin(new Date(itemDate.getFullYear(),itemDate.getMonth()+1,0)),
                        y: item.price
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objExpenseSpend) {
            if (Object.prototype.hasOwnProperty.call(objExpenseSpend, prop)) {
                arrExpenseSpend.push(objExpenseSpend[""+prop])
                totalExpenseSpend += objExpenseSpend[""+prop].y;
            }
        }
        arrExpenseSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })


        //------Service
        let arrServiceSpend = [];
        let objServiceSpend = {};
        let totalServiceSpend = 0;
        if (serviceList && serviceList.length > 0) {
            serviceList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (objServiceSpend[""+dateKey]) {
                    // Exist, add more
                    objServiceSpend[""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objServiceSpend[""+dateKey] = {
                        x: this.normalizeDateBegin(new Date(itemDate.getFullYear(),itemDate.getMonth()+1,0)),
                        y: item.price
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objServiceSpend) {
            if (Object.prototype.hasOwnProperty.call(objServiceSpend, prop)) {
                arrServiceSpend.push(objServiceSpend[""+prop])
                totalServiceSpend += objServiceSpend[""+prop].y;
            }
        }
        arrServiceSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        return {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,
            totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend};
    }
    getInfoMoneySpendInExpense(expenseList) {
        if (!expenseList) {
            return {};
        }

        let objExpenseTypeSpend = {};// Key is subtype
        let arrExpenseTypeSpend = [];
        if (expenseList && expenseList.length > 0) {
            expenseList.forEach((item, index) => {
                if (objExpenseTypeSpend[""+item.subType]) {
                    // Exist, increase
                    objExpenseTypeSpend[""+item.subType] += item.price;
                } else {
                    objExpenseTypeSpend[""+item.subType] = item.price;
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objExpenseTypeSpend) {
            if (Object.prototype.hasOwnProperty.call(objExpenseTypeSpend, prop)) {
                arrExpenseTypeSpend.push({
                    y: objExpenseTypeSpend[""+prop],
                    x: prop
                })
            }
        }
        return {arrExpenseTypeSpend};
    }

    async syncDataToServer(props) {
        console.log("LengVehicleList:" + props.userData.vehicleList.length)
      if (props.userData.vehicleList && props.userData.vehicleList.length > 0) {
        Backend.postFillItemList(props.userData.vehicleList, props.userData.token ,"vehicle",
          response => {console.log("Sync Post Vehicle OK")},
          error => {console.log(error)}
        );
      }
      // if (props.userData.fillGasList && props.userData.fillGasList.length > 0) {
      //   Backend.postFillItemList(props.userData.fillGasList, props.userData.token, "gas",
      //     response => {console.log("Sync Post Gas OK")},
      //     error => {console.log(error)}
      //   );
      // }
      // if (props.userData.fillOilList && props.userData.fillOilList.length > 0) {
      //   Backend.postFillItemList(props.userData.fillOilList, props.userData.token, "oil",
      //     response => {console.log("Sync Post Oil OK")},
      //     error => {console.log(error)}
      //   );
      // }
      // if (props.userData.authorizeCarList && props.userData.authorizeCarList.length > 0) {
      //   Backend.postFillItemList(props.userData.authorizeCarList, props.userData.token, "authcheck",
      //     response => {console.log("Sync Post AuthCheck OK")},
      //     error => {console.log(error)}
      //   );
      // }
      // if (props.userData.expenseList && props.userData.expenseList.length > 0) {
      //   Backend.postFillItemList(props.userData.expenseList, props.userData.token, "expense",
      //     response => {console.log("Sync Post Expense OK")},
      //     error => {console.log(error)}
      //   );
      // }
      // if (props.userData.serviceList && props.userData.serviceList.length > 0) {
      //   Backend.postFillItemList(props.userData.serviceList, props.userData.token, "service",
      //     response => {console.log("Sync Post Service OK")},
      //     error => {console.log(error)}
      //   );
      // }
    }
    syncDataFromServer(props) {
        Backend.getAllItemList("vehicle", props.userData.token,
            response => {
                console.log("Sync Vehicle From Server OK");
                //this.props.actVehicleAddVehicle(response.data, true)
                console.log(response.data)
                props.actVehicleSyncAllFromServer(response.data)
            },
            error => {console.log("Sync Vehicle From Server Error");console.log(error);}
        );
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("gas", props.userData.token,
        //       response => {
        //         console.log("Sync Gas From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_GAS, true)
        //         syncData.gas = response.data;
        //         resolve(response.data);
        //       },
        //       error => {console.log("Sync Gas From Server ERR");console.log(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("oil", props.userData.token,
        //       response => {
        //         console.log("Sync Oil From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_OIL, true)
        //         syncData.oil = response.data;
        //         resolve(response.data);
        //       },
        //       error => {console.log("Sync Oil From Server ERR");console.log(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("authcheck", props.userData.token,
        //       response => {
        //         console.log("Sync authcheck From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_AUTH, true)
        //         syncData.authcheck = response.data;
        //         resolve(response.data);
        //       },
        //       error => {console.log("Sync authcheck From Server ERR");console.log(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("expense", props.userData.token,
        //       response => {
        //         console.log("Sync expense From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_EXPENSE, true)
        //         syncData.expense = response.data;
        //         resolve(response.data);
        //       },
        //       error => {console.log("Sync expense From Server ERR");console.log(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("service", props.userData.token,
        //       response => {
        //         console.log("Sync service From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_SERVICE, true)
        //         syncData.service = response.data;
        //         resolve(response.data);
        //       },
        //       error => {console.log("Sync service From Server ERR");console.log(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
    }
}

const apputils = new AppUtils();

export default apputils;