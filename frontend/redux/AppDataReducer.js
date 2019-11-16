import { REHYDRATE } from 'redux-persist';
const APPDATA_OPEN_COUNT = 'APPDATA_OPEN_COUNT';

// ### Toyota OK
// Alphard Altis Avanza Camry Fortuner Hiace Hilux Innova LandPrado LandCruiser Prado Rush Vios Wigo Yaris
// ### Ford	OK
// Ecosport Escape Everest Explorer F150 Fiesta Focus Ranger Tourneo Transit
// ### Honda	OK
// Accord Brio BRV City Civic CRV HRV Jazz
// ### Hyundai OK
// Accent Elantra Genesis i10 Kona SantaFe Solati Sonata Starex Tucson 
// ### Mazda OK
// 2 3 6 BT50 CX3 CX5 CX8 CX9 MX5
// ### Kia OK
// Cerato(K3) Morning Optima(K5) Quoris(K9) GrandSedona Rondo Soluto Sorento 
// ### Mitsubishi OK
// Attrage Mirage Outlander Pajero Triton Xpander
// ### Nissan OK
// Juke Livina Murano Navara Nismo Sunny Teana Terra Urvan X-Trail 
// ### Vinfast
// Fadil LuxA2.0 LuxSA2.0 LuxV8
// ### Suzuki OK
// Blind Carry CarryPro Celerio Ciaz Ertiga Swift Vitara
// ### Subaru OK
// BRZ Forester Impreza Legacy Levorg Outback XV WXR
// ### Chevrolet OK
// Aveo Captiva Colorado Cruze Orlando Spark Trailblazer Trax
// ### ISUZU OK
// D-MAX MU-X Nseries Qseries
// ### DAIHATSU OK
// AYLA COPEN GRANMAX HIMAX SIGRA TERIOS 
// ### Mercedes OK
// A200 A250 A45 C200 C300 CLA200 CLA250 CLA45 E200 E250 E350  GLA200 GLA250  GLA45 GLC200 GLC250 GLC300 GLC43

// Not Prepare Data for THis, LUXURY
// ### BMW
// 118i 218i 320i 420i 520i 530i 730Li 740Li 750i M4 X1 X2 X3 X4 X5 X6 X7
// ### MiniCooper 
// Convertible Countryman Clubman One JCW Roadster S
// ### Renault
// CLIO DUSTER KOLEOS LATITUDE LOGAN MEGANE SANDERO TALISMAN 
// ### Audi
// A3 A4 A5 A6 A7 A8L Q2 Q3 Q5 Q7 Q8 R8  RS7 S8 TTS
// ### Lexus
// ES250 ES300h GS300 GS350 NX300 RX300 RX350 RX350L RX450H GX460 LX570 RC300 LS500 LS500h
// ### Volkswagen
// BeetleDune Elegance Jetta Luxury Passat Polo Premium Scirocco Sharan Tiguan Touareg
// ### Peugeot 
// 208 2008 308 3008 408 508 5008 Luxury Premium RCZ
const DATA_BRAND_MODEL = [
    { id: 1,name: "Toyota", 
        models: [{"id":1,"name":"Alphard"},{"id":2,"name":"Altis"},{"id":3,"name":"Avanza"},{"id":4,"name":"Camry"},{"id":5,"name":"Fortuner"},{"id":6,"name":"Hiace"},{"id":7,"name":"Hilux"},{"id":8,"name":"Innova"},{"id":9,"name":"LandPrado"},{"id":10,"name":"LandCruiser"},{"id":11,"name":"Prado"},{"id":12,"name":"Rush"},{"id":13,"name":"Vios"},{"id":14,"name":"Wigo"},{"id":15,"name":"Yaris"}]},
    { id: 2,name: "Hyundai", 
        models: [{"id":1,"name":"Accent"},{"id":2,"name":"Elantra"},{"id":3,"name":"Genesis"},{"id":4,"name":"i10"},{"id":5,"name":"Kona"},{"id":6,"name":"SantaFe"},{"id":7,"name":"Solati"},{"id":8,"name":"Sonata"},{"id":9,"name":"Starex"},{"id":10,"name":"Tucson"},{"id":11,"name":""}]},
    { id: 3,name: "Mazda", 
        models: [{"id":1,"name":"2"},{"id":2,"name":"3"},{"id":3,"name":"6"},{"id":4,"name":"BT50"},{"id":5,"name":"CX3"},{"id":6,"name":"CX5"},{"id":7,"name":"CX8"},{"id":8,"name":"CX9"},{"id":9,"name":"MX5"}]},
    { id: 4,name: "Kia", 
        models: [{"id":1,"name":"Cerato(K3)"},{"id":2,"name":"Morning"},{"id":3,"name":"Optima(K5)"},{"id":4,"name":"Quoris(K9)"},{"id":5,"name":"GrandSedona"},{"id":6,"name":"Rondo"},{"id":7,"name":"Soluto"},{"id":8,"name":"Sorento"}]},
    { id: 5,name: "Honda", 
        models: [{"id":1,"name":"Accord"},{"id":2,"name":"Brio"},{"id":3,"name":"BRV"},{"id":4,"name":"City"},{"id":5,"name":"Civic"},{"id":6,"name":"CRV"},{"id":7,"name":"HRV"},{"id":8,"name":"Jazz"}]},
    { id: 6,name: "Ford", 
        models: [{"id":1,"name":"Ecosport"},{"id":2,"name":"Escape"},{"id":3,"name":"Everest"},{"id":4,"name":"Explorer"},{"id":5,"name":"F150"},{"id":6,"name":"Fiesta"},{"id":7,"name":"Focus"},{"id":8,"name":"Ranger"},{"id":9,"name":"Tourneo"},{"id":10,"name":"Transit"}]},
    { id: 7,name: "Mitsubishi", 
        models: [{"id":1,"name":"Attrage"},{"id":2,"name":"Mirage"},{"id":3,"name":"Outlander"},{"id":4,"name":"Pajero"},{"id":5,"name":"Triton"},{"id":6,"name":"Xpander"}]},
    
    { id: 8,name: "Nissan", 
        models: [{"id":1,"name":"Juke"},{"id":2,"name":"Livina"},{"id":3,"name":"Murano"},{"id":4,"name":"Navara"},{"id":5,"name":"Nismo"},{"id":6,"name":"Sunny"},{"id":7,"name":"Teana"},{"id":8,"name":"Terra"},{"id":9,"name":"Urvan"},{"id":10,"name":"X-Trail"}]},
    { id: 9,name: "Suzuki", 
        models: [{"id":1,"name":"Blind"},{"id":2,"name":"Carry"},{"id":3,"name":"CarryPro"},{"id":4,"name":"Celerio"},{"id":5,"name":"Ciaz"},{"id":6,"name":"Ertiga"},{"id":7,"name":"Swift"},{"id":8,"name":"Vitara"}]},
    { id: 10,name: "Subaru", 
        models: [{"id":1,"name":"BRZ"},{"id":2,"name":"Forester"},{"id":3,"name":"Impreza"},{"id":4,"name":"Legacy"},{"id":5,"name":"Levorg"},{"id":6,"name":"Outback"},{"id":7,"name":"XV"},{"id":8,"name":"WXR"}]},
    { id: 11,name: "Chevrolet", 
        models: [{"id":1,"name":"Aveo"},{"id":2,"name":"Captiva"},{"id":3,"name":"Colorado"},{"id":4,"name":"Cruze"},{"id":5,"name":"Orlando"},{"id":6,"name":"Spark"},{"id":7,"name":"Trailblazer"},{"id":8,"name":"Trax"}]},
    { id: 12,name: "Isuzu", 
        models: [{"id":1,"name":"D-MAX"},{"id":2,"name":"MU-X"},{"id":3,"name":"Nseries"},{"id":4,"name":"Qseries"}]},
    { id: 13,name: "Daihatsu", 
        models: [{"id":1,"name":"AYLA"},{"id":2,"name":"COPEN"},{"id":3,"name":"GRANMAX"},{"id":4,"name":"HIMAX"},{"id":5,"name":"SIGRA"},{"id":6,"name":"TERIOS"},{"id":7,"name":""}]},
    { id: 14,name: "Mercedes", 
        models: [{"id":1,"name":"A200"},{"id":2,"name":"A250"},{"id":3,"name":"A45"},{"id":4,"name":"C200"},{"id":5,"name":"C300"},{"id":6,"name":"CLA200"},{"id":7,"name":"CLA250"},{"id":8,"name":"CLA45"},{"id":9,"name":"E200"},{"id":10,"name":"E250"},{"id":11,"name":"E350"},{"id":12,"name":""},{"id":13,"name":"GLA200"},{"id":14,"name":"GLA250"},{"id":15,"name":""},{"id":16,"name":"GLA45"},{"id":17,"name":"GLC200"},{"id":18,"name":"GLC250"},{"id":19,"name":"GLC300"},{"id":20,"name":"GLC43"}]},
    { id: 15,name: "VINFAST", 
        models: [{"id":1,"name":"Fadil"},{"id":2,"name":"LuxA2.0"},{"id":3,"name":"LuxSA2.0"},{"id":4,"name":"LuxV8"}]},
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
    // case REHYDRATE:
    //     console.log("HVE JUST LOAD STATE--------------")
    //     let newAA = {...state}; // THis code will Lose all
    //     if (!state.vehicleList) state.vehicleList= [];
    //     return newAA;
    case APPDATA_OPEN_COUNT:
        return {
            ...state,
            countOpen: state.countOpen+1
        };
    default:
        return state;
    }
}
