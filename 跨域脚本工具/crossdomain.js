/// <reference path="../lib/types.d.ts" />
var fs = require('fs');
var file = require('../lib/FileUtil');
var crossdomain = function(arg){
	trace('');
}

var count = 0;

crossdomain.prototype.doPath = function (path) {
	if(file.isDirectory(path)){
		var fileList =file.getDirectoryListing(path);
		for(var i = 0; i < fileList.length; i++){
			this.doPath(fileList[i]);
		}
	}else{
		var ext = file.getExtension(path).toLowerCase();
		var idx = path.lastIndexOf('resource');
		var relativePath = path.substr(idx) + '.js';

		newPath = path+'.js';
		if(ext == 'json' || ext == 'xml' || ext == 'txt' || ext == 'exml' || ext == 'fnt'){
			count++;
			var content = file.read(path, true);

			if(file.getFileName(path) == 'default.thm'){
				content = "CrossJsonP.localCallback('" + relativePath + "'," + content + ");";
			}else{
				var reg = new RegExp("\n", "g");
				content = content.replace(reg, '');
				reg = new RegExp("\r", "g");
				content = content.replace(reg, '');
				reg = new RegExp("'", "g");
				content = content.replace(reg, '"');
				content = "CrossJsonP.localCallback('" + relativePath + "','" + content + "');";
			}

			file.save(newPath, content);
			trace('NO.' + count + ' ' +file.getFileName(path) + '.' + file.getExtension(path) + '  done.');
		}else if(ext == 'png' || ext == 'jpg' || ext == 'jpeg'){
			count++;
			content = fs.readFileSync(path);
			var content = new Buffer(content, 'Binary').toString('Base64');

			content = 'data:image/' + ext + ';base64,' + content;
			
			content = "CrossJsonP.localCallback('" + relativePath + "','" + content + "');";

			file.save(newPath, content);
			trace('NO.' + count + ' ' +file.getFileName(path) + '.' + file.getExtension(path) + '  done.');
		}

		
	}
}


crossdomain.prototype.execute = function () {
	//当前目录
	var cmdPath = egret.args.projectDir;

	//resource目录
	var resourcePath = cmdPath + 'resource/';

	trace('Start Convert ...');

	//遍历目录下所有文件
	this.doPath(resourcePath);

	trace('Convert Complete!');
	
	return 0;
};

var trace = console.log;

module.exports = crossdomain;