import dbnotification from "../database/models/dbnotification";
import dbcustomervoice from "../database/models/dbcustomervoice";
import dbuser from "../database/models/dbuser";
import dbpwdrecovery from "../database/models/dbpwdrecovery";
import apputil from "../components/AppUtil";
import { date } from "joi";
require('dotenv').config()
const AWS = require('aws-sdk');
const ses = new AWS.SES()
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
var mailer = require("nodemailer");
var xoauth2 = require('xoauth2');
const ExtractJWT = passportJWT.ExtractJwt;


const NCOV_DATA = {
vietnam_province: [
    {
        date:"2020-02-02T05:00:00.007Z",
        provinces:[
            {
                name:"TP.HCM",
                case: 3,
                death: 0
            },{
                name:"Vĩnh Phúc",
                case: 2,
                death: 0
            },{
                name:"Thanh Hoá",
                case: 1,
                death: 0
            },{
                name:"Khánh Hoà",
                case: 1,
                death: 0
            }
        ]
    },
    {
        date:"2020-02-01T15:00:00.007Z",
        provinces:[
            {
                name:"Vĩnh Phúc",
                case: 2,
                death: 0
            },{
                name:"TP.HCM",
                case: 2,
                death: 0
            },{
                name:"Thanh Hoá",
                case: 1,
                death: 0
            },{
                name:"Khánh Hoà",
                case: 1,
                death: 0
            }
        ]
    }
],
china_province: [
    {
        date:"2020-02-01T15:00:00.007Z",
        provinces:[
            {
                name:"Hubei",
                case: 7153
            },{
                name:"Zhejiang",
                case: 599
            },{
                name:"Guangdong",
                case: 520
            },{
                name:"Henan",
                case: 422
            },{
                name:"Hunan",
                case: 389
            },{
                name:"Anhui",
                case: 297
            },{
                name:"Jiangxi",
                case: 286
            },{
                name:"Chongqing",
                case: 238
            },{
                name:"Sichuan",
                case: 207
            },{
                name:"Shandong",
                case: 202
            },{
                name:"Jiangsu",
                case: 202
            },{
                name:"Shanghai",
                case: 169
            },{
                name:"Beijing",
                case: 156
            },{
                name:"Fujian",
                case: 144
            },{
                name:"Shaanxi",
                case: 101
            },{
                name:"Guangxi",
                case: 100
            },{
                name:"Hebei",
                case: 96
            },{
                name:"Yunnan",
                case: 91
            },{
                name:"Heilongjiang",
                case: 80
            },{
                name:"Liaoning",
                case: 60
            },{
                name:"Hainan",
                case: 60
            },{
                name:"Shanxi",
                case: 47
            },{
                name:"Tianjin",
                case: 37
            },{
                name:"Gansu",
                case: 35
            },{
                name:"Guizhou",
                case: 29
            },{
                name:"Ningxia",
                case: 26
            },{
                name:"Inner Mongolia",
                case: 23
            },{
                name:"Xinjia",
                case: 18
            },{
                name:"Jilin",
                case: 17
            },{
                name:"Qinghai",
                case: 9
            },{
                name:"Xizang",
                case: 1
            }
        ]
      }
  ],
  data: [
    {
        date:"2020-02-02T05:00:00.007Z",
        world: {
            case: 14560,
            death: 305,
            risk:"High"
        },
        tranmission_rate_min: 3.0,
        tranmission_rate_max: 4.0,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 14381,
            death: 304,
            suspect: null,
            isolate: null,
            curve: null,
            risk:"Very High"
        },{
            name:"Japan",
            case: 20,
            death: 0,
        },{
            name:"Thailand",
            case: 19,
            death: 0,
        },{
            name:"Singapore",
            case: 18,
            death: 0,
        },{
            name:"South Korea",
            case: 15,
            death: 0,
        },{
            name:"Hong Kong",
            case: 14,
            death: 0,
        },{
            name:"Australia",
            case: 12,
            death: 0,
        },{
            name:"Taiwan",
            case: 10,
            death: 0,
        },{
            name:"Malaysia",
            case: 8,
            death: 0,
        },{
            name:"United States",
            case: 8,
            death: 0,
        },{
            name:"Germany",
            case: 8,
            death: 0,
        },{
            name:"Macao",
            case: 7,
            death: 0
        },{
            name:"France",
            case: 6,
            death: 0,
        },{
            name:"Vietnam",
            case: 7,
            death: 0,
            suspect: 92,
            isolate: 27,
        },{
            name:"UAE",
            case: 5,
            death: 0,
        },{
            name:"Canada",
            case: 4,
            death: 0,
        },{
            name:"United Kingdom",
            case: 2,
            death: 0,
        },{
            name:"Russia",
            case: 2,
            death: 0,
        },{
            name:"Italy",
            case: 2,
            death: 0,
        },{
            name:"Philippines",
            case: 2,
            death: 1,
        },{
            name:"India",
            case: 2,
            death: 0,
        },{
            name:"Cambodia",
            case: 1,
            death: 0,
        },{
            name:"Finland",
            case: 1,
            death: 0,
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0,
        },{
            name:"Spain",
            case: 1,
            death: 0,
        },{
            name:"Sweden",
            case: 1,
            death: 0,
        }
        ]
    },
    
    {
        date:"2020-02-01T15:00:00.007Z",
        world: {
            case: 11953,
            death: 259,
        },
        tranmission_rate_min: 3.0,
        tranmission_rate_max: 4.0,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 11791,
            death: 259,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 19,
            death: 0,
        },{
            name:"Japan",
            case: 17,
            death: 0,
        },{
            name:"Singapore",
            case: 16,
            death: 0,
        },{
            name:"Hong Kong",
            case: 13,
            death: 0,
        },{
            name:"Australia",
            case: 12,
            death: 0,
        },{
            name:"South Korea",
            case: 12,
            death: 0,
        },{
            name:"Taiwan",
            case: 10,
            death: 0,
        },{
            name:"Malaysia",
            case: 8,
            death: 0,
        },{
            name:"United States",
            case: 7,
            death: 0,
        },{
            name:"Germany",
            case: 7,
            death: 0,
        },{
            name:"Macao",
            case: 7,
            death: 0
        },{
            name:"France",
            case: 6,
            death: 0,
        },{
            name:"Vietnam",
            case: 6,
            death: 0,
            suspect: 153,
            isolate: 27,
        },{
            name:"UAE",
            case: 4,
            death: 0,
        },{
            name:"Canada",
            case: 4,
            death: 0,
        },{
            name:"United Kingdom",
            case: 2,
            death: 0,

        },{
            name:"Russia",
            case: 2,
            death: 0,

        },{
            name:"Italy",
            case: 2,
            death: 0,
        },{
            name:"Finland",
            case: 1,
            death: 0,
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0,
        },{
            name:"Philippines",
            case: 1,
            death: 0,
        },{
            name:"Nepal",
            case: 1,
            death: 0,
        },{
            name:"India",
            case: 1,
            death: 0,
        },{
            name:"Spain",
            case: 1,
            death: 0,
        },{
            name:"Sweden",
            case: 1,
            death: 0,
        }
        ]
    },{
        date:"2020-01-31",
        world: {
            case: 9826,
            death: 213,
        },
        tranmission_rate_min: 2.0,
        tranmission_rate_max: 3.1,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 9692,
            death: 213,
            suspect: 15238,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 3,
        },{
            name:"Singapore",
            case: 13,
            death: 2,
        },{
            name:"Japan",
            case: 14,
            death: 2,

        },{
            name:"South Korea",
            case: 11,
            death: 5,

        },{
            name:"Hong Kong",
            case: 12,
            death: 3,

        },{
            name:"Taiwan",
            case: 9,
            death: 6,

        },{
            name:"Macao",
            case: 7,
            death: 0,

        },{
            name:"Australia",
            case: 9,
            death: 5,

        },{
            name:"Malaysia",
            case: 8,
            death: 0,

        },{
            name:"France",
            case: 6,
            death: 0,

        },{
            name:"United States",
            case: 6,
            death: 0,

        },{
            name:"Germany",
            case: 5,
            death: 0,

        },{
            name:"Vietnam",
            case: 5,
            death: 0,
            suspect: 32,
            isolate: 97,
        },{
            name:"UAE",
            case: 4,
            death: 0,

        },{
            name:"Canada",
            case: 3,
            death: 0,

        },{
            name:"Italy",
            case: 2,
            death: 0,

        },{
            name:"Finland",
            case: 1,
            death: 0,

        },{
            name:"Sri Lanka",
            case: 1,
            death: 0,

        },{
            name:"Cambodia",
            case: 1,
            death: 0,

        },{
            name:"Philippines",
            case: 1,
            death: 0,

        },{
            name:"Nepal",
            case: 1,
            death: 0,

        },{
            name:"India",
            case: 1,
            death: 0,

        }
        ]
    },{
        date:"2020-01-30",
        world: {
            case: 7818,
            death: 170,
        },
        countries: [
        {
            name:"Mainland China",
            case: 7711,
            death: 170,
            suspect: 12167,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 11,
            death: 0
        },{
            name:"Taiwan",
            case: 8,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 10,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 10,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 7,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 5,
            death: 0
        },{
            name:"Malaysia",
            case: 7,
            death: 0
        },{
            name:"Canada",
            case: 3,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 4,
            death: 0
        },{
            name:"UAE",
            case: 4,
            death: 0
        },{
            name:"Philippines",
            case: 1,
            death: 0
        },{
            name:"India",
            case: 1,
            death: 0
        },{
            name:"Finland",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-29",
        world: {
            case: 6065,
            death: 132,
        },
        countries: [
        {
            name:"Mainland China",
            case: 5974,
            death: 132,
            suspect: 9239,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 7,
            death: 0
        },{
            name:"Taiwan",
            case: 8,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 7,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 7,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 4,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 3,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 4,
            death: 0
        },{
            name:"UAE",
            case: 4,
            death: 0
        }]
    },{
        date:"2020-01-28",
        world: {
            case: 4593,
            death: 106,
        },
        countries: [
        {
            name:"Mainland China",
            case: 4515,
            death: 106,
            suspect: 6973,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 6,
            death: 0
        },{
            name:"Taiwan",
            case: 7,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 7,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 5,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 2,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-27",
        world: {
            case: 2798,
            death: 80,
        },
        countries: [
        {
            name:"Mainland China",
            case: 2744,
            death: 80,
            suspect: 5794,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 5,
            death: 0
        },{
            name:"Japan",
            case: 4,
            death: 0
        },{
            name:"Taiwan",
            case: 4,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 5,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 4,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 4,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-26",
        world: {
            case: 2014,
            death: 56,
        },
        countries: [
        {
            name:"Mainland China",
            case: 1975,
            death: 56,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 5,
            death: 0
        },{
            name:"Japan",
            case: 3,
            death: 0
        },{
            name:"Taiwan",
            case: 3,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 5,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 2,
            death: 0
        },{
            name:"Singapore",
            case: 4,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 4,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 3,
            death: 0
        }]
    },{
        date:"2020-01-25",
        world: {
            case: 1320,
            death: 41,
        },
        countries: [
        {
            name:"Mainland China",
            case: 1287,
            death: 41,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 3,
            death: 0
        },{
            name:"Taiwan",
            case: 3,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 5,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 2,
            death: 0
        },{
            name:"Singapore",
            case: 3,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 3,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        }]
    },{
        date:"2020-01-24",
        world: {
            case: 846,
            death: 25,
        },
        countries: [
        {
            name:"Mainland China",
            case: 830,
            death: 25,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 2,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 1,
            death: 0
        },{
            name:"Singapore",
            case: 1,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        }]
    },{
        date:"2020-01-23",
        world: {
            case: 581,
            death: 17,
        },
        countries: [
        {
            name:"Mainland China",
            case: 571,
            death: 17,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 1,
            death: 0
        },{
            name:"Hong Kong",
            case: 1,
            death: 0
        },{
            name:"Macau",
            case: 1,
            death: 0
        },{
            name:"United States",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-22",
        world: {
            case: 314,
            death: 6,
        },
        countries: [
        {
            name:"Mainland China",
            case: 309,
            death: 6,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 2,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-21",
        world: {
            case: 282,
            death: 6,
        },
        countries: [
        {
            name:"Mainland China",
            case: 278,
            death: 6,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 2,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 1,
            death: 0
        }]
    }
  ]
}

module.exports = {
  // Modify Date of this
  getLatestCoronaDateOn(req, res) {
    apputil.CONSOLE_LOG("App getLatestCoronaDateOn")
    if (true || req.user) {
      let latestData = {
        updatedOn: "2020-02-02T05:00:00.017Z",
      }
      res.status(200).send(latestData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
  // Modify Date of this
  getLatestCoronaData(req, res) {
    apputil.CONSOLE_LOG("App getLatestAppData")
    if (true || req.user) {
      let appData = {
        nCoV: NCOV_DATA
      }
      res.status(200).send(appData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
};
