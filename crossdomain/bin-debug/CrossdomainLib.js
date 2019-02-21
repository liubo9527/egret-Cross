var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 绕开egret同域策略 api
 * @author nofastfat
 * @QQ 1470351730，德玛西亚万岁！！！
 */
var $mCrossImage = false;
var $mResourcePath = '';
/**
 * @param stage
 * @param crossImage 是否开启跨域图片，注意，跨域图片可能有性能和带宽损耗。默认不开启
 * 注意：
 *  1.使用跨域需要使用AssetAdapter，使用官方或者自写均可 否则exml的图片可能无法显示
 *  2.default.res.json不要出现gif，这玩意会有BUG
 *
 */
function startCross(stage, crossImage, resourcePath) {
    stage.registerImplementation('eui.IThemeAdapter', new CrossThemeAdapter());
    RES.registerAnalyzer(RES.ResourceItem.TYPE_XML, CrossJsonpXMLAnalyzer);
    RES.registerAnalyzer(RES.ResourceItem.TYPE_TEXT, CrossJsonpTextAnalyzer);
    RES.registerAnalyzer(RES.ResourceItem.TYPE_JSON, CrossJsonpJsonAnalyzer);
    RES.registerAnalyzer(RES.ResourceItem.TYPE_FONT, CrossJsonpFontAnalyzer);
    RES.registerAnalyzer(RES.ResourceItem.TYPE_SHEET, CrossJsonpSheetAnalyzer);
    $mCrossImage = crossImage;
    $mResourcePath = resourcePath || '';
    if (crossImage) {
        RES.registerAnalyzer(RES.ResourceItem.TYPE_IMAGE, CrossJsonpImageAnalyzer);
    }
}
var CrossThemeAdapter = (function () {
    function CrossThemeAdapter() {
    }
    CrossThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
        var url = RES.getVersionController().getVirtualUrl(url + '.js');
        CrossJsonP.sendLocal(url, function (url, data) {
            compFunc.apply(thisObject, [JSON.stringify(data)]);
        }, this);
    };
    return CrossThemeAdapter;
}());
__reflect(CrossThemeAdapter.prototype, "CrossThemeAdapter", ["eui.IThemeAdapter"]);
var CrossJsonP = (function () {
    function CrossJsonP() {
    }
    CrossJsonP.sendLocal = function (url, callback, callobj) {
        CrossJsonP.mLocalCall[url] = [callback, callobj];
        var script = document.createElement('script');
        script.src = $mResourcePath + url;
        document.body.appendChild(script);
    };
    CrossJsonP.localCallback = function (url, data) {
        url = RES.getVersionController().getVirtualUrl(url);
        if (CrossJsonP.mLocalCall[url]) {
            CrossJsonP.mLocalCall[url][0].apply(CrossJsonP.mLocalCall[url][1], [url, data]);
        }
        else {
            console.log(url);
            console.log(JSON.stringify(CrossJsonP.mLocalCall));
            console.log('jsonp error:no call back of' + url);
        }
    };
    return CrossJsonP;
}());
CrossJsonP.mLocalCall = {};
__reflect(CrossJsonP.prototype, "CrossJsonP");
var CrossJsonpXMLAnalyzer = (function (_super) {
    __extends(CrossJsonpXMLAnalyzer, _super);
    function CrossJsonpXMLAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        return _this;
    }
    CrossJsonpXMLAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    CrossJsonpXMLAnalyzer.prototype.onLoadOk = function (url, txt) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if (resItem.loaded) {
            this.analyzeData(resItem, txt);
        }
        if (compFunc) {
            compFunc.call(data.thisObject, resItem);
        }
    };
    ;
    return CrossJsonpXMLAnalyzer;
}(RES.XMLAnalyzer));
__reflect(CrossJsonpXMLAnalyzer.prototype, "CrossJsonpXMLAnalyzer");
var CrossJsonpTextAnalyzer = (function (_super) {
    __extends(CrossJsonpTextAnalyzer, _super);
    function CrossJsonpTextAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        return _this;
    }
    CrossJsonpTextAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    CrossJsonpTextAnalyzer.prototype.onLoadOk = function (url, txt) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if (resItem.loaded) {
            this.analyzeData(resItem, txt);
        }
        if (compFunc) {
            compFunc.call(data.thisObject, resItem);
        }
    };
    ;
    return CrossJsonpTextAnalyzer;
}(RES.TextAnalyzer));
__reflect(CrossJsonpTextAnalyzer.prototype, "CrossJsonpTextAnalyzer");
var CrossJsonpJsonAnalyzer = (function (_super) {
    __extends(CrossJsonpJsonAnalyzer, _super);
    function CrossJsonpJsonAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        return _this;
    }
    CrossJsonpJsonAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    CrossJsonpJsonAnalyzer.prototype.onLoadOk = function (url, txt) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if (resItem.loaded) {
            this.analyzeData(resItem, txt);
        }
        if (compFunc) {
            compFunc.call(data.thisObject, resItem);
        }
    };
    ;
    return CrossJsonpJsonAnalyzer;
}(RES.JsonAnalyzer));
__reflect(CrossJsonpJsonAnalyzer.prototype, "CrossJsonpJsonAnalyzer");
var CrossJsonpFontAnalyzer = (function (_super) {
    __extends(CrossJsonpFontAnalyzer, _super);
    function CrossJsonpFontAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        _this.mRecyclerIamge = [];
        return _this;
    }
    CrossJsonpFontAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    CrossJsonpFontAnalyzer.prototype.onLoadOk = function (url, txt) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if (resItem.loaded) {
            resItem.loaded = false;
            var imageUrl = this.analyzeConfig(resItem, txt);
            if (imageUrl) {
                if ($mCrossImage) {
                    this.loadImgJson(imageUrl, resItem, compFunc, data.thisObject);
                }
                else {
                    var request = this.mloadImage(imageUrl, data);
                    this.resItemDic[request.hashCode] = data;
                }
                return;
            }
        }
        if (resItem.loaded) {
            if (compFunc) {
                compFunc.call(data.thisObject, resItem);
            }
        }
    };
    ;
    /**
     * @inheritDoc
     */
    CrossJsonpFontAnalyzer.prototype.loadImgJson = function (imageUrl, resItem, compFunc, thisObject) {
        var url = RES.getVersionController().getVirtualUrl(imageUrl + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onImgJsonLoadOk, this);
    };
    ;
    CrossJsonpFontAnalyzer.prototype.onImgJsonLoadOk = function (url, base64) {
        var img = document.createElement('img');
        img.src = base64;
        var self = this;
        img.onload = function (e) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url];
            var resItem = data.item;
            var compFunc = data.func;
            resItem.loaded = true;
            var texture2 = new egret.Texture();
            // texture2._setBitmapData( img as any );
            texture2.bitmapData = new egret.BitmapData(img);
            self.analyzeBitmap(resItem, texture2);
            compFunc.call(data.thisObject, resItem);
        };
    };
    ;
    CrossJsonpFontAnalyzer.prototype.onMLoad = function (e) {
        var request = e.target;
        var data = this.resItemDic[request.hashCode];
        delete this.resItemDic[request.hashCode];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = (e.type == egret.Event.COMPLETE);
        if (resItem.loaded) {
            var texture = new egret.Texture();
            // texture._setBitmapData(request.data);
            texture.bitmapData = new egret.BitmapData(request.data);
            this.analyzeBitmap(resItem, texture);
        }
        this.mRecyclerIamge.push(request);
        if (resItem.loaded) {
            compFunc.call(data.thisObject, resItem);
        }
    };
    CrossJsonpFontAnalyzer.prototype.mloadImage = function (url, data) {
        var loader = this.mGetImageLoader();
        this.resItemDic[loader.hashCode] = data;
        loader.load(RES.getVersionController().getVirtualUrl(url));
        return loader;
    };
    ;
    CrossJsonpFontAnalyzer.prototype.mGetImageLoader = function () {
        var loader = this.mRecyclerIamge.pop();
        if (!loader) {
            loader = new egret.ImageLoader();
            loader.addEventListener(egret.Event.COMPLETE, this.onMLoad, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onMLoad, this);
        }
        return loader;
    };
    ;
    return CrossJsonpFontAnalyzer;
}(RES.FontAnalyzer));
__reflect(CrossJsonpFontAnalyzer.prototype, "CrossJsonpFontAnalyzer");
var CrossJsonpSheetAnalyzer = (function (_super) {
    __extends(CrossJsonpSheetAnalyzer, _super);
    function CrossJsonpSheetAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        _this.mRecyclerIamge = [];
        return _this;
    }
    CrossJsonpSheetAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    CrossJsonpSheetAnalyzer.prototype.onLoadOk = function (url, txt) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if (resItem.loaded) {
            resItem.loaded = false;
            var imageUrl = this.analyzeConfig(resItem, txt);
            if (imageUrl) {
                if ($mCrossImage) {
                    this.loadImgJson(imageUrl, resItem, compFunc, data.thisObject);
                }
                else {
                    var request = this.mloadImage(imageUrl, data);
                    this.resItemDic[request.hashCode] = data;
                }
                return;
            }
        }
        if (resItem.loaded) {
            if (compFunc) {
                compFunc.call(data.thisObject, resItem);
            }
        }
    };
    ;
    /**
     * @inheritDoc
     */
    CrossJsonpSheetAnalyzer.prototype.loadImgJson = function (imageUrl, resItem, compFunc, thisObject) {
        var url = RES.getVersionController().getVirtualUrl(imageUrl + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onImgJsonLoadOk, this);
    };
    ;
    CrossJsonpSheetAnalyzer.prototype.onImgJsonLoadOk = function (url, base64) {
        var img = document.createElement('img');
        img.src = base64;
        var self = this;
        img.onload = function (e) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url];
            var resItem = data.item;
            var compFunc = data.func;
            resItem.loaded = true;
            var texture2 = new egret.Texture();
            // texture2._setBitmapData( img  as any);
            texture2.bitmapData = new egret.BitmapData(img);
            self.analyzeBitmap(resItem, texture2);
            compFunc.call(data.thisObject, resItem);
        };
    };
    ;
    CrossJsonpSheetAnalyzer.prototype.onMLoad = function (e) {
        var request = e.target;
        var data = this.resItemDic[request.hashCode];
        delete this.resItemDic[request.hashCode];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = (e.type == egret.Event.COMPLETE);
        if (resItem.loaded) {
            var texture = new egret.Texture();
            // texture._setBitmapData( request.data );
            texture.bitmapData = new egret.BitmapData(request.data);
            this.analyzeBitmap(resItem, texture);
        }
        this.mRecyclerIamge.push(request);
        if (resItem.loaded) {
            compFunc.call(data.thisObject, resItem);
        }
    };
    CrossJsonpSheetAnalyzer.prototype.mloadImage = function (url, data) {
        var loader = this.mGetImageLoader();
        this.resItemDic[loader.hashCode] = data;
        loader.load(RES.getVersionController().getVirtualUrl(url));
        return loader;
    };
    ;
    CrossJsonpSheetAnalyzer.prototype.mGetImageLoader = function () {
        var loader = this.mRecyclerIamge.pop();
        if (!loader) {
            loader = new egret.ImageLoader();
            loader.addEventListener(egret.Event.COMPLETE, this.onMLoad, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onMLoad, this);
        }
        return loader;
    };
    ;
    return CrossJsonpSheetAnalyzer;
}(RES.SheetAnalyzer));
__reflect(CrossJsonpSheetAnalyzer.prototype, "CrossJsonpSheetAnalyzer");
var CrossJsonpImageAnalyzer = (function (_super) {
    __extends(CrossJsonpImageAnalyzer, _super);
    function CrossJsonpImageAnalyzer() {
        var _this = _super.call(this) || this;
        _this.mUrls = {};
        return _this;
    }
    /**
     * @inheritDoc
     */
    CrossJsonpImageAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }
        var url = RES.getVersionController().getVirtualUrl(resItem.url + '.js');
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };
        ;
        CrossJsonP.sendLocal(url, this.onLoadOk, this);
    };
    ;
    CrossJsonpImageAnalyzer.prototype.onLoadOk = function (url, base64) {
        var img = document.createElement('img');
        img.src = base64;
        var self = this;
        img.onload = function (e) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url];
            var resItem = data.item;
            var compFunc = data.func;
            resItem.loaded = true;
            var texture2 = new egret.Texture();
            texture2.bitmapData = new egret.BitmapData(img);
            // texture2._setBitmapData( img  as any);
            self.analyzeData(resItem, texture2);
            compFunc.call(data.thisObject, resItem);
        };
    };
    ;
    return CrossJsonpImageAnalyzer;
}(RES.ImageAnalyzer));
__reflect(CrossJsonpImageAnalyzer.prototype, "CrossJsonpImageAnalyzer");
