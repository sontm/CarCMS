
export default {
    // Tempo data which
    BUFFER_NEED_RECALCULATE_VEHICLE_ID: [],
    DATA_BRAND_MODEL:[
        { id: 1,name: "Toyota", models: [{id:1, name: "Vios"},{id:2, name: "Hilux"},{id:3, name: "Yaris"},{id:4, name: "Camry"}]},
        { id: 2,name: "Madza", models: [{id:5, name: "X3"},{id:6, name: "X4"},{id:7, name: "X5"},{id:8, name: "CX5"}]},
        { id: 3,name: "Honda", models: [{id:9, name: "CRV"},{id:10, name: "City"}]},
        { id: 4,name: "Nissan", models: [{id:11, name: "X-Trail"},{id:12, name: "Sunny"},{id:13, name: "Surge"}]},
        { id: 5,name: "Kia", models: [{id:14, name: "Morning"},{id:15, name: "K3"},{id:16, name: "Cerato"},{id:17, name: "Sorento"}]},
        { id: 6,name: "Huyndai", models: [{id:18, name: "i10"},{id:19, name: "New i10"},{id:20, name: "Accent"},{id:21, name: "Elanta"}]},
    ],
    DATA_EXPENSE_TYPE: [
        {id: 1, name: "Tiền Phạt"},
        {id: 2, name: "Cầu Đường"},
        {id: 3, name: "Gửi Xe"},
        {id: 4, name: "Rửa Xe"}
    ],
    DATA_SERVICE_TYPE: [
        {id: 1, name: "Lốp"}, // Lop Xe
        {id: 2, name: "Săm"},// Sam Xe
        {id: 3, name: "Pin"},//
        {id: 4, name: "Nước"},
        {id: 3, name: "Phanh"},
        {id: 3, name: "Đèn"},
        {id: 3, name: "Bơm Lốp"},
    ],

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

    SETTING_KM_NEXT_OILFILL: 1000,
    SETTING_DAY_NEXT_AUTHORIZE_CAR: 730, // 2year

    TEMPO_USE_BARCHART_GAS: true,

    SERVER_API:"http://52.77.223.247:3000/api",
    //SERVER_API:  "http://192.168.1.81:3000/api",
    //SERVER_API:  "http://localhost:3000/api", // why localhost here not OK
    COLOR_SCALE_10: ["#1890FF","#ff7f0e","#98df8a","#9467bd","#17becf","#98df8a","#ffbb78","#e377c2","#ff7f0e","#e377c2"],
    COLOR_PICKER_TEXT: "#1f77b4",
    COLOR_GREY_BG: "rgb(200, 200, 200)",
    COLOR_GREY_LIGHT_BG: "rgb(240, 240, 240)",
    COLOR_BUTTON_BG: "#3b5998", // FB color
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