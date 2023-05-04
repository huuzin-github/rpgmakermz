//=============================================================================
// RPG Maker MZ - Book Filter
//
// 2022-2023 Huuzin
// Released under license
// https://github.com/huuzin-github/rpgmakermz/wiki/License-Notices
//
// ver 1.0.1	Release data: 2022/03/28
//				バグ修正
// ver 1.0.0	Release data: 2022/03/28
//				初版公開(First release)
// 
//=============================================================================


/*:ja
* @target MZ
* @plugindesc ver 1.0.0 本を開くようなフィルタを適用します
* @author Huuzin
* @url https://github.com/huuzin-github/rpgmakermz/wiki/BookFilter
* @base PluginCommonBase
* @orderAfter PluginCommonBase
*
* @help
* 本を開くようなフィルタを適用します
*
* ---使用方法---
* 1. プラグインをONにします。
* 2. イベント内で各種プラグインコマンドを呼び出してください。
*
* ---動作確認---
* コアスクリプト：v1.4.3 - v1.4.4
* 本プラグインの動作にはPluginCommonBaseが必要です。
* PluginCommonBase: https://triacontane.blogspot.com/2020/08/rpgmz.html


* @command ONFILTER
* @text フィルタを有効にする
* @desc ブックフィルタを有効にします。次の場所移動コマンドから開始します。

* @command OFFFILTER
* @text フィルタを無効にする
* @desc ブックフィルタを無効にします。次の場所移動コマンドから無効化します。

* @command SNAP
* @text タイルマップを撮影する
* @desc 現在のタイルマップを撮影してブックフィルタに適用します。場所移動コマンドの前に呼んでください。

* @command TURNPAGE
* @text 本をめくる
* @desc 場所移動コマンドをフェードなしで使用した直後に呼んでください。その後にウェイトを60フレーム程度入れておくことをお勧めします。


*/



(() => {
    'use strict';
    const script = document.currentScript;
	const param  = PluginManagerEx.createParameter(script);


	//-------------------------------------------------------------------------------------------------
	//	Plugin command
	//-------------------------------------------------------------------------------------------------
	PluginManagerEx.registerCommand(script, 'ONFILTER', args => {
		ZinBookFilter.OnFilter();
    });

	PluginManagerEx.registerCommand(script, 'OFFFILTER', args => {
		ZinBookFilter.OffFilter();
    });

	// タイルマップを撮影する
	PluginManagerEx.registerCommand(script, 'SNAP', args => {
		ZinBookFilter.snap();
    });

	// 本をめくる
	PluginManagerEx.registerCommand(script, 'TURNPAGE', args => {
		turnEnabled = true;
    });

	//-------------------------------------------------------------------------------------------------
	// Global members
    //-------------------------------------------------------------------------------------------------
	let filterEnabled = false;		// ブックフィルターを有効にするか
	let turnEnabled = false;		// ページめくり有効化信号
	let snappedBitmap = null;		// スナップ画像データ
    

    //-------------------------------------------------------------------------------------------------
    // Static Class
    //-------------------------------------------------------------------------------------------------
	function ZinBookFilter() {
		throw new Error('This is a static class');
	}

	ZinBookFilter.OnFilter = function() {
		filterEnabled = true;
	}

	ZinBookFilter.OffFilter = function() {
		filterEnabled = false;
	}

	ZinBookFilter.deleteSnap = function() {
		if(snappedBitmap) snappedBitmap.destroy();
	}

	ZinBookFilter.snap = function() {
		ZinBookFilter.deleteSnap();
		if(SceneManager._scene._spriteset){
			snappedBitmap = Bitmap.snap(SceneManager._scene._spriteset._tilemap);
		}
	};


	//-------------------------------------------------------------------------------------------------
    // Initialize
    //-------------------------------------------------------------------------------------------------
	const _Scene_Title_prototype_initialize = Scene_Title.prototype.initialize;
	Scene_Title.prototype.initialize = function() {
		_Scene_Title_prototype_initialize.apply(this,arguments);
		ZinBookFilter.OffFilter();
	};


	//-------------------------------------------------------------------------------------------------
    // Sprite For Tiles
    //-------------------------------------------------------------------------------------------------
	const _Spriteset_Map_prototype_createParallax = Spriteset_Map.prototype.createParallax;
	Spriteset_Map.prototype.createParallax = function() {
		_Spriteset_Map_prototype_createParallax.apply(this,arguments);
		if(filterEnabled){
			this._parallaxTile = new TilingSprite();
			this._parallaxTile.move(0, 0, Graphics.width, Graphics.height);
			this._baseSpriteTile.addChild(this._parallaxTile);
		}
	};

	const _Spriteset_Base_prototype_createBaseSprite = Spriteset_Base.prototype.createBaseSprite;
	Spriteset_Base.prototype.createBaseSprite = function() {
		if(filterEnabled){
			this._baseSprite = new Sprite();
			this._blackScreen = new ScreenSprite();
			this._blackScreen.opacity = 255;

			this.addChild(this._baseSprite);

			this._blackScreenTile = new Sprite();
			this._blackScreenTile.opacity = 255;
		
			this._baseSpriteTile = new Sprite();
			this.addChild(this._baseSpriteTile);
			this.addChild(this._blackScreenTile);
			if(snappedBitmap){
				this._blackScreenTile.bitmap = snappedBitmap;
			}
		
			this._baseSprite.addChild(this._blackScreen);
		}else{
			_Spriteset_Base_prototype_createBaseSprite.apply(this,arguments);
		}
	};

	const _Spriteset_Map_prototype_createTilemap = Spriteset_Map.prototype.createTilemap;
	Spriteset_Map.prototype.createTilemap = function() {
		if(filterEnabled){
			const tilemap = new Tilemap();
			tilemap.tileWidth = $gameMap.tileWidth();
			tilemap.tileHeight = $gameMap.tileHeight();
			tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
			tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
			tilemap.verticalWrap = $gameMap.isLoopVertical();
			this._baseSpriteTile.addChild(tilemap);
			this._effectsContainer = tilemap;
			this._tilemap = tilemap;
			this.loadTileset();
		}else{
			_Spriteset_Map_prototype_createTilemap.apply(this,arguments);
		}
	};

	const _Spriteset_Base_prototype_createBaseFilters = Spriteset_Base.prototype.createBaseFilters;
	Spriteset_Base.prototype.createBaseFilters = function() {
		_Spriteset_Base_prototype_createBaseFilters.apply(this,arguments);

		if(filterEnabled){
			this._baseSpriteTile.filters = [];

			this._baseColorFilterTile = new ColorFilter();
	    	this._baseSprite.filters.push(this._baseColorFilterTile);

			this._pixelMoveFilter = new PIXI.filters.MoveFilter();
			this._baseSpriteTile.filters.push(this._pixelMoveFilter);
			this._blackScreenTile.filters = [];
			this._pixelMoveFilterOld = new PIXI.filters.MoveFilter();
			this._pixelMoveFilterOld.uniformGroup.uniforms.inverseFlag = -1.0;
			this._blackScreenTile.filters.push(this._pixelMoveFilterOld);
		}
	};


	//-------------------------------------------------------------------------------------------------
    // Change Filter
    //-------------------------------------------------------------------------------------------------
	const _Scene_Map_prototype_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_prototype_update.apply(this,arguments);

		if(filterEnabled &&
			this._spriteset._blackScreenTile &&
			this._spriteset._baseSpriteTile &&
			this._spriteset._pixelMoveFilter &&
			this._spriteset._pixelMoveFilterOld
		){
			if(turnEnabled){
				turnEnabled = false;
				this._turnEnabled = true;
				this._rad = -3.1415;
				this._radSw = 1;
				this._reverseFlag = false;
			}

			if(this._turnEnabled){
				this._rad = this._rad + 0.08 * this._radSw;
				if(this._rad >= -0.1){
					this._rad = -0.1;
					this._turnEnabled = false;
					this._spriteset._blackScreenTile.bitmap = null;
					ZinBookFilter.deleteSnap();
				}
				this._radOut = this._rad;
				this._radOutOld = this._rad;

				if(this._rad >= -3.1415 * 0.5 && !this._reverseFlag){
					this._reverseFlag = true;
					this._spriteset.swapChildren(this._spriteset._blackScreenTile, this._spriteset._baseSpriteTile);
				}

				if(this._radOut < -3.1415 * 0.5) this._radOut = -3.1415 * 0.5;
				if(this._radOutOld > -3.1415 * 0.5) this._radOutOld = -3.1415 * 0.5;
				this.ChangeBookFilter(this._radOut, this._spriteset._pixelMoveFilter);
				this.ChangeBookFilter(this._radOutOld, this._spriteset._pixelMoveFilterOld);
			}
		}
	};

	Scene_Map.prototype.ChangeBookFilter = function(radOut, filter) {
		let sinV = Math.sin(radOut);
		let cosV = Math.cos(radOut);
		let tanL = Math.tan(radOut);
		let tanR = Math.tan(radOut);

		if(filter.uniformGroup){
			filter.uniformGroup.uniforms.sinAng = sinV;
			filter.uniformGroup.uniforms.cosAng = cosV;
			filter.uniformGroup.uniforms.tanL = tanL;
			filter.uniformGroup.uniforms.tanR = tanR;
			filter.uniformGroup.uniforms.shadowPrm = radOut * 0.2 + 1.1;
		}
	}


	//-------------------------------------------------------------------------------------------------
	// Book Filter
	//-------------------------------------------------------------------------------------------------
	PIXI.filters.MoveFilter = function () {
		let deg = 4;
		let sinP = Math.sin(deg * 3.1415 / 180);
		let cosP = Math.cos(deg * 3.1415 / 180);

		var uniforms = {
			widthN: 1.0 / (Graphics.boxWidth + 8.0),
			heightN: 1.0 / (Graphics.boxHeight + 8.0),

			cx: 0.5,	// センターX
			cy: 0.7,	// センターY
			sinAng: sinP,
			cosAng: cosP,

			tanL: -0.1,
			tanR: -0.1,

			inverseFlag: 1.0,
			shadowPrm: 1.0,
		};

		var fragmentSrc = [
		  'precision mediump float;',
		  'uniform sampler2D uSampler;',
		  'uniform vec2 resolution;',
		  'varying vec2 vTextureCoord;',
		  'uniform float widthN;',
		  'uniform float heightN;',

		  'uniform float cx;',
		  'uniform float cy;',
		  'uniform float sinAng;',
		  'uniform float cosAng;',
		  'uniform float inverseFlag;',
		  'uniform float shadowPrm;',

		  'uniform float tanR;',
		  'uniform float tanL;',

		  'vec2 Convert (vec2 A1, vec2 A2, vec2 x){',
		  '		vec2 y;',
		  '		y.x = A1.x * x.x + A1.y * x.y;',
		  '		y.y = A2.x * abs(x.x) + A2.y * x.y - atan(50.0, abs(x.x)) * 10.0;',
		  '		return y;',
		  '}',

		  'void main (void) {',
		  'vec2 fc = vec2(gl_FragCoord.s, gl_FragCoord.t);',
		  'vec2 pos = vec2((vTextureCoord.x - cx)/widthN, (vTextureCoord.y - cy)/heightN);',
		  'float xStep = step(0.0, pos.x * inverseFlag);',
		  'vec2 outPos = pos;',
		  'outPos = Convert(vec2(1.0,0.0), vec2(-0.1,1.0), pos);',
		  'outPos = (1.0 - xStep) * vec2(- (tanL + 0.1) * outPos.x * inverseFlag * 1.0 + outPos.x, tanL * 0.1 * outPos.x * inverseFlag + cosAng * 0.0 + outPos.y * (1.0 + (tanL + 0.1) * (outPos.x*outPos.y) * 0.000002)) + xStep * outPos;',
		  'gl_FragColor = texture2D(uSampler, vec2(outPos.x * widthN, outPos.y * heightN) + vec2(cx,cy));',

		  // Add a shadow
		  'float shadow = 1.0 + xStep * (0.2 + -1.0 / (1.0 + 0.001 * pos.x * pos.x)) * 0.5 + (1.0 - xStep) * (-0.2 + 1.0 / (1.0 + 0.001 * pos.x * pos.x)) * 0.5;',
		  'shadow += (1.0 - xStep) * (shadowPrm - 1.0);',
		  'gl_FragColor.r *= shadow;',
		  'gl_FragColor.g *= shadow;',
		  'gl_FragColor.b *= shadow;',
		  '}'
		];

		PIXI.Filter.call(this,
			null, // vertex shader
			fragmentSrc.join('\n'), // fragment shader
			uniforms // uniforms
		);
	};

	PIXI.filters.MoveFilter.prototype = Object.create(PIXI.Filter.prototype);
	PIXI.filters.MoveFilter.prototype.constructor = PIXI.filters.MoveFilter;

	
})();