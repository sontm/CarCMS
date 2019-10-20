
export default {
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

    CURRENT_VEHICLE_ID: 0,
    CURRENT_EDIT_FILL_ID: 0,
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
};
