class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.once( egret.Event.ADDED_TO_STAGE, this.__addedHandler, this );
    }
    

    private __addedHandler( e: egret.Event ): void {
        if ( !egret.Capabilities.isMobile ) {
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
            this.stage.orientation = egret.OrientationMode.AUTO;
        }
 
        this.stage.registerImplementation( "eui.IAssetAdapter", new AssetAdapter() );
        var vc: RES.VersionController = new RES.VersionController();

        vc.getVirtualUrl = function ( url: string ): string {
            return url + '?v=' + '0.0.1';
        }
        
        RES.registerVersionController( vc );
        
        //绕开egret同域策略的关键代码，只建议在release后，设置needCross = true，以便跨域生效
        if(window && window['needCross']){
            startCross(this.stage, true, window['resourcePath']); 
        }
        this.startLoadSource();
    }

    private startLoadSource(): void {
        var th: eui.Theme = new eui.Theme( "resource/default.thm.json", this.stage );

        th.once( egret.Event.COMPLETE, ( e ) => {
            RES.addEventListener( RES.ResourceEvent.CONFIG_COMPLETE, ( e ) => {
                RES.loadGroup( "all" ); 
            }, this );

            RES.addEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.sourceLoadOk, this );

            RES.loadConfig( "resource/default.res.json", "resource/" );

        }, this );
    }

    private sourceLoadOk( e: any ): void {
        var page:Page0 = new Page0();
        page.init();

        console.log('init');

        this.addChild(page);
    }

}