'use strict';

const response = require('../config/res');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.setHeader("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Accept, Host, Authorization');
    next();
});

exports.index = function(req,res) {
    response.ok("Hello from the Node JS RESTful side!", res);
};

exports.daftarFileTest = function(req,res) {
    //var resListFile = require('./component-drive-list.js');
    //response.ok(resListFile,res);

    //var fooMod = require('./test.js').then(promiseResult => response.ok(promiseResult,res));
    //var resTest = require('./test.js');
    //response.ok(resTest,res);

    // var read = require('./test.js');
    // read.files().then(function(resTest) {
    //     response.ok(resTest,res);
    // });

    var resListFileTest = require('./component-drive-list-test.js');
    // resListFile.files().then(function(resTest) {
    //    response.ok(resTest,res);
    // });
    response.ok(resListFileTest,res);
}

exports.daftarUser = function(req,res) {
    var resListUser = require('./component-user-list.js');
    response.ok(resListUser,res);
    //resListUser.users().then(function(resUserTest) {
    //   response.ok(resUserTest,res);
    //});
    //response.ok(resListUser,res);
}

exports.FileList = function(req,res) {
    var resListFile = require('./component-drive-list.js');
    resListFile.files().then(function(resDriveTest) {
        response.ok(resDriveTest,res);
     });
    //response.ok(resListFileA,res);
}

exports.PermissionList = function(req,res) {
    var resPermissionFile = require('./component-drive-permission.js');
    resPermissionFile.permission().then(function(resDriveTest) {
        response.ok(resDriveTest,res);
     });
    //response.ok(resListFileA,res);
}

exports.testcall = function(req,res) {
    var resListTest = require('./test.js');
    resListTest.files().then(function(resTest) {
        response.ok(resTest,res);
     });
    //response.ok(resListFileA,res);
}
