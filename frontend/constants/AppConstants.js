import { Platform} from 'react-native';
import Layout from './Layout';

// TODO
const ADS_BANNERID_ANDROID = "ca-app-pub-3940256099942544/6300978111"
const ADS_BANNERID_IOS= "ca-app-pub-3940256099942544/6300978111"
const ADS_INTERESTIALID_ANDROID = "ca-app-pub-3940256099942544/1033173712"
const ADS_INTERESTIALID_IOS = "ca-app-pub-3940256099942544/1033173712"
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const BANNER_ID = Platform.OS === 'ios' ? ADS_BANNERID_IOS : ADS_BANNERID_ANDROID;
const INTERESTIAL_ID = Platform.OS === 'ios' ? ADS_INTERESTIALID_IOS : ADS_INTERESTIALID_ANDROID;

export default {
    IS_DEBUG_MODE: true,
    // TODO Enable these values
    SETTING_KM_SHOWWARN: 100,
    SETTING_DAY_SHOW_WARN: 260,

    SETTING_MAX_CAR_INDIVIDUAL: 30,

    DEFAULT_BOTTOM_NAV_HEIGHT: 50,
    DEFAULT_FORM_WIDTH: Layout.window.width*1.0 - 10,
    DEFAULT_FORM_PADDING_HORIZON: 5,// Layout.window.width*0.05,
    DEFAULT_FORM_BUTTON_WIDTH: 150,

    ADS_BANNERID: BANNER_ID,
    ADS_INTERESTIALID: INTERESTIAL_ID,
    ADS_COUNT_CLICK_SHOW_INTERESTIAL: 20, // after every x click, show Interestial
    ADS_COUNT_CLICK_INTERACTIVE: 0,

    // Tempo data which
    BUFFER_NEED_RECALCULATE_VEHICLE_ID: [],
    TEMPDATA_SERVICE_MAINTAIN_MODULES: {},
    TEMPDATA_CREATESERVICEMODULE_ISBIKE: false,
    TEMPDATA_MODALDIALOG_STATE: 0,

    CURRENT_VEHICLE_ID: "0",
    CURRENT_EDIT_FILL_ID: "0",
    STORAGE_VEHICLE_LIST: "STORAGE_VEHICLE_LIST",
    STORAGE_FILL_GAS_LIST: "STORAGE_FILL_GAS_LIST",
    STORAGE_FILL_OIL_LIST: "STORAGE_FILL_OIL_LIST",
    STORAGE_AUTHORIZE_CAR_LIST: "STORAGE_AUTHORIZE_CAR_LIST",

    FILL_ITEM_GAS: "gas",
    FILL_ITEM_OIL: "oil",
    FILL_ITEM_AUTH: "auth",
    FILL_ITEM_EXPENSE: "expense",
    FILL_ITEM_SERVICE: "service",

    

    DEFAULT_REPORT_RANGE: 6, // 6 tháng
    DEFAULT_IOS_STATUSBAR_HEIGHT: STATUSBAR_HEIGHT, // in IOS, should set this to 20
    TEMPO_USE_BARCHART_GAS: true,
    LEGEND_CHITIEU: [
        {name:"Xăng"},{name:"Pháp Lý"},{name:"Phụ Chi"},{name:"Bảo Dưỡng"}
    ],

    //SERVER_API:"https://yamastack.com/api/",
    //SERVER_API:"http://18.140.121.240:3000/api",
    //SERVER_API:  "http://192.168.1.51:3000/api",
    //SERVER_API:  "http://localhost:3000/api", // why localhost here (not OK when on LAN setting of Expo)
    SERVER_API:  "http://172.20.10.2:3000/api",
    COLOR_SCALE_10: ["#1890FF","#ff7f0e","#98df8a","#9467bd","#17becf","#98df8a","#ffbb78","#e377c2","#ff7f0e","#e377c2"],
    COLOR_PICKER_TEXT: "#1565c0",//"#1f77b4",

    COLOR_GREY_DARK: "rgb(80, 80, 80)",
    COLOR_GREY_MIDDLE: "rgb(150, 150, 150)",
    COLOR_GREY_BG: "rgb(200, 200, 200)",
    COLOR_GREY_MIDDLE_LIGHT_BG: "rgb(220, 220, 220)",
    COLOR_GREY_LIGHT_BG: "rgb(240, 240, 240)",

    COLOR_HEADER_BG: "#1565c0", // MainThemeColor
    COLOR_HEADER_BG_LIGHT: "#4093db",//"#5e92f3", 
    COLOR_HEADER_BG_LIGHT_SUPER: "#b5e6ff",
    COLOR_HEADER_BG_DARKER: "#003c8f",
    COLOR_HEADER_BUTTON: "white",

    COLOR_BUTTON_BG: "#1565c0", // Main Theme color 3488d1
    COLOR_FACEBOOK: "#3b5998", // FB color
    COLOR_GOOGLE: "#DB4437",
    COLOR_TOMATO:"#ff7f0e",
    COLOR_D3_LIGHT_BLUE: "#1f77b4",
    COLOR_D3_DARK_GREEN: "#2ca02c",
    COLOR_D3_MIDDLE_GREEN: "#43d175", // TODO
    COLOR_D3_LIGHT_GREEN: "#98df8a",
    COLOR_TEXT_LIGHT_INFO: "rgb(150,150,150)",
    COLOR_TEXT_DARKDER_INFO: "rgb(110,110,110)",
    COLOR_TEXT_DARKEST_INFO: "rgb(90,90,90)",
    COLOR_TEXT_INACTIVE_TAB: "#a6b8de",

    COLOR_FILL_FUEL: "#2c8ef4", // blue
    COLOR_FILL_AUTH: "#3cc97b", // green
    COLOR_FILL_EXPENSE: "#FF9501", // orange
    COLOR_FILL_SERVICE: "#df43fa", // purple
    COLOR_FILL_CAR: "#2c8ef4"
};

//https://codepen.io/whitelynx/pen/pbberp
// Color from d3.scale.category20()
// 0   #1f77b4
// 1   #aec7e8
// 2   #ff7f0e
// 3   #ffbb78
// 4   #2ca02c
// 5   #98df8a
// 6   #d62728
// 7   #ff9896
// 8   #9467bd
// 9   #c5b0d5
// 10  #8c564b
// 11  #c49c94
// 12  #e377c2
// 13  #f7b6d2
// 14  #7f7f7f
// 15  #c7c7c7
// 16  #bcbd22
// 17  #dbdb8d
// 18  #17becf
// 19  #9edae5