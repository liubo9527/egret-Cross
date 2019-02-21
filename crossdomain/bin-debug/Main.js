var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.__addedHandler, _this);
        return _this;
    }
    Main.prototype.__addedHandler = function (e) {
        if (!egret.Capabilities.isMobile) {
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
            this.stage.orientation = egret.OrientationMode.AUTO;
        }
        this.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        var vc = new RES.VersionController();
        vc.getVirtualUrl = function (url) {
            return url + '?v=' + '0.0.1';
        };
        RES.registerVersionController(vc);
        //绕开egret同域策略的关键代码，只建议在release后，设置needCross = true，以便跨域生效
        if (window && window['needCross']) {
            startCross(this.stage, true, window['resourcePath']);
        }
        this.startLoadSource();
    };
    Main.prototype.startLoadSource = function () {
        var _this = this;
        var th = new eui.Theme("resource/default.thm.json", this.stage);
        th.once(egret.Event.COMPLETE, function (e) {
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, function (e) {
                RES.loadGroup("all");
            }, _this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.sourceLoadOk, _this);
            RES.loadConfig("resource/default.res.json", "resource/");
        }, this);
    };
    Main.prototype.sourceLoadOk = function (e) {
        var page = new Page0();
        page.init();
        console.log('init');
        this.addChild(page);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
