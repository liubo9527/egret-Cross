/**
 *
 * @author 
 *
 */
class Page0 extends eui.Component{

    public jsonTf: eui.Label;
    public txtTf: eui.Label;
    public xmlTf: eui.Label;
    
	public constructor() {
    	super(); 
        this.skinName = 'Page0Skin';
	}
	
    public init(): void {
        this.jsonTf.text = '来自json文件的数据:' + RES.getRes( 'test_json' ).nick;
        this.txtTf.text = '来自txt文件的数据:' + RES.getRes( 'test_txt' );
        
        this.xmlTf.text = '来自xml文件的数据:' + RES.getRes( 'test_xml' ).children[0].attributes.syntheticMaterial;
        
        /*** 本示例关键代码段开始 ***/
        var mcDataFactory = new egret.MovieClipDataFactory( RES.getRes( 'Dragon_json' ), RES.getRes('Dragon_png') );
        var role: egret.MovieClip = new egret.MovieClip( mcDataFactory.generateMovieClipData( "Dragon" ) );
        this.addChild( role );
        role.gotoAndPlay( 'walk', -1 );
        role.x = 320;
        role.y = 800;
        role.scaleX =  role.scaleY = 1.5;
	}
}
