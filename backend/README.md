# Commands

DB
	mongoexport --db=vehiclecmsdev  --collection=dbteams  --out=dbteams.json
	mongoexport --db=vehiclecmsdev  --collection=dbjointeams  --out=dbjointeams.json
	mongoexport --db=vehiclecmsdev  --collection=dbusers  --out=dbusers.json

	mongoimport --db=vehiclecmsdev --collection=dbteams --type=json --file=dbteams.json
	mongoimport --db=vehiclecmsdev --collection=dbjointeams --type=json --file=dbjointeams.json
	mongoimport --db=vehiclecmsdev --collection=dbusers --type=json --file=dbusers.json
    
# eCMS
Idea:
  Track Don Hang, Shipper will Report Status
  Give Point to User

TODO
1. THem Unit Name to Product (so in Cart, User easy to see quantity)
2. Add Order Position for Menu


# DB Tables:

// brandModelCar:[{ id: 1,name: "Toyota",models:[{id:1, name: "Vios"}]}]
// brandModelBike:{}
// expenseTypes: []
// serviceTypes: []
// defaultVehicleSetting: {userId,kmForOilCar,kmForOilBike,monthAuthoBeyond9To7Year...}

// customVehicleSetting: {userId,vehicleId,kmForOilCar,kmForOilBike,monthAuthoBeyond9To7Year...}

// vehicleList: 
    //{userId, brand: "K",model:"C",licensePlate:"18M1",checkedDate:"01/14/2019",id:3,type:"car|bike", isDefault, remark}
// fillGasList: 
    //{userId, vehicleId: 2, fillDate: "10/14/2019,11:30:14 PM",amount:2,price:100000,currentKm: 123344,id: 1,type(gas|oil),subType(not used), remark}
// fillOilList: 
    //{userId, vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1,type(gas|oil),subType(not used), remark}
// AuthorizeList:
    //{userId, vehiceId, fillDate, price, amount(not used), currentKm, id, type(auth), subType(not used), remark}
// Expense (Fine, Route, CarWash, Parking)
    //{userId, vehicleId, fillDate, price, amount(not used), currentKm, type(expense), subType (expenseType), remark}
// Service (bao tri: ...)
    //{userId, vehicleId, fillDate, price, amount(not used), currentKm, type(service), subType (serviceType), remark}
