//=============================================================================
// RPG Maker MZ - BoxCameraControl
//
// 2020-2023 Huuzin
// Released under license
// https://github.com/huuzin-github/rpgmakermz/wiki/License-Notices
//
// ver 1.0.0	Release data: 2020/9/20
//				初版公開
// 
//=============================================================================

/*:
* @target MZ
* @plugindesc カメラの機能を拡張してプレイヤーの視界確保とボックス内カメラ固定機能を追加します
* @author Huuzin
* @url https://github.com/huuzin-github/rpgmakermz/wiki/BoxCameraControl
* @base PluginCommonBase
* @orderAfter PluginCommonBase
*
* @help
* マップ画面のカメラを制御してプレイヤーの前方視界を多くとるようにカメラを
* 動かします。また、部屋等の四角で囲まれた領域に踏み込むと四角内部にカメラ
* が留まる演出を追加することもできます。
* カメラは滑らかに動くのでプレイしている人が気付きにくく没入感を阻害するこ
* とがありません。
*
* ---ベースプラグイン---
* トリアコンタン様の「PluginCommonBase」を導入する必要があります。
* https://triacontane.blogspot.com/2020/08/rpgmz.html
*
*
* ---使用方法---
* 1. プラグインをONするだけでプレイヤーの前方視界をスムーズに広げます。
* 2. ボックスカメラ機能を利用するには、イベントを作成してメモに
*     「<BoxC:w,h>」(wは横幅マス、hは縦幅マス)
* と記入してください。イベントマスの左右w、上下hのマス目範囲がボックスカメ
* ラ状態になります。
* 
* ---プラグインコマンド---
* 1. マップスクロールのクリア
* イベントコマンド「マップのスクロール」やプラグインコマンド
* 「マップスクロール・マップスクロール(座標指定)」でスクロールした情報を消
* 去します。
*
* 2. マップスクロール
* 標準イベントコマンド「マップのスクロール」と同様のカメラ制御ができます。
* プラグインコマンドの方はカメラのスムーズ制御に対応しています。
*
* 3. マップスクロール(座標指定)
* 標準イベントコマンド「マップのスクロール」と同様のカメラ制御ができます。
* こちらは指定したx,y座標にカメラが移動します。

* @param cameraPositionMag
* @text カメラ座標補正値
* @desc プレイヤーが移動したとき、カメラをどれだけ中央からずらすか
* @default 2
* @type number
* @decimals 1

* @param boxViewOut
* @text カメラボックス制限幅
* @desc カメラがボックス内にいるとき、ボックス外側を何マス映すか
* @default 2
* @type number
* @decimals 1

* @command clearMapScroll
* @text マップスクロールのクリア
* @desc マップスクロールの移動量を0に戻します。
*
* @arg speed
* @text 速度
* @desc スクロール速度を指定します。
* @type select
* @default spd1
* @option １/８倍速
* @value spd1_8
* @option １/４倍速
* @value spd1_4
* @option １/２倍速
* @value spd1_2
* @option 標準速
* @value spd1
* @option ２倍速
* @value spd2
* @option ４倍速
* @value spd4
*
* @arg waitFinish
* @type boolean
* @default false
* @text 完了までウェイト
* @desc スクロールが終了するまで待ちます。
*
* @arg immediately
* @type boolean
* @default false
* @text すぐに完了
* @desc スクロールをすぐに終了させます。

* @command mapScroll
* @text マップスクロール
* @desc 指定マスカメラを動かします。
*
* @arg targetX
* @text X座標
* @desc X座標を何マス動かすか
* @default 0
* @type number
* @min -1000
* @max 1000

* @arg targetY
* @text Y座標
* @desc Y座標を何マス動かすか
* @default 0
* @type number
* @min -1000
* @max 1000
*
* @arg speed
* @text 速度
* @desc スクロール速度を指定します。
* @type select
* @default spd1
* @option １/８倍速
* @value spd1_8
* @option １/４倍速
* @value spd1_4
* @option １/２倍速
* @value spd1_2
* @option 標準速
* @value spd1
* @option ２倍速
* @value spd2
* @option ４倍速
* @value spd4
*
* @arg waitFinish
* @type boolean
* @default false
* @text 完了までウェイト
* @desc スクロールが終了するまで待ちます。
*
* @arg immediately
* @type boolean
* @default false
* @text すぐに完了
* @desc スクロールをすぐに終了させます。
*
*
* @command mapScrollSet
* @text マップスクロール(座標指定)
* @desc 指定マスの座標にカメラ移動します。

* @arg targetX
* @text X座標
* @desc 移動先X座標
* @default 0
* @type number
* @min -1000
* @max 1000

* @arg targetY
* @text Y座標
* @desc 移動先Y座標
* @default 0
* @type number
* @min -1000
* @max 1000
*
* @arg speed
* @text 速度
* @desc スクロール速度を指定します。
* @type select
* @default spd1
* @option １/８倍速
* @value spd1_8
* @option １/４倍速
* @value spd1_4
* @option １/２倍速
* @value spd1_2
* @option 標準速
* @value spd1
* @option ２倍速
* @value spd2
* @option ４倍速
* @value spd4

*
* @arg waitFinish
* @type boolean
* @default false
* @text 完了までウェイト
* @desc スクロールが終了するまで待ちます。
*
* @arg immediately
* @type boolean
* @default false
* @text すぐに完了
* @desc スクロールをすぐに終了させます。
*
*/

(() => {
	'use strict';
	const script = document.currentScript;
	const param  = PluginManagerEx.createParameter(script);

	//-------------------------------------------------------------------------------------------------
	//	Plugin command
	//-------------------------------------------------------------------------------------------------
	//Clear
	PluginManagerEx.registerCommand(script, "clearMapScroll", args => {
		if(args.immediately){
			scrollDistanceX = 0;
			scrollDistanceY = 0;
		}else{
			ZinBoxCamera._isMovingToTarget = true;
			ZinBoxCamera._commandSpeed = ZinBoxCamera.getSpeed(args.speed);
			ZinBoxCamera._waitFinish = args.waitFinish;
		}
		ZinBoxCamera._targetX = 0;
		ZinBoxCamera._targetY = 0;
	});

	//Move(Add)
	PluginManagerEx.registerCommand(script, "mapScroll", args => {
		const waitFinish = args.waitFinish;

		if(args.immediately){
			scrollDistanceX += args.targetX;
			scrollDistanceY += args.targetY;
		}else{
			ZinBoxCamera._isMovingToTarget = true;
			ZinBoxCamera._commandSpeed = ZinBoxCamera.getSpeed(args.speed);
			ZinBoxCamera._waitFinish = args.waitFinish;
		}
		ZinBoxCamera._targetX += args.targetX;
		ZinBoxCamera._targetY += args.targetY;
		
	});

	//Move(Set)
	PluginManagerEx.registerCommand(script, "mapScrollSet", args => {
		const waitFinish = args.waitFinish;

		if(args.immediately){
			scrollDistanceX = args.targetX - $gamePlayer.x;
			scrollDistanceY = args.targetY - $gamePlayer.y;
		}else{
			ZinBoxCamera._isMovingToTarget = true;
			ZinBoxCamera._commandSpeed = ZinBoxCamera.getSpeed(args.speed);
			ZinBoxCamera._waitFinish = args.waitFinish;
		}
		ZinBoxCamera._targetX = args.targetX - $gamePlayer.x;
		ZinBoxCamera._targetY = args.targetY - $gamePlayer.y;
	});

	//-------------------------------------------------------------------------------------------------
    // Constant
    //-------------------------------------------------------------------------------------------------
	const cameraAcceleration = 0.05;
	const cameraVelocity = 0.03;
	const cameraMaxVel = 1.5;
	const targetMinLength = 0.2;
	

	//-------------------------------------------------------------------------------------------------
    // Static Class ZinBoxCamera
    //-------------------------------------------------------------------------------------------------
	function ZinBoxCamera() {
		throw new Error('This is a static class');
	}

	ZinBoxCamera.initialize = function(){
		this._cameraTargets = [];
		//this._lastX = 0;
		//this._lastY = 0;
		this._targetI = -1;
		this._cameraX = 0;
		this._cameraY = 0;
		this._attAcc = 0;
		this._commandSpeed = 4;

		this._commandAcceleration = 15 * 2;
		this._commandVelocity = 0;
		this._targetX = 0;
		this._targetY = 0;
		this._commandFriction = 0.1 * 2;
		this._isMovingToTarget = false;
		this._waitFinish = false;
	};

	ZinBoxCamera.addCameraTarget = function(target){
		this._cameraTargets.push(target);
	};

	ZinBoxCamera.searchCameraTarget = function(x,y){
		//if(this._lastX == x && this._lastY == y) return;

		for(let i = 0; i < this._cameraTargets.length; i++){
			if(this._cameraTargets[i][0] === undefined) continue;

			if(this._cameraTargets[i][0]._realX - this._cameraTargets[i][1] <= x && x <= this._cameraTargets[i][0]._realX + this._cameraTargets[i][1] &&
				this._cameraTargets[i][0]._realY - this._cameraTargets[i][2] <= y && y <= this._cameraTargets[i][0]._realY + this._cameraTargets[i][2])
			{
				this._targetI = i;
				break;
			}
			if(i == this._cameraTargets.length - 1) this._targetI = -1;
		}
		if(this._cameraTargets.length <= 0) this._targetI = -1;

		//this._lastX = x;
		//this._lastY = y;
	};

	ZinBoxCamera.update = function(x,y){
		const v = cameraAcceleration;
		const b = param.boxViewOut;
		if(this._targetI >= 0)
		{
			const w = (Graphics.width / $gameMap.tileWidth() - 1) * 0.5;
			const h = (Graphics.height / $gameMap.tileHeight() - 1) * 0.5;

			const oldX = this._cameraX;
			const oldY = this._cameraY;

			let bx =  this._cameraTargets[this._targetI][1] + b - w;
			if(bx < 0) bx = 0;

			if(x < this._cameraTargets[this._targetI][0].x)
			{
				this._cameraX += ((x - this._cameraTargets[this._targetI][0]._realX + bx) - this._cameraX) * v;
				if(this._cameraX > 0){
					if(oldX > 0) this._cameraX *= (1.0-v); else this._cameraX = 0;	
				}			
			}else{
				this._cameraX += ((x - this._cameraTargets[this._targetI][0]._realX - bx) - this._cameraX) * v;
				if(this._cameraX < 0){
					if(oldX < 0) this._cameraX *= (1.0-v); else this._cameraX = 0;	
				}
			}


			if(y < this._cameraTargets[this._targetI][0].y)
			{
				this._cameraY += ((y - (this._cameraTargets[this._targetI][0]._realY - this._cameraTargets[this._targetI][2]) + b - h) - this._cameraY) * v;
				if(this._cameraY > 0){
					if(oldY > 0) this._cameraY *= (1.0-v); else this._cameraY = 0;	
				}	
			}else{
				this._cameraY += ((y - (this._cameraTargets[this._targetI][0]._realY + this._cameraTargets[this._targetI][2]) - b + h) - this._cameraY) * v;
				if(this._cameraY < 0){
					if(oldY < 0) this._cameraY *= (1.0-v); else this._cameraY = 0;	
				}
			}

			this._attAcc = 0;
		}else{
			this._attAcc += v * 0.1;
			if(this._attAcc > v) this._attAcc = v;
			this._cameraX *= 1.0 - this._attAcc;
			this._cameraY *= 1.0 - this._attAcc;
		}
	}

	ZinBoxCamera.commandUpdate = function(){
		if(!this._isMovingToTarget) return;

		let v = Math.sqrt((this._targetX - scrollDistanceX) * (this._targetX - scrollDistanceX) + (this._targetY - scrollDistanceY) * (this._targetY - scrollDistanceY));
		let a = Math.atan2(this._targetY - scrollDistanceY, this._targetX - scrollDistanceX);
		if(v > this._commandAcceleration * 60) v = this._commandAcceleration * 60;

		this._commandVelocity += this._commandAcceleration * v / 60 - this._commandVelocity * this._commandFriction;
		const vp = Math.pow(2,this._commandSpeed) * 0.234375;
		if(this._commandVelocity > vp) this._commandVelocity = vp;

		if(this._commandVelocity >= v * 60 || v < 0.01){
			scrollDistanceX = this._targetX;
			scrollDistanceY = this._targetY;
			this._isMovingToTarget = false;
		}else{
			scrollDistanceX += Math.cos(a) * this._commandVelocity / 60;
			scrollDistanceY += Math.sin(a) * this._commandVelocity / 60;
		}

	}

	ZinBoxCamera.getSpeed = function(speed){
		switch(speed){
			case "spd1_8":
				return 1;
			case "spd1_4":
				return 2;
			case "spd1_2":
				return 3;
			case "spd1":
				return 4;
			case "spd2":
				return 5;
			case "spd4":
				return 6;
		}
		return 4;
	}

	ZinBoxCamera.IsWaitingCamera = function(){
		if(!this._waitFinish || !this._isMovingToTarget) return false;
		if((this._targetX - scrollDistanceX) * (this._targetX - scrollDistanceX) + (this._targetY - scrollDistanceY) * (this._targetY - scrollDistanceY) > targetMinLength){
			return true;
		}else{
			return false;
		}
	}
	

	window.ZinCameraSmooth = ZinBoxCamera;

	//-------------------------------------------------------------------------------------------------
	//	Game Player
	//-------------------------------------------------------------------------------------------------
	const Game_Player_prototype_initMembers = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
		Game_Player_prototype_initMembers.apply(this,arguments);
		this._realXOld = this._realX;
		this._realYOld = this._realY;
		this._viewTargetX = 0;
		this._viewTargetY = 0;
		this._dxSign = 0;
		this._dySign = 0;
		this._AttAccX = 0;
		this._AttAccY = 0;
	}
	
	const Game_Player_prototype_update = Game_Player.prototype.update;
	Game_Player.prototype.update = function(sceneActive) {
		Game_Player_prototype_update.apply(this,arguments);
		ZinBoxCamera.searchCameraTarget(this._realX,this._realY);
		ZinBoxCamera.update(this._realX,this._realY);
		ZinBoxCamera.commandUpdate();
	};

	const Game_Player_prototype_centerX = Game_Player.prototype.centerX;
	Game_Player.prototype.centerX = function() {
		return Game_Player_prototype_centerX.apply(this,arguments) - this._viewTargetX - scrollDistanceX + ZinBoxCamera._cameraX;
	};
	
	const Game_Player_prototype_centerY = Game_Player.prototype.centerY;
	Game_Player.prototype.centerY = function() {
		return Game_Player_prototype_centerY.apply(this,arguments) - this._viewTargetY - scrollDistanceY + ZinBoxCamera._cameraY;
	};

	Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
		const accel = cameraAcceleration;
		const accMax = cameraMaxVel;
		const mag = param.cameraPositionMag;

		const sigX = Math.sign(this._realX - this._realXOld);
		const sigY = Math.sign(this._realY - this._realYOld);

		if(sigX > 0){
			this._dxSign += accel;
			if(this._dxSign > 1) this._dxSign = 1;
		}
		if(sigX < 0){
			this._dxSign -= accel;
			if(this._dxSign < -1) this._dxSign = -1;
		}
		if(sigX == 0 && sigY != 0) this._dxSign = 0;

		if(sigY > 0){
			this._dySign += accel;
			if(this._dySign > 1) this._dySign = 1;
		}
		if(sigY < 0){
			this._dySign -= accel;
			if(this._dySign < -1) this._dySign = -1;
		}
		if(sigY == 0 && sigX != 0) this._dySign = 0;

		let dx = this._dxSign * mag - this._viewTargetX;
		let dy = this._dySign * mag - this._viewTargetY;
		

		if(dx > accMax) dx = accMax;
		if(dx < -accMax) dx = -accMax;
		if(dy > accMax) dy = accMax;
		if(dy < -accMax) dy = -accMax;

		if(ZinBoxCamera._targetI < 0 || Math.abs(ZinBoxCamera._cameraX) + param.cameraPositionMag < 0.1){
			this._viewTargetX += dx * cameraVelocity;
			if(this._viewTargetX > mag) this._viewTargetX = mag;
			if(this._viewTargetX < -mag) this._viewTargetX = -mag;
			this._AttAccX = 0;
		}else{
			this._AttAccX += cameraAcceleration * 0.1;
			if(this._AttAccX > cameraAcceleration) this._AttAccX = cameraAcceleration;
			this._viewTargetX *= 1.0 - this._AttAccX;
		}

		if(ZinBoxCamera._targetI < 0 || Math.abs(ZinBoxCamera._cameraY) + param.cameraPositionMag < 0.1){
			this._viewTargetY += dy * cameraVelocity;
			if(this._viewTargetY > mag) this._viewTargetY = mag;
			if(this._viewTargetY < -mag) this._viewTargetY = -mag;
			this._AttAccY = 0;
		}else{
			this._AttAccY += cameraAcceleration * 0.1;
			if(this._AttAccY > cameraAcceleration) this._AttAccY = cameraAcceleration;
			this._viewTargetY *= 1.0 - this._AttAccY;
		}

		const x2 = this.scrolledX();
		const y2 = this.scrolledY();
		if (y2 > this.centerY()) {
			$gameMap.scrollDown(y2 - this.centerY());
		}
		if (x2 < this.centerX()) {
			$gameMap.scrollLeft(this.centerX() - x2);
		}
		if (x2 > this.centerX()) {
			$gameMap.scrollRight(x2 - this.centerX());
		}
		if (y2 < this.centerY()) {
			$gameMap.scrollUp(this.centerY() - y2);
		}

		this._realXOld = this._realX;
		this._realYOld = this._realY;
	};

	let scrollDistanceX = 0.0;
	window.scrollDistanceX = scrollDistanceX;
	let scrollDistanceY = 0.0;
	window.scrollDistanceY = scrollDistanceY;

	//-------------------------------------------------------------------------------------------------
	//	Game Map
	//-------------------------------------------------------------------------------------------------
	const Game_Map_prototype_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function() {
		Game_Map_prototype_initialize.apply(this,arguments);
		ZinBoxCamera.initialize();
	};

	const Game_Map_prototype_doScroll = Game_Map.prototype.doScroll;
	Game_Map.prototype.doScroll = function(direction, distance) {
		Game_Map_prototype_doScroll.apply(this,arguments);
		switch (direction) {
			case 2:
				scrollDistanceY += distance;
				break;
			case 4:
				scrollDistanceX -= distance;
				break;
			case 6:
				scrollDistanceX += distance;
				break;
			case 8:
				scrollDistanceY -= distance;
				break;
		}
	};


	//-------------------------------------------------------------------------------------------------
	//	Game Event
	//-------------------------------------------------------------------------------------------------
	const Game_Event_prototype_initialize = Game_Event.prototype.initialize;
	Game_Event.prototype.initialize = function(mapId, eventId) {
		Game_Event_prototype_initialize.apply(this,arguments);
		this.CheckEvent_CameraSmooth($dataMap.events[eventId],this);
	};

	Game_Event.prototype.CheckEvent_CameraSmooth = function(et,ge) {
		const meta = PluginManagerEx.findMetaValue(et, 'BoxC');
        if (!meta) {
            
        }else{
			var g = meta.split(',');
			if(g.length < 2) g.push(0);
			//var ar = [et.x,et.y,Number(g[0]),Number(g[1])];
			var ar = [ge,Number(g[0]),Number(g[1])];
			ZinBoxCamera.addCameraTarget(ar);
		}
	};


	//-------------------------------------------------------------------------------------------------
	// Game_Interpreter
	// 一時停止処理
	//-------------------------------------------------------------------------------------------------
	const Game_Interpreter_prototype_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
	Game_Interpreter.prototype.updateWaitMode = function() {
		let waiting = Game_Interpreter_prototype_updateWaitMode.apply(this,arguments);

		if(ZinBoxCamera.IsWaitingCamera()){
			waiting = true;
			this._waitMode = "WaitCameraControl";
		}

		if (!waiting) {
			this._waitMode = "";
		}
		return waiting;
	};


})();