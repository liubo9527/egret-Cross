/**
 * 绕开egret同域策略 api
 * @author nofastfat
 * @QQ 1470351730，德玛西亚万岁！！！
 */ 
var $mCrossImage:boolean = false;
var $mResourcePath:string = '';

/**
 * @param stage 
 * @param crossImage 是否开启跨域图片，注意，跨域图片可能有性能和带宽损耗。默认不开启
 * 注意：
 *  1.使用跨域需要使用AssetAdapter，使用官方或者自写均可 否则exml的图片可能无法显示
 *  2.default.res.json不要出现gif，这玩意会有BUG
 * 
 */ 
function startCross(stage:egret.Stage, crossImage?:boolean, resourcePath?:string):void{ 
    stage.registerImplementation( 'eui.IThemeAdapter', new CrossThemeAdapter() ); 

    RES.registerAnalyzer( RES.ResourceItem.TYPE_XML, CrossJsonpXMLAnalyzer );
    RES.registerAnalyzer( RES.ResourceItem.TYPE_TEXT, CrossJsonpTextAnalyzer );
    RES.registerAnalyzer( RES.ResourceItem.TYPE_JSON, CrossJsonpJsonAnalyzer );
    RES.registerAnalyzer( RES.ResourceItem.TYPE_FONT, CrossJsonpFontAnalyzer );
    RES.registerAnalyzer( RES.ResourceItem.TYPE_SHEET, CrossJsonpSheetAnalyzer );
    $mCrossImage = crossImage;
    $mResourcePath = resourcePath || '';
    if ( crossImage){
        RES.registerAnalyzer( RES.ResourceItem.TYPE_IMAGE, CrossJsonpImageAnalyzer);
    }
}

class CrossThemeAdapter implements eui.IThemeAdapter {
    public constructor() {
    }

    public getTheme( url: string, compFunc: Function, errorFunc: Function, thisObject: any ): void {
        var url: string = RES.getVersionController().getVirtualUrl( url + '.js' );
        CrossJsonP.sendLocal( url, ( url: string, data: any ) => {
            compFunc.apply( thisObject, [JSON.stringify( data )] );
        }, this );
    }
}


class CrossJsonP {
    
    private static mLocalCall: any = {};

    public static sendLocal( url: string, callback: Function, callobj: any ): void {
        CrossJsonP.mLocalCall[url] = [callback, callobj];
        var script = document.createElement( 'script' );
        script.src = $mResourcePath + url;
        document.body.appendChild( script );
    }

    public static localCallback( url: string, data: string ): void {
        url = RES.getVersionController().getVirtualUrl( url );

        if ( CrossJsonP.mLocalCall[url] ) {
            CrossJsonP.mLocalCall[url][0].apply( CrossJsonP.mLocalCall[url][1], [url, data] );
        } else {
            console.log(url);
            console.log(JSON.stringify(CrossJsonP.mLocalCall));
            console.log( 'jsonp error:no call back of' + url );
        }
    }
}

class CrossJsonpXMLAnalyzer extends RES.XMLAnalyzer {
    private mUrls: any = {};

    public constructor() {
        super();
    }

    public loadFile( resItem, compFunc, thisObject ) {
        if ( this.fileDic[resItem.name] ) {
            compFunc.call( thisObject, resItem );
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
        
    }

    private onLoadOk( url, txt: string ) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if ( resItem.loaded ) {
            this.analyzeData( resItem, txt );
        }

        if ( compFunc ) {
            compFunc.call( data.thisObject, resItem );
        }
    };
}


class CrossJsonpTextAnalyzer extends RES.TextAnalyzer {
    private mUrls: any = {};
    public constructor() {
        super();
    }

    public loadFile( resItem, compFunc, thisObject ) {
        if ( this.fileDic[resItem.name] ) {
            compFunc.call( thisObject, resItem );
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
    }

    private onLoadOk( url, txt: string ) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if ( resItem.loaded ) {
            this.analyzeData( resItem, txt );
        }

        if ( compFunc ) {
            compFunc.call( data.thisObject, resItem );
        }
    };
}

class CrossJsonpJsonAnalyzer extends RES.JsonAnalyzer {
    private mUrls: any = {};

    public constructor() {
        super();
    }


    public loadFile( resItem, compFunc, thisObject ) {
        if ( this.fileDic[resItem.name] ) {
            compFunc.call( thisObject, resItem );
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
    }

    private onLoadOk( url, txt: string ) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if ( resItem.loaded ) {
            this.analyzeData( resItem, txt );
        }

        if ( compFunc ) {
            compFunc.call( data.thisObject, resItem );
        }
    };
}

class CrossJsonpFontAnalyzer extends RES.FontAnalyzer {
    private mUrls: any = {};
    
    private mRecyclerIamge:egret.ImageLoader[] = [];

    public constructor() {
        super();
    }


    public loadFile( resItem, compFunc, thisObject ) {
        if ( this.fileDic[resItem.name] ) {
            compFunc.call( thisObject, resItem );
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
    }

    private onLoadOk( url:string, txt: string ) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if ( resItem.loaded ) {
            resItem.loaded = false;
            var imageUrl = this.analyzeConfig( resItem,txt );
            if ( imageUrl ) { 
                if ( $mCrossImage){
                    this.loadImgJson( imageUrl, resItem, compFunc, data.thisObject);
                }else{
                    var request = this.mloadImage( imageUrl, data );
                    this.resItemDic[request.hashCode] = data;
                }
                return;
            }
        }
         
        if(resItem.loaded){
            if ( compFunc ) {
                compFunc.call( data.thisObject, resItem );
            }
        }
        
    };
    
    /**
     * @inheritDoc
     */
    public loadImgJson( imageUrl, resItem, compFunc, thisObject ) {
        var url: string = RES.getVersionController().getVirtualUrl( imageUrl + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onImgJsonLoadOk, this );
    };

    private onImgJsonLoadOk( url: string, base64: string ): void {
        var img: HTMLImageElement = document.createElement( 'img' );
        img.src = base64;
        var self = this;
        img.onload = function ( e: Event ) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url];
            var resItem = data.item;
            var compFunc = data.func;
            resItem.loaded = true;
            var texture2: egret.Texture = new egret.Texture();
            // texture2._setBitmapData( img as any );
            texture2.bitmapData = new egret.BitmapData(img);
            self.analyzeBitmap( resItem, texture2 );
            compFunc.call( data.thisObject, resItem );
        };

    };
    
    private onMLoad(e:egret.Event):void{
        var request:egret.ImageLoader = e.target as egret.ImageLoader;
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
        
        if ( resItem.loaded){
            compFunc.call(data.thisObject, resItem);
        }
    }
    
    private mloadImage (url, data) {
        var loader = this.mGetImageLoader();
        this.resItemDic[loader.hashCode] = data;
        loader.load(RES.getVersionController().getVirtualUrl(url));
        
        return loader;
    }; 
    
    private mGetImageLoader () {
        var loader = this.mRecyclerIamge.pop();
        if (!loader) {
            loader = new egret.ImageLoader();
            loader.addEventListener(egret.Event.COMPLETE, this.onMLoad, this);
            loader.addEventListener( egret.IOErrorEvent.IO_ERROR, this.onMLoad, this);
        }
        return loader;
    };
    
}

class CrossJsonpSheetAnalyzer extends RES.SheetAnalyzer {
    private mUrls: any = {};

    private mRecyclerIamge: egret.ImageLoader[] = [];

    public constructor() {
        super();
    }


    public loadFile( resItem, compFunc, thisObject ) {
        if ( this.fileDic[resItem.name] ) {
            compFunc.call( thisObject, resItem );
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
    }

    private onLoadOk( url: string, txt: string ) {
        var data = this.mUrls[url];
        delete this.mUrls[url];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = true;
        if ( resItem.loaded ) {
            resItem.loaded = false;
            var imageUrl = this.analyzeConfig( resItem, txt );
            if ( imageUrl ) {
                if ( $mCrossImage ) {
                    this.loadImgJson( imageUrl, resItem, compFunc, data.thisObject );
                } else {
                    var request = this.mloadImage( imageUrl, data );
                    this.resItemDic[request.hashCode] = data;   
                }
                return;
            }
        }

        if ( resItem.loaded ) {
            if ( compFunc ) {
                compFunc.call( data.thisObject, resItem );
            }
        }

    };

    /**
     * @inheritDoc
     */
    public loadImgJson( imageUrl, resItem, compFunc, thisObject ) {
        var url: string = RES.getVersionController().getVirtualUrl( imageUrl + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onImgJsonLoadOk, this );
    };

    private onImgJsonLoadOk( url: string, base64: string ): void {
        var img: HTMLImageElement = document.createElement( 'img' );
        img.src = base64;
        var self = this;
        img.onload = function ( e: Event ) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url];
            var resItem = data.item;
            var compFunc = data.func;
            resItem.loaded = true;
            var texture2: egret.Texture = new egret.Texture();
            // texture2._setBitmapData( img  as any);
            texture2.bitmapData = new egret.BitmapData(img);
            self.analyzeBitmap( resItem, texture2 );
            compFunc.call( data.thisObject, resItem );
        };

    };
    
    private onMLoad( e: egret.Event ): void {
        var request: egret.ImageLoader = e.target as egret.ImageLoader;
        var data = this.resItemDic[request.hashCode];
        delete this.resItemDic[request.hashCode];
        var resItem = data.item;
        var compFunc = data.func;
        resItem.loaded = ( e.type == egret.Event.COMPLETE );
        if ( resItem.loaded ) {
            var texture = new egret.Texture();
            // texture._setBitmapData( request.data );
            texture.bitmapData = new egret.BitmapData(request.data);
            this.analyzeBitmap( resItem, texture );
        }
        this.mRecyclerIamge.push( request );

        if ( resItem.loaded ) {
            compFunc.call( data.thisObject, resItem );
        }
    }

    private mloadImage( url, data ) {
        var loader = this.mGetImageLoader();
        this.resItemDic[loader.hashCode] = data;
        loader.load( RES.getVersionController().getVirtualUrl( url ) );

        return loader;
    };

    private mGetImageLoader() {
        var loader = this.mRecyclerIamge.pop();
        if ( !loader ) {
            loader = new egret.ImageLoader();
            loader.addEventListener( egret.Event.COMPLETE, this.onMLoad, this );
            loader.addEventListener( egret.IOErrorEvent.IO_ERROR, this.onMLoad, this );
        }
        return loader;
    };

}


class CrossJsonpImageAnalyzer extends RES.ImageAnalyzer{
    private mUrls:any = {};
    
    public constructor() {
        super();
    }
    
    /**
     * @inheritDoc
     */
    public loadFile (resItem, compFunc, thisObject) {
        if (this.fileDic[resItem.name]) {
            compFunc.call(thisObject, resItem);
            return;
        }

        var url: string = RES.getVersionController().getVirtualUrl( resItem.url + '.js' );
        this.mUrls[url] = { item: resItem, func: compFunc, thisObject: thisObject };;

        CrossJsonP.sendLocal( url, this.onLoadOk, this );
    };
    
    private onLoadOk( url: string, base64: string ): void {
        var img: HTMLImageElement = document.createElement( 'img' );
        img.src = base64;
        var self = this;
        img.onload = function ( e: Event ) {
            e.currentTarget['onload'] = null;
            var data = self.mUrls[url];
            delete self.mUrls[url]; 
            var resItem = data.item;
            var compFunc = data.func; 
            resItem.loaded = true;
            var texture2: egret.Texture = new egret.Texture();
            texture2.bitmapData = new egret.BitmapData(img);
            // texture2._setBitmapData( img  as any);
            self.analyzeData( resItem, texture2 );
            compFunc.call( data.thisObject, resItem );
        };
        
    };
    
}

