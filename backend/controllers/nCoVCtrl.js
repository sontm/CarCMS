import dbnotification from "../database/models/dbnotification";
import dbcustomervoice from "../database/models/dbcustomervoice";
import dbuser from "../database/models/dbuser";
import dbpwdrecovery from "../database/models/dbpwdrecovery";
import apputil from "../components/AppUtil";
import { date } from "joi";

import NcovWorld from "../utils/NcovWorld";
import NcovWorld2 from "../utils/NcovWorld2";
import NcovChina from "../utils/NcovChina";

require('dotenv').config()
const AWS = require('aws-sdk');
const ses = new AWS.SES()
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
var mailer = require("nodemailer");
var xoauth2 = require('xoauth2');
const ExtractJWT = passportJWT.ExtractJwt;

const NCOV_DATA = { 
    vietnam_province:[ 
        { 
            "date":"2020-02-06T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"Vĩnh Phúc",
                    "case":7,
                    "death":0
                },
                { 
                    "name":"TP.HCM",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        },
        { 
            "date":"2020-02-05T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"TP.HCM",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Vĩnh Phúc",
                    "case":5,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        },
        { 
            "date":"2020-02-04T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"TP.HCM",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Vĩnh Phúc",
                    "case":5,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        },
        { 
            "date":"2020-02-03T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"TP.HCM",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Vĩnh Phúc",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        },
        { 
            "date":"2020-02-02T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"TP.HCM",
                    "case":3,
                    "death":0
                },
                { 
                    "name":"Vĩnh Phúc",
                    "case":2,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        },
        { 
            "date":"2020-02-01T15:00:00.007Z",
            "provinces":[ 
                { 
                    "name":"Vĩnh Phúc",
                    "case":2,
                    "death":0
                },
                { 
                    "name":"TP.HCM",
                    "case":2,
                    "death":0
                },
                { 
                    "name":"Thanh Hoá",
                    "case":1,
                    "death":0
                },
                { 
                    "name":"Khánh Hoà",
                    "case":1,
                    "death":0
                }
            ]
        }
    ]
}

module.exports = {
  // Modify Date of this
  getLatestCoronaDateOn(req, res) {
    //apputil.CONSOLE_LOG("App getLatestCoronaDateOn")
    if (true || req.user) {
      let latestData = {
        updatedOn: "2020-02-06T15:00:00.007Z",
      }
      res.status(200).send(latestData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
  // Modify Date of this
  getLatestCoronaData(req, res) {
    //apputil.CONSOLE_LOG("App getLatestAppData")
    if (true || req.user) {
      let appData = {
        nCoV: {
            vietnam_province: NCOV_DATA.vietnam_province,
            china_province: NcovChina.china_province,
            data: NcovWorld2.data.concat(NcovWorld.data)
        }
      }
      res.status(200).send(appData)
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
};
