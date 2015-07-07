/// <reference path="../typings/node/node.d.ts"/>
/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 8001;


console.log('Starting node...');
console.log('PORT=' + port);

app.use(express.static('./tmp/'));

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('__dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
});
