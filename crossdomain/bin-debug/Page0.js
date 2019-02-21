var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *
 * @author
 *
 */
var Page0 = (function (_super) {
    __extends(Page0, _super);
    function Page0() {
        var _this = _super.call(this) || this;
        _this.skinName = 'Page0Skin';
        return _this;
    }
    Page0.prototype.init = function () {
        this.jsonTf.text = '来自json文件的数据:' + RES.getRes('test_json').nick;
        this.txtTf.text = '来自txt文件的数据:' + RES.getRes('test_txt');
        this.xmlTf.text = '来自xml文件的数据:' + RES.getRes('test_xml').children[0].attributes.syntheticMaterial;
        /*** 本示例关键代码段开始 ***/
        var mcDataFactory = new egret.MovieClipDataFactory(RES.getRes('Dragon_json'), RES.getRes('Dragon_png'));
        var role = new egret.MovieClip(mcDataFactory.generateMovieClipData("Dragon"));
        this.addChild(role);
        role.gotoAndPlay('walk', -1);
        role.x = 320;
        role.y = 800;
        role.scaleX = role.scaleY = 1.5;
    };
    return Page0;
}(eui.Component));
__reflect(Page0.prototype, "Page0");
