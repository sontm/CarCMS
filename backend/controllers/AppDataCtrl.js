const DATA_BRAND_MODEL = [
  { id: 1,name: "Toyota", type:"car",
      models: [{"id":1,"name":"Alphard"},{"id":2,"name":"Altis"},{"id":3,"name":"Avanza"},{"id":4,"name":"Camry"},{"id":5,"name":"Fortuner"},{"id":6,"name":"Hiace"},{"id":7,"name":"Hilux"},{"id":8,"name":"Innova"},{"id":9,"name":"LandPrado"},{"id":10,"name":"LandCruiser"},{"id":11,"name":"Prado"},{"id":12,"name":"Rush"},{"id":13,"name":"Vios"},{"id":14,"name":"Wigo"},{"id":15,"name":"Yaris"}]},
  { id: 2,name: "Hyundai",  type:"car",
      models: [{"id":1,"name":"Accent"},{"id":2,"name":"Elantra"},{"id":3,"name":"Genesis"},{"id":4,"name":"i10"},{"id":5,"name":"Kona"},{"id":6,"name":"SantaFe"},{"id":7,"name":"Solati"},{"id":8,"name":"Sonata"},{"id":9,"name":"Starex"},{"id":10,"name":"Tucson"},{"id":11,"name":""}]},
  { id: 3,name: "Mazda", type:"car", 
      models: [{"id":1,"name":"2"},{"id":2,"name":"3"},{"id":3,"name":"6"},{"id":4,"name":"BT50"},{"id":5,"name":"CX3"},{"id":6,"name":"CX5"},{"id":7,"name":"CX8"},{"id":8,"name":"CX9"},{"id":9,"name":"MX5"}]},
  { id: 4,name: "Kia", type:"car",
      models: [{"id":1,"name":"Cerato(K3)"},{"id":2,"name":"Morning"},{"id":3,"name":"Optima(K5)"},{"id":4,"name":"Quoris(K9)"},{"id":5,"name":"GrandSedona"},{"id":6,"name":"Rondo"},{"id":7,"name":"Soluto"},{"id":8,"name":"Sorento"}]},
  { id: 5,name: "Honda",  type:"car",
      models: [{"id":1,"name":"Accord"},{"id":2,"name":"Brio"},{"id":3,"name":"BRV"},{"id":4,"name":"City"},{"id":5,"name":"Civic"},{"id":6,"name":"CRV"},{"id":7,"name":"HRV"},{"id":8,"name":"Jazz"}]},
  { id: 6,name: "Ford",  type:"car",
      models: [{"id":1,"name":"Ecosport"},{"id":2,"name":"Escape"},{"id":3,"name":"Everest"},{"id":4,"name":"Explorer"},{"id":5,"name":"F150"},{"id":6,"name":"Fiesta"},{"id":7,"name":"Focus"},{"id":8,"name":"Ranger"},{"id":9,"name":"Tourneo"},{"id":10,"name":"Transit"}]},
  { id: 7,name: "Mitsubishi",  type:"car",
      models: [{"id":1,"name":"Attrage"},{"id":2,"name":"Mirage"},{"id":3,"name":"Outlander"},{"id":4,"name":"Pajero"},{"id":5,"name":"Triton"},{"id":6,"name":"Xpander"}]},
  
  { id: 8,name: "Nissan",  type:"car",
      models: [{"id":1,"name":"Juke"},{"id":2,"name":"Livina"},{"id":3,"name":"Murano"},{"id":4,"name":"Navara"},{"id":5,"name":"Nismo"},{"id":6,"name":"Sunny"},{"id":7,"name":"Teana"},{"id":8,"name":"Terra"},{"id":9,"name":"Tida"},{"id":10,"name":"Urvan"},{"id":11,"name":"X-Trail"}]},
  { id: 9,name: "Suzuki",  type:"car",
      models: [{"id":1,"name":"Blind"},{"id":2,"name":"Carry"},{"id":3,"name":"CarryPro"},{"id":4,"name":"Celerio"},{"id":5,"name":"Ciaz"},{"id":6,"name":"Ertiga"},{"id":7,"name":"Swift"},{"id":8,"name":"Vitara"}]},
  { id: 10,name: "Subaru",  type:"car",
      models: [{"id":1,"name":"BRZ"},{"id":2,"name":"Forester"},{"id":3,"name":"Impreza"},{"id":4,"name":"Legacy"},{"id":5,"name":"Levorg"},{"id":6,"name":"Outback"},{"id":7,"name":"XV"},{"id":8,"name":"WXR"}]},
  { id: 11,name: "Chevrolet",  type:"car",
      models: [{"id":1,"name":"Aveo"},{"id":2,"name":"Captiva"},{"id":3,"name":"Colorado"},{"id":4,"name":"Cruze"},{"id":5,"name":"Orlando"},{"id":6,"name":"Spark"},{"id":7,"name":"Trailblazer"},{"id":8,"name":"Trax"}]},
  { id: 12,name: "Isuzu",  type:"car",
      models: [{"id":1,"name":"D-MAX"},{"id":2,"name":"MU-X"},{"id":3,"name":"Nseries"},{"id":4,"name":"Qseries"}]},
  { id: 13,name: "Daihatsu",  type:"car",
      models: [{"id":1,"name":"AYLA"},{"id":2,"name":"COPEN"},{"id":3,"name":"GRANMAX"},{"id":4,"name":"HIMAX"},{"id":5,"name":"SIGRA"},{"id":6,"name":"TERIOS"},{"id":7,"name":""}]},
  { id: 14,name: "Mercedes",  type:"car",
      models: [{"id":1,"name":"A200"},{"id":2,"name":"A250"},{"id":3,"name":"A45"},{"id":4,"name":"C200"},{"id":5,"name":"C300"},{"id":6,"name":"CLA200"},{"id":7,"name":"CLA250"},{"id":8,"name":"CLA45"},{"id":9,"name":"E200"},{"id":10,"name":"E250"},{"id":11,"name":"E350"},{"id":12,"name":""},{"id":13,"name":"GLA200"},{"id":14,"name":"GLA250"},{"id":15,"name":""},{"id":16,"name":"GLA45"},{"id":17,"name":"GLC200"},{"id":18,"name":"GLC250"},{"id":19,"name":"GLC300"},{"id":20,"name":"GLC43"}]},
  { id: 15,name: "VINFAST",  type:"car",
      models: [{"id":1,"name":"Fadil"},{"id":2,"name":"LuxA2.0"},{"id":3,"name":"LuxSA2.0"},{"id":4,"name":"LuxV8"}]},


  // Motorbike
  { id: 16,name: "Honda", type:"bike",
      models: [{"id":1,"name":"ADV"},{"id":2,"name":"AirBlade"},{"id":3,"name":"Beat"},{"id":4,"name":"Blade"},
      {"id":5,"name":"Dream"},{"id":6,"name":"Future"},{"id":7,"name":"Genio"},{"id":8,"name":"Lead"},
      {"id":9,"name":"Mokey"},{"id":10,"name":"MSX125"},{"id":11,"name":"PCX"},{"id":12,"name":"Rebel"},{"id":13,"name":"Sonic"},
      {"id":14,"name":"SHMode"},{"id":15,"name":"SH"},{"id":16,"name":"SuperCub"},{"id":17,"name":"Vario"},
      {"id":18,"name":"Vision"},{"id":19,"name":"Wave"},{"id":20,"name":"WinnerX"}]},
  { id: 17,name: "Yamaha", type:"bike",
      models: [{"id":1,"name":"Acruzo"},{"id":2,"name":"Exciter"},{"id":3,"name":"FreeGo"},{"id":4,"name":"FZ150i"},
      {"id":5,"name":"Janus"},{"id":6,"name":"Jupiter"},{"id":7,"name":"Lattte"},{"id":8,"name":"MT03"},{"id":9,"name":"NVX"},
      {"id":10,"name":"Grande"},{"id":11,"name":"R15"},{"id":12,"name":"R3"},{"id":13,"name":"Sirius"},{"id":14,"name":"TFX150"}]},
  { id: 18,name: "Suzuki", type:"bike",
      models: [{"id":1,"name":"Address"},{"id":2,"name":"Axelo"},{"id":3,"name":"GD110"},{"id":4,"name":"GSX150"},
      {"id":5,"name":"GSX-R150"},{"id":6,"name":"GSX-S150"},{"id":7,"name":"Impulse"},{"id":8,"name":"Raider"},
      {"id":9,"name":"Revo"},{"id":10,"name":"Satria"},{"id":11,"name":"SkyDrive"},{"id":12,"name":"Viva"},{"id":13,"name":"X-Bike"}]},
  { id: 19,name: "Piaggio", type:"bike",
      models: [{"id":1,"name":"Liberty"},{"id":2,"name":"Medley"},{"id":3,"name":" Zip"},{"id":4,"name":"Vespa"}]},
  { id: 20,name: "SYM", type:"bike",
      models: [{"id":1,"name":"Abela"},{"id":2,"name":"Amigo"},{"id":3,"name":"Angela"},{"id":4,"name":"AngelEz"},
      {"id":5,"name":"Attila"},{"id":6,"name":"Elegant"},{"id":7,"name":"Elite"},{"id":8,"name":"Elizabeth"},
      {"id":9,"name":"Joyride"},{"id":10,"name":"Fancy"},{"id":11,"name":"Galaxy"},{"id":12,"name":"Husky"},
      {"id":13,"name":"Passing"},{"id":14,"name":"Shark"},{"id":15,"name":"StarSR"},
      {"id":16,"name":"StarX"},{"id":17,"name":"Venus"},{"id":18,"name":"VF3i"}]},
]

const DATA_EXPENSE_TYPE = [
  {id: 1, name: "Tiền Phạt"},
  {id: 2, name: "Cầu Đường"},
  {id: 3, name: "Gửi Xe"},
  {id: 4, name: "Rửa Xe"}
]
const DATA_SERVICE_TYPE = [
  {id: 1, name: "Dầu Máy"}, // Dầu Máy
  {id: 2, name: "Dầu Phanh"}, // Lop Xe
  {id: 3, name: "Dầu Trợ Lực Lái"},// Sam Xe
  {id: 4, name: "Dầu Li Hơp"},//
  {id: 5, name: "Dầu Vi Sai"},
  {id: 6, name: "Dầu Hộp Số Thường"},
  {id: 7, name: "Dầu Hộp Số Tự Động"},
  {id: 8, name: "Dầu Hộp Số Phụ"},

  {id: 9, name: "Lọc Nhiên Liệu"},
  {id: 10, name: "Loc Dầu Máy"},
  {id: 11, name: "Lọc Điều Hòa"},
  {id: 12, name: "Lọc Gió Động Cơ"},

  {id: 13, name: "Gas Điều Hoà"},
  {id: 14, name: "Nước Làm Mát"},
  {id: 15, name: "Đường Ống Làm Mát"},

  {id: 16, name: "Phanh: Bàn Đạp"},
  {id: 17, name: "Phanh: Phanh Tay"},
  {id: 18, name: "Phanh: Trống, Guốc"},
  {id: 19, name: "Phanh: Ống Dẫn"},
  {id: 20, name: "Phanh: Đĩa, Má"},
  {id: 21, name: "Phanh: Tuyô"},

  {id: 22, name: "Lốp: Áp Suất"},
  {id: 23, name: "Lốp: Đảo Lốp"},

  {id: 24, name: "VôLăng, Dẫn Động"},
  {id: 25, name: "Đai Dẫn Động"},
  {id: 26, name: "Ống Xả & Giá Đỡ"},
  {id: 27, name: "Dây Curoa"},
  {id: 28, name: "Mỡ Trục CácĐăng"},
  {id: 29, name: "BuLông Trục CácĐăng"},
  {id: 30, name: "Cao Su Bán Trục"},
  {id: 31, name: "Khớp Cầu"},
  {id: 32, name: "Rotuyn"},

  {id: 33, name: "Đánh Lửa, Bugi"},
  {id: 34, name: "Ắc Quy"},
  {id: 35, name: "Xupap"},
  {id: 36, name: "Bộ Lọc Than Hoạt Tính"},
  {id: 37, name: "Bình Xăng & Ống Dẫn"},

  {id: 38, name: "Nước Rửa Kính"},
  {id: 39, name: "Vòi Nước Rửa Kính"},
  {id: 40, name: "Cơ Cấu Gạt Nước"},
  
  {id: 41, name: "Hệ thống Còi"},
  {id: 42, name: "Hệ thống Cửa & Cốp"},
  {id: 43, name: "Hệ thống Đèn"},
  {id: 44, name: "Đèn trên Đồng Hồ"},
  {id: 45, name: "Hệ thống Điện"},
  {id: 46, name: "Hệ thống Ghế"},
  {id: 47, name: "Hệ thống Đai an toàn"},
  {id: 48, name: "Hệ thống Kính, Gương"},
  {id: 49, name: "Hệ thống Treo"},
]

module.exports = {
  // Auth API
  getDataServiceTypes(req, res) {
    console.log("App getDataServiceTypes")
    if (true || req.user) {
      let services = {
        updatedOn: "2019-12-06",
        data: DATA_SERVICE_TYPE
      }
      res.status(200).send(services)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
  getDataExpenseTypes(req, res) {
    console.log("App getDataExpenseTypes")
    if (true || req.user) {
      let expenses = {
        updatedOn: "2019-12-06",
        data: DATA_EXPENSE_TYPE
      }
      res.status(200).send(expenses)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
  getDataVehicleModels(req, res) {
    console.log("App getDataVehicleModels")
    if (true || req.user) {
      let cars = {
        updatedOn: "2019-12-06",
        data: DATA_BRAND_MODEL
      }
      res.status(200).send(cars)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },


  getLatestDataDateOn(req, res) {
    console.log("App getLatestDataDateOn")
    if (true || req.user) {
      let latestData = {
        updatedOn: "2019-12-06",
      }
      res.status(200).send(latestData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
  getLatestAppData(req, res) {
    console.log("App getLatestAppData")
    if (true || req.user) {
      let appData = {
        updatedOn: "2019-12-06",
        vehicles: DATA_BRAND_MODEL,
        services: DATA_SERVICE_TYPE,
        expenses: DATA_EXPENSE_TYPE
      }
      res.status(200).send(appData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
};
