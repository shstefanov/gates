var fs      = require("fs");
var path    = require("path");
var _       = require("underscore");
var cluster = require("cluster");
var helpers = require("./lib/helpers");






var argv = require('minimist')(process.argv.slice(2), {boolean: true});

if(cluster.isMaster){
  console.log("Master", argv);
  cluster.fork();
  cluster.fork();
}
else{
  console.log("Worker", argv);
}
