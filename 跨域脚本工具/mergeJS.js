/// <reference path="../lib/types.d.ts" />
var FS = require('fs');
var file = require('../lib/FileUtil');
var mergeJS = function(arg){
	trace('');
}

mergeJS.prototype.execute = function () {
	//��ǰĿ¼
	var cmdPath = egret.args.projectDir;

	var mergeOtherLibs = true;

	//��index.html����ص�js�⣬main.min.js������
	var indexHtml = cmdPath + "index.html";
	if(!file.exists(indexHtml)){
		trace('�Ҳ���index.html -_-#');
		return 0;
	}
	
	//index.html������
	var indexCode = file.read(indexHtml, true);
	var key = '<script egret="lib" src="';//���ҹؼ���
	var key2 = '"></script>';
	var key3 = '<!--other_libs_files_start-->';
	var key4 = '<!--other_libs_files_end-->';

	var arr = indexCode.split(key);
	
	//�ҵ����е�js�ļ�
	var jsFiles = [];
	for(var i = 1; i < arr.length; i++){
		var jsFile = arr[i];
		var key2Index = jsFile.indexOf(key2);
		if(key2Index != -1){
			jsFile = jsFile.substr(0, key2Index);

			if(!file.exists(cmdPath + jsFile)){
				trace('�Ҳ��� '+jsFile+' -_-#');
				return 0;
			}
			jsFiles.push(jsFile);
		}
	}

	if(mergeOtherLibs){
		var key3Index = indexCode.indexOf(key3);
		var key4Index = indexCode.indexOf(key4);

		if(key3Index == -1 || key4Index == -1){
			trace('û���ҵ� other_libs_files ��ʶ�����Ժϲ�');
		}else{
			var otherLibsCode = indexCode.substring(key3Index +key3.length , key4Index);
			var reg = new RegExp(' ', 'g');
			otherLibsCode = otherLibsCode.replace(reg, '');
			reg = new RegExp('\t', 'g');
			otherLibsCode = otherLibsCode.replace(reg, '');
			reg = new RegExp('"', 'g');
			otherLibsCode = otherLibsCode.replace(reg, '');
			reg = new RegExp("'", 'g');
			otherLibsCode = otherLibsCode.replace(reg, '');
			reg = new RegExp("/>", 'g');
			otherLibsCode = otherLibsCode.replace(reg, '>');

			var key5 = 'src=';
			var key6 = '.js>';

			var tmpArr = otherLibsCode.split(key5);

			for(var i = 0; i < tmpArr.length; i++){
				var key6Index = tmpArr[i].indexOf(key6);

				if(key6Index != -1){
					jsFiles.push(tmpArr[i].substr(0, key6Index) + ".js");
				}
			}
		}
	}

	if(jsFiles <= 1){
		trace('һ��'+jsFiles.length+' ��JS�ļ�������ϲ�');
		return 0;
	}

	trace('Ԥ�ƿ��Ժϲ� '+jsFiles.length+' ��JS�ļ�');
	trace('��ʼ����...');

	
	var mergeedJS = '';

	for(var i=0;i < jsFiles.length; i++){
		var jsCode = file.read(cmdPath + jsFiles[i], true);

		mergeedJS += '\n //' + jsFiles[i]+ '\n' + jsCode + '\n'; 
	}

	file.save(cmdPath+'merged.js', mergeedJS);
	
	//ͷβ��index.html����
	var indexHtmlPre = arr[0] + key;
	var indexHtmlEnd = arr[arr.length-1];
	indexHtmlEnd = indexHtmlEnd.substr(indexHtmlEnd.indexOf(key2));

	
	var newHtml = indexHtmlPre + 'merged.js' + indexHtmlEnd;

	if(mergeOtherLibs){
		var key3Index = newHtml.indexOf(key3);
		var key4Index = newHtml.indexOf(key4);
		var ctx = newHtml.substring(key3Index + key3.length, key4Index);
		newHtml = newHtml.replace(ctx, '');
	}

	file.save(cmdPath+'index_merged.html', newHtml);

	trace('�ϲ��ɹ�@@@@@');
	return 0;
};

var trace = console.log;

module.exports = mergeJS;