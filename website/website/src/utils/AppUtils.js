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
// dateFormat.i18n = {
//     dayNames: [
//         'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
//         'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
//     ],
//     monthNames: [
//         '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12',
//         'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11','Tháng 12',
//     ],
//     timeNames: [
//         'S', 'C', 'S', 'C', 'S', 'C', 'S', 'C'
//     ]
// };

class AppUtils {
    CONSOLE_LOG(text) {
        if (AppConstants.IS_DEBUG_MODE) {
            console.log(text)
        }
    }
    formatDateMonthDayVN(t) {
        if (t)
            return dateFormat(new Date(t), "d/mmm");
    }
    
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getColorForIndex(idx) {
        let valueOffset = idx % 10;
        return AppConstants.COLOR_SCALE_10[valueOffset];

    }
    // High, Very High, Medium, Low
    getColorForRisk(risk) {
        if (risk == "Very High") {
            return "red";
        } else if (risk == "High") {
            return AppConstants.COLOR_HIGH_RISK;
        } else if (risk == "Medium") {
            return AppConstants.COLOR_MEDIUM_RISK;
        } else if (risk == "Low") {
            return AppConstants.COLOR_LOW_RISK;
        } else {
            return AppConstants.COLOR_TEXT_DARKDER_INFO;
        }

    }
    formatValueWithSign(val) {
        if (val >= 0) {
            return "+"+val;
        } else {
            return ""+val;
        }
    }
    formatToPercent(v, total) {
        return (v*100/total).toFixed(1) + "%";
    }
    reviseTickLabelsToCount(allLabels, expectedCount) {
        // SOrt first
        allLabels.sort((a, b) => a.getTime() - b.getTime());
        let DESIRE_TICK_COUNT = expectedCount; // First and End always included in Labels
        let gapOfPoint = Math.ceil((allLabels.length)/DESIRE_TICK_COUNT);
        let localCounter = 0;
        let labels = [];
        
        
        allLabels.forEach((item, idx) => {
            // Add first point
            if (idx == 0) {
                labels.push(item)
            } 
            // else if (idx == allLabels.length - 1) {
            //     labels.push(item)
            // } 
            else {
                localCounter++;
                if (localCounter >= gapOfPoint) {
                    labels.push(item)
                    localCounter = 0;
                }
            }
        })
        return labels;
    }

    pushInDateLabelsIfNotExist(arr, val, forcePush = false) {
        let isExist = false;
        for (let i = 0; i < arr.length; i++) {
            let cur = arr[i];
            if (cur.getFullYear() == val.getFullYear() && cur.getMonth() == val.getMonth() && cur.getDate() == val.getDate()) {
                // Different, not exist
                isExist = true;
                break;
            }
        }
        if (!isExist)
            arr.push(val)
    }
}

const apputils = new AppUtils();

export default apputils;