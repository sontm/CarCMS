const APPDATA_OPEN_COUNT = 'APPDATA_OPEN_COUNT';

const DATA_BRAND_MODEL = [
    { id: 1,name: "Toyota", models: [{id:1, name: "Vios"},{id:2, name: "Hilux"},{id:3, name: "Yaris"},{id:4, name: "Camry"}]},
    { id: 2,name: "Madza", models: [{id:5, name: "X3"},{id:6, name: "X4"},{id:7, name: "X5"},{id:8, name: "CX5"}]},
    { id: 3,name: "Honda", models: [{id:9, name: "CRV"},{id:10, name: "City"}]},
    { id: 4,name: "Nissan", models: [{id:11, name: "X-Trail"},{id:12, name: "Sunny"},{id:13, name: "Surge"}]},
    { id: 5,name: "Kia", models: [{id:14, name: "Morning"},{id:15, name: "K3"},{id:16, name: "Cerato"},{id:17, name: "Sorento"}]},
    { id: 6,name: "Huyndai", models: [{id:18, name: "i10"},{id:19, name: "New i10"},{id:20, name: "Accent"},{id:21, name: "Elanta"}]},
]
const DATA_AUTH_TYPE = [
    {id: 1, name: "Đăng Kiểm"},
    {id: 2, name: "Bảo Hiểm Dân Sự"},
    {id: 3, name: "Phí Bảo Trì Đường Bộ"},
]
const DATA_EXPENSE_TYPE = [
    {id: 1, name: "Tiền Phạt"},
    {id: 2, name: "Cầu Đường"},
    {id: 3, name: "Gửi Xe"},
    {id: 4, name: "Rửa Xe"}
]
const DATA_SERVICE_TYPE = [
    {id: 1, name: "Lốp"}, // Lop Xe
    {id: 2, name: "Săm"},// Sam Xe
    {id: 3, name: "Pin"},//
    {id: 4, name: "Nước"},
    {id: 3, name: "Phanh"},
    {id: 3, name: "Đèn"},
    {id: 3, name: "Bơm Lốp"},
]

const initialState = {
    carModels: DATA_BRAND_MODEL,
    typeAuth: DATA_AUTH_TYPE,
    typeExpense: DATA_EXPENSE_TYPE,
    typeService: DATA_SERVICE_TYPE,

    countOpen: 0,
    isNoAds: false,
};

export const actAppIncreaseOpenCount = () => (dispatch) => {
    console.log("actAppIncreaseOpenCount:")
    dispatch({
        type: APPDATA_OPEN_COUNT
    })
}


// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case APPDATA_OPEN_COUNT:
        return {
            ...state,
            countOpen: state.countOpen+1
        };
    default:
        return state;
    }
}
