/// <reference path="../lib/types.d.ts" />
var FS = require('fs');
var file = require('../lib/FileUtil');
var childProcess = require("child_process");
var resGroup = function(arg){
	trace('');
}

/*
"groups": [
		{
			"keys": "p1_1_png,p1_2_png,p1_3_png,p1_bg_jpg",
			"name": "p1"
		},
		{
			"keys": "p3_1_png,p3_2_png,p3_3_png,p3_4_png,p3_5_png,p3_6_png",
			"name": "p3"
		}]
*/
resGroup.prototype.execute = function () {
	//当前目录
	var cmdPath = egret.args.projectDir;

	var mergeOtherLibs = true;

	var arr = file.getDirectoryListing(cmdPath);

	var resArr = [];

	for(var i = 0 ;i < arr.length; i++){
		var key = arr[i].substr(cmdPath.length);
		var res = '{"name": "'+key+'", "keys":'; 

		var list = file.getDirectoryListing(arr[i], true);
		var tmpArr = [];
		for(var j = 0; j < list.length; j++){
			var sourceName = list[j];
			sourceName = sourceName.replace('.', '_');//只换一次.为_, 命名不规范的就有BUG
			tmpArr.push(sourceName);
		}

		res+= '"' + tmpArr.join(',') + '"';
		res += '}';
		
		resArr.push(res);
	}

	var rs = resArr.join(',');
	trace(rs);
	childProcess.execSync('echo ' + rs + ' | clip', {}, function(err,stdout,stderr){
	});

	return 0;
};

var trace = console.log;

module.exports = resGroup;