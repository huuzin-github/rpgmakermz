//=============================================================================
// RPG Maker MZ - Pictuner
//
// Copyright 2021 Huuzin
// Released under the MIT license
// https://opensource.org/licenses/mit-license.php
//
// ver 1.0.0	Release data: 2021/06/27
//				初版公開(First release)
// 
// https://huuzin.net
// 
//=============================================================================


/*:
* @target MZ
* @plugindesc ver 1.0.0 Provides plug-in commands to make pictures easier to handle.
* @author Huuzin
* @url https://huuzin.net/2021/01/11/windowtween/
* @base PluginCommonBase
* @orderAfter PluginCommonBase
*
* @help
* Provides plug-in commands to make pictures easier to handle.
* For example,
* You can move or zoom in on multiple pictures.
* Picture numbers and coordinates can be specified by variables (\V[n]).
* It is possible to specify the position without being bound by the resolution by %.
* You can specify a parent picture, and it will move as the parent moves or expands.
* You can specify anchors (reference coordinates) other than top-left and center.
*
* ---Usage---
* 1. Turn on the plug-in.
* 2. In the event, select the plug-in command and choose ZinPictuner.
* 
* ---Parameters---
* ・Picture number: Specify the picture number.
* You can specify multiple picture numbers by using commas, such as "32,45".
* You can also specify a sequential number (all numbers from 32 to 45) by writing "32-45".
* The variable (\V[n]) can be used. Combined use is also possible, such as "\V[1],\V[2]".
*
*  x,y,w,h：Movement and expansion parameters
* If only a number is entered, it will specify the pixel coordinates for movement and the magnification (100 as it is) for scale.
* If you add %, such as "50%", the position will be 50% of the parent (or the entire screen if no parent is specified).
* If you add "by", such as "by30", the position is +30 to the current position.
* (Coordinate specification only) Enter "\T" to specify the touch (mouse) coordinates.
* (Enlargement specification only) If px is given, such as "300px", the image will be enlarged to be 300 pixels regardless of the size of the parent or picture.
* Variable (\V[n]) is available.
*
*  alpha, angle: Opacity and angle parameters
* If you enter only a number, the opacity will match [(fully transparent) 0-255 (fully opaque)] for opacity, and ° [0-360 (one revolution)] for angle.
* If you add %, such as "50%", it will be translucent or half the angle of one circle.
* If you add "by", such as "by30", it will be +30 of the current value.
* Variable (\V[n]) is available.
*
* ---Operational verification---
* Core scripts: v1.3.0
* PluginCommonBase is required for this plugin to work.
* PluginCommonBase: https://triacontane.blogspot.com/2020/08/rpgmz.html


* @command PICTUNER_SET_ANCHOR
* @text Set anchor for picture
* @desc Set an anchor (origin) for the picture.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg anchor
* @text Anchor
* @desc Specifies the anchor.
* @type select
* @default 0
* @option LeftTop
* @value 0
* @option Center
* @value 1
* @option RightBottom
* @value 2
* @option CenterTop
* @value 3
* @option EightTop
* @value 4
* @option LeftCenter
* @value 5
* @option RightCenter
* @value 6
* @option LeftBottom
* @value 7
* @option CenterBottom
* @value 8


* @command PICTUNER_SET_POS
* @text Move the picture to the specified coordinates
* @desc Moves the picture to the specified coordinates.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg x
* @text Destination x coordinate
* @desc Specifies the x-coordinate to move to. You can use "%", "by", or "\T".
* @default 0
* @type string
*
* @arg y
* @text Destination y coordinate
* @desc Specifies the y-coordinate to move to. You can use "%", "by", or "\T".
* @default 0
* @type string


* @command PICTUNER_SET_SCALE
* @text Scale a picture to a specified size.
* @desc Scales a picture to a specified size.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg w
* @text Horizontal scaling factor
* @desc Specifies the horizontal scaling factor. You can use "%", "by", or "px".
* @default 0
* @type string
*
* @arg h
* @text Vertical scaling factor
* @desc Specifies the vertical scaling factor. You can use "%", "by", or "px".
* @default 0
* @type string


* @command PICTUNER_SET_ALPHA
* @text Change the picture to the specified transparency.
* @desc Change the picture to the specified transparency.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg opacity
* @text Opacity
* @desc Specifies the opacity. If you add "%", the value will be converted to 100% = 255 (full opacity).
* @default 0
* @type string


* @command PICTUNER_SET_ANGLE
* @text Change the picture to the specified angle.
* @desc Change the picture to the specified angle.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg angle
* @text Angle
* @desc Specify the angle. If "%" is specified, it will be converted to 100% = 360 (one revolution).
* @default 0
* @type string


* @command PICTUNER_SET_PARENT
* @text Set parent picture to picture
* @desc Set parent picture to picture
*
* @arg pictID
* @text Child picture No.
* @desc Specify the child picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*
* @arg parentID
* @text Parent picture No.
* @desc Specify the parent picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type number


* @command PICTUNER_RELEASE_PARENT
* @text Release the parent picture of a picture
* @desc Release the parent picture of a picture
*
* @arg pictID
* @text Child picture No.
* @desc Specify the child picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string


* @command PICTUNER_ERASE
* @text Erase Picture
* @desc Erase the specified picture.
*
* @arg pictID
* @text Picture No.
* @desc Specify the picture number. You can specify multiple numbers by ",", sequential numbers by "-", or use variables (\V[n]).
* @default 1
* @type string
*/


/*:ja
* @target MZ
* @plugindesc ver 1.0.0 ピクチャをより扱いやすくするためのプラグインコマンドを提供します。
* @author Huuzin
* @url https://huuzin.net/2021/01/11/windowtween/
* @base PluginCommonBase
* @orderAfter PluginCommonBase
*
* @help
* ピクチャをより扱いやすくするためのプラグインコマンドを提供します。
* 例えば、以下のような機能を備えています。
* ・複数のピクチャに対して移動や拡大を実行できます。
* ・変数(\V[n])によるピクチャ番号や座標の指定が可能です。
* ・%による解像度に捉われない位置指定が可能です。
* ・親(Parent)ピクチャを指定でき、親の移動や拡大に合わせて動きます。
* ・アンカー(基準座標)を左上、中央以外も指定できます。
*
* ---使用方法---
* 1. プラグインをONにします。
* 2. イベント内でプラグインコマンドを選択し、ZinPictunerを選んでください。
* 
* ---パラメータ---
* ・PictID(ピクチャ番号)：ピクチャ番号を指定します。
* 「32,45」のようにカンマを使用すると複数のピクチャ番号を指定できます。
* また、「32-45」と記入すると連番(32から45まですべて)指定できます。
* 変数(\V[n])が利用できます。「\V[1],\V[2]」のように複合使用も可能です。
*
* ・x,y,w,h：移動及び拡大パラメータ
* 数字のみ記入すると、移動の場合ピクセル座標、拡大の場合倍率(100でそのまま)の
* 指定になります。
* 「50%」のように%を付与すると、親(親を指定していない場合画面全体)の50%の位置
* になります。
* 「by30」のようにbyを付与すると、現在位置の+30の位置になります。
* (座標指定のみ)「\T」と入力するとタッチ(マウス)座標を指定します。
* (拡大指定のみ)「300px」のようにpxを付与すると親やピクチャの大きさに関係なく
* 300ピクセルになるように拡大されます。
* 変数(\V[n])が利用できます。
*
* ・alpha,angle：不透明度及び角度パラメータ
* 数字のみ記入すると、不透明度の場合[(完全透明)0-255(完全不透明)]に合わせた不
* 透明度、角度の場合°[0-360(1周)]の指定になります。
* 「50%」のように%を付与すると、半透明もしくは１周の半分の角度になります。
* 「by30」のようにbyを付与すると、現在値の+30になります。
* 変数(\V[n])が利用できます。
*
* ---動作確認---
* コアスクリプト：v1.3.0
* 本プラグインの動作にはPluginCommonBaseが必要です。
* PluginCommonBase: https://triacontane.blogspot.com/2020/08/rpgmz.html


* @param autoDeleteEvent
* @text イベント自動削除ピクチャ
* @desc 指定した番号のピクチャはイベント終了時に自動で削除されます。「,」による複数指定、「-」による連番指定が可能です。
* @default 
* @type string

* @param autoSetPict
* @text プリセットピクチャ
* @desc ピクチャを表示したときに自動的に座標や拡大率を設定します。
* @type struct<AutoSetting>[]
* @default []


* @command PICTUNER_TEMP_SHOW
* @text プリセットを用いてピクチャを表示
* @desc プリセットピクチャの設定に基づいてピクチャを表示します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string


* @command PICTUNER_TEMP_SHOW_IMAGE
* @text プリセットを用いてピクチャを表示(画像指定)
* @desc プリセットピクチャの設定に基づいてピクチャを表示します。画像を個別に指定可能です。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg imageFile
* @text ピクチャ画像
* @desc ピクチャ画像を指定します。画像IDが指定されている場合はそちらが優先されます。
* @type file
* @dir img/pictures
*
* @arg imageID
* @text 画像ID
* @desc ファイル以外からピクチャを指定します。\E[n]:エネミー画像
* @default
* @type string


* @command PICTUNER_DISPLAY
* @text ピクチャを表示
* @desc 通常のイベントコマンドのようにピクチャを表示します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg imageFile
* @text ピクチャ画像
* @desc ピクチャ画像を指定します。画像IDが指定されている場合はそちらが優先されます。
* @type file
* @dir img/pictures
*
* @arg imageID
* @text 画像ID
* @desc ファイル以外からピクチャを指定します。\E[n]:エネミー画像
* @default
* @type string
*
* @arg anchor
* @text アンカー
* @desc アンカー(原点)を指定します。
* @type select
* @default 0
* @option 左上
* @value 0
* @option 中央
* @value 1
* @option 右下
* @value 2
* @option 中央上
* @value 3
* @option 右上
* @value 4
* @option 左中央
* @value 5
* @option 右中央
* @value 6
* @option 左下
* @value 7
* @option 中央下
* @value 8
*
* @arg x
* @text x座標
* @desc X座標を設定します。「%」を付けると画面の左を0%、右を100%とした割合で指定できます。
* @default 0
* @type string
*
* @arg y
* @text y座標
* @desc Y座標を設定します。「%」を付けると画面の上を0%、下を100%とした割合で指定できます。
* @default 0
* @type string
*
* @arg w
* @text 横方向の拡大率
* @desc 横方向の拡大率を指定します。「%」「px」を利用できます。
* @default 100
* @type string
*
* @arg h
* @text 縦方向の拡大率
* @desc 縦方向の拡大率を指定します。「%」「px」を利用できます。
* @default 100
* @type string
*
* @arg opacity
* @text 不透明度
* @desc 不透明度を指定します。「%」を付けると100% = 255(完全不透明)となるように換算します。
* @default 255
* @type string
*
* @arg blendMode
* @text 合成方法
* @desc 合成方法を指定します。
* @type select
* @default normal
* @option 通常
* @value normal
* @option 加算
* @value add
* @option 乗算
* @value multiply
* @option スクリーン
* @value screen
* @option 減算
* @value subtract
*
* @arg red
* @text トーン赤
* @desc トーンの赤色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255
*
* @arg green
* @text トーン緑
* @desc トーンの緑色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255
*
* @arg blue
* @text トーン青
* @desc トーンの青色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255
*
* @arg black
* @text トーン黒
* @desc トーンの黒色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255
*
* @arg angle
* @text 角度
* @desc 角度を指定します。「%」を付けると100% = 360(1周)となるように換算します。
* @default 0
* @type string


* @command PICTUNER_SET_ANCHOR
* @text ピクチャにアンカーを設定
* @desc ピクチャにアンカー(原点)を設定します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg anchor
* @text アンカー
* @desc アンカーを指定します。
* @type select
* @default 0
* @option 左上
* @value 0
* @option 中央
* @value 1
* @option 右下
* @value 2
* @option 中央上
* @value 3
* @option 右上
* @value 4
* @option 左中央
* @value 5
* @option 右中央
* @value 6
* @option 左下
* @value 7
* @option 中央下
* @value 8


* @command PICTUNER_SET_POS
* @text ピクチャを指定座標へ移動
* @desc ピクチャを指定座標へ移動します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg x
* @text 移動先x座標
* @desc 移動先x座標を指定します。「%」「by」「TOUCH」を利用できます。
* @default 0
* @type string
*
* @arg y
* @text 移動先y座標。
* @desc 移動先y座標を指定します。「%」「by」「TOUCH」を利用できます。
* @default 0
* @type string


* @command PICTUNER_SET_SCALE
* @text ピクチャを指定の大きさへ拡縮
* @desc ピクチャを指定の大きさへ拡縮します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg w
* @text 横方向の拡大率
* @desc 横方向の拡大率を指定します。「%」「by」「px」を利用できます。
* @default 0
* @type string
*
* @arg h
* @text 縦方向の拡大率
* @desc 縦方向の拡大率を指定します。「%」「by」「px」を利用できます。
* @default 0
* @type string


* @command PICTUNER_SET_ALPHA
* @text ピクチャを指定の透明度へ変更
* @desc ピクチャを指定の透明度へ変更へ変更します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg opacity
* @text 不透明度
* @desc 不透明度を指定します。「%」を付けると100% = 255(完全不透明)となるように換算します。
* @default 0
* @type string


* @command PICTUNER_SET_ANGLE
* @text ピクチャを指定の角度へ変更
* @desc ピクチャを指定の角度へ変更します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg angle
* @text 角度
* @desc 角度を指定します。「%」を付けると100% = 360(1周)となるように換算します。
* @default 0
* @type string


* @command PICTUNER_SET_PARENT
* @text ピクチャに親ピクチャを設定
* @desc ピクチャに親ピクチャを設定します。
*
* @arg pictID
* @text 子のピクチャ番号
* @desc 子のピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*
* @arg parentID
* @text 親のピクチャ番号
* @desc 親のピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type number


* @command PICTUNER_RELEASE_PARENT
* @text ピクチャの親ピクチャを解除
* @desc ピクチャの親ピクチャ指定を解除します。
*
* @arg pictID
* @text 子のピクチャID
* @desc 子のピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string


* @command PICTUNER_ERASE
* @text ピクチャを消去
* @desc 指定したピクチャを消去します。
*
* @arg pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定、変数の使用(\V[n])が可能です。
* @default 1
* @type string
*/


/*~struct~AutoSetting:ja
* @param pictID
* @text ピクチャ番号
* @desc ピクチャ番号を指定します。「,」による複数指定、「-」による連番指定が可能です。
* @default 1
* @type number
* @max 100
* @min 1
*
* @param imageFile
* @text ピクチャ画像
* @desc ピクチャ画像を指定します。画像IDが指定されている場合はそちらが優先されます。
* @type file
* @dir img/pictures
*
* @param imageID
* @text 画像ID
* @desc pictureフォルダ以外からピクチャを指定します。例：ENEMY[n]でn番目のエネミー画像を表示できます。
* @default
* @type string

* @param anchor
* @text アンカー
* @desc アンカー(原点)を指定します。
* @type select
* @default 0
* @option 左上
* @value 0
* @option 中央
* @value 1
* @option 右下
* @value 2
* @option 中央上
* @value 3
* @option 右上
* @value 4
* @option 左中央
* @value 5
* @option 右中央
* @value 6
* @option 左下
* @value 7
* @option 中央下
* @value 8

* @param x
* @text x座標
* @desc X座標を設定します。「%」を付けると画面の左を0%、右を100%とした割合で指定できます。
* @default 0
* @type string

* @param y
* @text y座標
* @desc Y座標を設定します。「%」を付けると画面の上を0%、下を100%とした割合で指定できます。
* @default 0
* @type string

* @param w
* @text 横方向の拡大率
* @desc 横方向の拡大率を指定します。「%」「px」を利用できます。
* @default 100
* @type string

* @param h
* @text 縦方向の拡大率
* @desc 縦方向の拡大率を指定します。「%」「px」を利用できます。
* @default 100
* @type string

* @param opacity
* @text 不透明度
* @desc 不透明度を指定します。「%」を付けると100% = 255(完全不透明)となるように換算します。
* @default 255
* @type string

* @param blendMode
* @text 合成方法
* @desc 合成方法を指定します。
* @type select
* @default normal
* @option 通常
* @value normal
* @option 加算
* @value add
* @option 乗算
* @value multiply
* @option スクリーン
* @value screen
* @option 減算
* @value subtract

* @param red
* @text トーン赤
* @desc トーンの赤色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255

* @param green
* @text トーン緑
* @desc トーンの緑色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255

* @param blue
* @text トーン青
* @desc トーンの青色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255

* @param black
* @text トーン黒
* @desc トーンの黒色を指定します。-255～255まで設定できます。
* @default 0
* @type number
* @max 255
* @min -255

* @param angle
* @text 角度
* @desc 角度を指定します。「%」を付けると100% = 360(1周)となるように換算します。
* @default 0
* @type string
*/



(() => {
    'use strict';
    const script = document.currentScript;
	const param  = PluginManagerEx.createParameter(script);

	//-------------------------------------------------------------------------------------------------
	//	Plugin command
    //-------------------------------------------------------------------------------------------------
	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_TEMP_SHOW", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setImageFile(v, '', '');
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_TEMP_SHOW_IMAGE", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setImageFile(v, args.imageFile, args.imageID);	
		});
	});
	
	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_DISPLAY", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			let b = PIXI.BLEND_MODES.NORMAL;
			if(args.blendMode == "add") b = PIXI.BLEND_MODES.ADD;
			if(args.blendMode == "multiply") b = PIXI.BLEND_MODES.MULTIPLY;
			if(args.blendMode == "screen") b = PIXI.BLEND_MODES.SCREEN;
			if(args.blendMode == "subtract") b = PIXI.BLEND_MODES.SUBTRACT;

			const as = {fileName:args.imageFile, anchor:args.anchor, x:args.x, y:args.y, w:args.w, h:args.h, angle:args.angle, opacity:args.opacity, blendMode:b, red:args.red, green:args.green, blue:args.blue, black:args.black};
			ZinPictuner.setImageFile(v, args.imageFile, args.imageID, as);	
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_ANCHOR", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setAnchor(v, args.anchor);
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_POS", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setPos(v, args.x, args.y);
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_SCALE", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setScale(v, args.w, args.h);
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_ALPHA", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setAlpha(v, args.opacity);
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_ANGLE", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			ZinPictuner.setAngle(v, args.angle);
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_SET_PARENT", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			const picture = $gameScreen.picture(v);
			if(picture){
				picture._parentID = args.parentID;
			}
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_RELEASE_PARENT", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			const picture = $gameScreen.picture(v);
			if(picture){
				picture._parentID = null;
			}
		});
	});

	PluginManagerEx.registerCommand(document.currentScript, "PICTUNER_ERASE", args => {
		const pictureIdList = ZinPictuner.convertPictID(args.pictID);
		pictureIdList.forEach(v=>{
			$gameScreen.erasePicture(v);
		});
	});
    

    //-------------------------------------------------------------------------------------------------
    // Static Class
    //-------------------------------------------------------------------------------------------------
	function ZinPictuner() {
		throw new Error('This is a static class');
	}

	// 初期化
	ZinPictuner.initialize = function(){
		// パラメータ配列をグローバル変数に変換する
		const asList = param.autoSetPict;
		this._settingParams = Array.from({ length: 100 });
		asList.forEach(a=>{
			let b = PIXI.BLEND_MODES.NORMAL;
			if(a.blendMode == "add") b = PIXI.BLEND_MODES.ADD;
			if(a.blendMode == "multiply") b = PIXI.BLEND_MODES.MULTIPLY;
			if(a.blendMode == "screen") b = PIXI.BLEND_MODES.SCREEN;
			if(a.blendMode == "subtract") b = PIXI.BLEND_MODES.SUBTRACT;
			let as = {v:a.pictID, imageFile:a.imageFile, imageID:a.imageID, x:a.x, y: a.y, anchor:a.anchor, w:a.w, h:a.h, angle:a.angle, opacity:a.opacity, blendMode:b, red:a.red, green:a.green, blue:a.blue, black:a.black};
			if(a.pictID > 0 && a.pictID < 100){
				this._settingParams[a.pictID-1]= as;
			}
			
		});

		// 自動削除ピクチャを登録
		this._autoDeleteList = ZinPictuner.convertPictID(param.autoDeleteEvent);
	};

	// ピクチャの表示と一括設定
	ZinPictuner.showAndSet = function(v, as) {
		$gameScreen.showPicture(v, as.fileName, 0, -1000, -1000, 100, 100, 255, as.blendMode);
		$gameScreen.tintPicture(v, [as.red, as.green, as.blue, as.black], 0);
		ZinPictuner.setAnchor(v, as.anchor);
		ZinPictuner.setPos(v, as.x, as.y, true);
		ZinPictuner.setScale(v, as.w, as.h, true);
		ZinPictuner.setAlpha(v, as.opacity);
		ZinPictuner.setAngle(v, as.angle);
	};

	// 表示ピクチャファイルの設定
	ZinPictuner.setImageFile = function(v, _imageFile, _imageID, _as = null) {
		let preText = _imageID;
		let text = '';
		let obj;

		let as = {fileName:_imageFile, anchor:'0', x:'0', y:'0', w:'100', h:'100', angle:'0', opacity:'255', blendMode:PIXI.BLEND_MODES.NORMAL, red:0, green:0, blue:0, black:0};
		if(_as) as = _as;

		// 登録されているピクチャ番号なら、設定を優先的に適用
		if(ZinPictuner._settingParams[v-1]){
			const a = ZinPictuner._settingParams[v-1];
			if(!_imageFile) as.fileName = a.imageFile;
			if(!_imageID) preText = a.imageID;
			as.anchor = a.anchor;
			as.x = a.x;
			as.y = a.y;
			as.w = a.w;
			as.h = a.h;
			as.angle = a.angle;
			as.opacity = a.opacity;
			as.blendMode = a.blendMode;
			as.red = a.red;
			as.green = a.green;
			as.blue = a.blue;
			as.black = a.black;
		}

		if(preText){
			// エネミー画像を設定
			text = preText.replace(/ENEMY\[(\d+)]/gi, (_, p1) =>
			(obj = $dataEnemies[parseInt(p1)]) ? $dataEnemies[parseInt(p1)].battlerName : ''
			);
			if(obj){
				if(ZinPictuner.fromMemo(v, preText, obj, as)) return;
				
				as.fileName = obj.battlerName;
				ZinPictuner.showAndSet(v, as);
				$gameScreen.picture(v)._isEnemy = true;			
				return;
			}
			
			// フェイス画像を設定
			text = preText.replace(/ACTOR\[(\d+)]/gi, (_, p1) =>
			(obj = $dataActors[parseInt(p1)]) ? obj.faceName : ''
			);
			if(obj){
				if(ZinPictuner.fromMemo(v, preText, obj, as)) return;

				as.fileName = obj.faceName;
				ZinPictuner.showAndSet(v, as);
				$gameScreen.picture(v)._isActorFace = true;
				$gameScreen.picture(v)._pt_FaceIndex = obj.faceIndex;
				return;
			}

			// アイコンをピクチャとして設定
			let p = null;
			p = ZinPictuner.getIcon(v, preText, $dataWeapons, /WEAPON\[(\d+)]/gi, as);
			if(p) return;
			p = ZinPictuner.getIcon(v, preText, $dataArmors, /ARMOR\[(\d+)]/gi, as);
			if(p) return;
			p = ZinPictuner.getIcon(v, preText, $dataItems, /ITEM\[(\d+)]/gi, as);
			if(p) return;
			p = ZinPictuner.getIcon(v, preText, $dataSkills, /SKILL\[(\d+)]/gi, as);
			if(p) return;
			p = ZinPictuner.getIcon(v, preText, $dataStates, /STATE\[(\d+)]/gi, as);
			if(p) return;
			if(preText.match(/ICON/)){
				p = ZinPictuner.setPictunerIcon(v, preText.replace(/ICON\[(\d+)]/gi, (_, p1) => parseInt(p1)), as);
				return;
			}

			// パーティの情報からピクチャを設定
			text = preText.replace(/PARTY\[(\d+)]/gi, (_, p1) =>
			(obj = $gameParty.members()[parseInt(p1)-1]) ? '' : '');
			if(obj){
				
				// フェイス画像
				if(text.match(/FACE/)){
					if(ZinPictuner.fromMemo(v, text, obj, as)) return;

					as.fileName = obj._faceName;
					ZinPictuner.showAndSet(v, as);
					$gameScreen.picture(v)._isActorFace = true;
					$gameScreen.picture(v)._pt_FaceIndex = obj._faceIndex;
					return;
				}

				// 装備のアイコン
				text = text.replace(/EQUIP\[(\d+)]/gi, (_, p1) =>
				(p = obj.equips()[parseInt(p1)-1]) ? p.iconIndex : '');
				if(p){
					if(ZinPictuner.fromMemo(v, text, p, as)) return;
					ZinPictuner.setPictunerIcon(v, p.iconIndex, as);
					return;
				}

				// ステートのアイコン
				text = text.replace(/STATUS\[(\d+)]/gi, (_, p1) =>
				(p = obj.states()[parseInt(p1)-1]) ? p.iconIndex : '');
				if(p){
					if(ZinPictuner.fromMemo(v, text, p, as)) return;
					ZinPictuner.setPictunerIcon(v, p.iconIndex, as);
					return;
				}
			}

			// 戦闘中のみ、敵グループからピクチャを設定
			text = preText.replace(/TROOP\[(\d+)]/gi, (_, p1) =>
			(obj = $gameTroop.members()[parseInt(p1)-1]) ? '' : '');
			if(obj){
				// エネミー画像
				if(text.match(/FACE/)){
					if(ZinPictuner.fromMemo(v, text, obj, as)) return;

					as.fileName = obj.battlerName();
					ZinPictuner.showAndSet(v, as);
					$gameScreen.picture(v)._isEnemy = true;
					return;
				}

				// ステートのアイコン
				text = text.replace(/STATUS\[(\d+)]/gi, (_, p1) =>
				(p = obj.states()[parseInt(p1)-1]) ? p.iconIndex : '');
				if(p){
					if(ZinPictuner.fromMemo(v, text, p, as)) return;
					ZinPictuner.setPictunerIcon(v, p.iconIndex, as);
					return;
				}
			}

		}else{
			if(as.fileName){
				// 通常のピクチャ表示
				ZinPictuner.showAndSet(v, as);
			}
		}
	}

	// アンカーの設定
	ZinPictuner.setAnchor = function(v, anchor){
		const picture = $gameScreen.picture(v);
		if(picture){
			picture._origin = anchor;
		}
	};

	// ピクチャの座標設定
	ZinPictuner.setPos = function(v, xText, yText, initFlag=false){
		const picture = $gameScreen.picture(v);
		if(picture){
			let xData = {v:0,perFlag:false,byFlag:false};
			let yData = {v:0,perFlag:false,byFlag:false};
			ZinPictuner.convertValue(xText,true,xData);
			ZinPictuner.convertValue(yText,false,yData);

			if(!initFlag){
				picture._x = xData.v;
				picture._pictuner_fPosXPercent = xData.perFlag;
				picture._pictuner_fPosXBy = xData.byFlag;
				picture._y = yData.v;
				picture._pictuner_fPosYPercent = yData.perFlag;
				picture._pictuner_fPosYBy = yData.byFlag;
			}else{
				if(xData.perFlag){
					picture._x = xData.v * 0.01 * Graphics.boxWidth + uiOffset;
				}else{
					picture._x = xData.v;
				}
				if(yData.perFlag){
					picture._y = yData.v * 0.01 * Graphics.boxHeight + uiOffset;
				}else{
					picture._y = yData.v;
				}
			}
		}
	};

	// ピクチャの拡大
	ZinPictuner.setScale = function(v, wText, hText, initFlag=false){
		const picture = $gameScreen.picture(v);
		if(picture){
			let xData = {v:0,perFlag:false,pixelFlag:false};
			let yData = {v:0,perFlag:false,pixelFlag:false};
			ZinPictuner.convertScale(wText,true,xData);
			ZinPictuner.convertScale(hText,false,yData);

			if(!initFlag){
				picture._scaleX = xData.v;
				picture._pictuner_fScaleXPercent = xData.perFlag;
				picture._pictuner_fScaleXPixel = xData.pixelFlag;
				picture._scaleY = yData.v;
				picture._pictuner_fScaleYPercent = yData.perFlag;
				picture._pictuner_fScaleYPixel = yData.pixelFlag;
			}else{
				if(xData.perFlag){
					picture._scaleX = xData.v * Graphics.boxWidth / picture._imageWidth;
				}else{
					picture._scaleX = xData.v;
				}
				if(yData.perFlag){
					picture._scaleY = yData.v * Graphics.boxHeight / picture._imageHeight;
				}else{
					picture._scaleY = yData.v;
				}
				if(xData.pixelFlag) picture._scaleX  = xData.v / picture._imageWidth * 100;
				if(yData.pixelFlag) picture._scaleY  = yData.v / picture._imageHeight * 100;		
			}
		}
	};

	// ピクチャの透過度
	ZinPictuner.setAlpha = function(v, opacity){
		const picture = $gameScreen.picture(v);
		if(picture){
			picture._opacity = ZinPictuner.convertAlpha(opacity);
		}
	};

	// ピクチャの角度
	ZinPictuner.setAngle = function(v, angle){
		const picture = $gameScreen.picture(v);
		if(picture){
			picture._angle = ZinPictuner.convertAngle(angle, picture.angle());
		}
	};

	// 指定番号のアイコンをセット
	ZinPictuner.setPictunerIcon = function(v, index, as) {
		as.fileName = 'IconSet';
		ZinPictuner.showAndSet(v, as);
		$gameScreen.picture(v)._pt_isIcon = true;
		$gameScreen.picture(v)._pt_IconIndex = index;
		return $gameScreen.picture(v);
	};

	// データセットからアイコン番号を抽出
	ZinPictuner.getIcon = function(v, preText, dataSet, pattern, as) {
		let obj = null;
		const text = preText.replace(pattern, (_, p1) =>
		(dataSet && (obj = dataSet[parseInt(p1)])) ? 'IconSet' : '');
		if(obj){
			if(ZinPictuner.fromMemo(v, preText, obj)) return;
			return ZinPictuner.setPictunerIcon(v, obj.iconIndex, as);
		}else{
			return null;
		}
	};

	// メモからピクチャ生成
	ZinPictuner.fromMemo = function(v, text, obj, as) {
		let memo;
		if(text.match(/MEMO/) && (memo = PluginManagerEx.findMetaValue(obj, 'PICTUNER_IMG'))){
			as.fileName = memo;
			ZinPictuner.showAndSet(as);
			return $gameScreen.picture(v);
		}
		return null;
	};


	// ピクチャ指定文字列からピクチャ配列に変換する
	ZinPictuner.convertPictID = function(pictIDStr) {
		if(typeof(pictIDStr) != "string") return [pictIDStr];

		let pictIDStr2 = pictIDStr.split(',');
		let a;
		let result = [];

		//各配列に対して、
		pictIDStr2.forEach(v=>{
			//ハイフンで区切る
			a = v.split('-');

			//長さが1なら、それが数字ならピクチャ番号に追加
			if(a.length == 1){
				if(!Number.isNaN(a[0])) result.push(Number(a[0]));
			}else{
				//長さが2以上なら、最初と最後を参照し、それらが数字なら、連番でピクチャ番号に追加
				if(!Number.isNaN(a[0]) && !Number.isNaN(a[a.length-1])){
					const startNum = Number(a[0]);
					if(startNum <= 0) startNum = 1;
					for(let i = startNum; i < a[a.length-1] && i < $gameScreen.maxPictures(); i++){
						result.push(i);
					}
				}
			}	
		});

		return result;
	};

	//%表示や変数指定を解析する
	ZinPictuner.convertValue = function(val, xFlag=true, result) {
		let v = String(val);
		if(!Number.isNaN((Number(v)))){
			result.v = Number(v);
			return;
		}

		// 他のピクチャ座標を参照する
		if(xFlag){
			v = v.replace(/PIC\[(\d+)]/gi, (_, p1) => 
				($gameScreen && $gameScreen.picture(parseInt(p1))) ? $gameScreen.picture(parseInt(p1)).x() : ''
			);
		}else{
			v = v.replace(/PIC\[(\d+)]/gi, (_, p1) => 
				($gameScreen && $gameScreen.picture(parseInt(p1))) ? $gameScreen.picture(parseInt(p1)).y() : ''
			);
		}

		let num = Number(v.replace(/[^0-9|^\.|^-]/g, ''));

		if(v.indexOf('%') >= 0) result.perFlag = true;
		if(v.indexOf('by') >= 0) result.byFlag = true;

		if(/TOUCH/i.test(v)){
			if(xFlag){
				num = TouchInput.x;
			}else{
				num = TouchInput.y;
			}
		}

		if(Number.isNaN(num)){
			result.v = 0;
		}else{
			result.v = num;
		}
	};

	//%表示や変数指定を解析する(スケール)
	ZinPictuner.convertScale = function(val, xFlag=true, result) {
		let v = String(val);
		if(!Number.isNaN((Number(v)))){
			result.v = Number(v);
			return;
		}

		// 他のピクチャ拡大率を参照する
		if(xFlag){
			v = v.replace(/PIC\[(\d+)]/gi, (_, p1) => 
				($gameScreen && $gameScreen.picture(parseInt(p1))) ? $gameScreen.picture(parseInt(p1)).scaleX() : ''
			);
		}else{
			v = v.replace(/PIC\[(\d+)]/gi, (_, p1) => 
				($gameScreen && $gameScreen.picture(parseInt(p1))) ? $gameScreen.picture(parseInt(p1)).scaleY() : ''
			);
		}

		let num = Number(v.replace(/[^0-9|^\.|^-]/g, ''));

		if(v.indexOf('%') >= 0) result.perFlag = true;
		if(v.indexOf('px') >= 0) result.pixelFlag = true;
		

		if(Number.isNaN(num)){
			result.v = 0;
		}else{
			result.v = num;
		}
	};

	//%表示や変数指定を解析する(透明度向け)
	ZinPictuner.convertAlpha = function(val) {
		let v = String(val);
		if(!Number.isNaN((Number(v)))) return Number(v);

		let num = Number(v.replace(/[^0-9|^\.|^-]/g, ''));

		let perFlag = false;
		if(v.indexOf('%') >= 0) perFlag = true;

		let byFlag = false;
		if(v.indexOf('by') >= 0) byFlag = true;

		if(Number.isNaN(num)) return 0;
		if(perFlag){
			if(byFlag){
				return currentRot + num * 2.55;
			}else{
				return num * 2.55;
			}
		}else{
			if(byFlag){
				return currentRot + num;
			}else{
				return num;
			}
		}
	};

	//%表示や変数指定を解析する(角度)
	ZinPictuner.convertAngle = function(val,currentRot) {
		let v = String(val);
		if(!Number.isNaN((Number(v)))) return Number(v);

		let num = Number(v.replace(/[^0-9|^\.|^-]/g, ''));

		let perFlag = false;
		if(v.indexOf('%') >= 0) perFlag = true;

		let byFlag = false;
		if(v.indexOf('by') >= 0) byFlag = true;

		if(Number.isNaN(num)) return 0;
		if(perFlag){
			if(byFlag){
				return currentRot + num * 3.60;
			}else{
				return num * 3.60;
			}
		}else{
			if(byFlag){
				return currentRot + num;
			}else{
				return num;
			}
		}
	};

	// 基準点から回転行列を計算する
	ZinPictuner.rotation = function(px,py,sx,sy,angle) {
		//自身の計算後のx,y座標との差分を計算する
		let x = sx - px;
		let y = sy - py;

		//回転行列から、変換後の座標を計算する
		const rad = angle * Math.PI / 180;
		const x2 = px + Math.cos(rad) * x - Math.sin(rad) * y;
		const y2 = py + Math.sin(rad) * x + Math.cos(rad) * y;

		return [x2,y2];
	};

	

	//-------------------------------------------------------------------------------------------------
	// Sprite_Picture拡張
	//-------------------------------------------------------------------------------------------------
	const anchorX = [0, 0.5, 1.0, 0.5, 1.0, 0, 1.0, 0, 0.5];
	const anchorY = [0, 0.5, 1.0, 0, 0, 0.5, 0.5, 1.0, 1.0];
	const uiOffset = 8;

	const _Sprite_Picture_prototype_updateOrigin = Sprite_Picture.prototype.updateOrigin;
	Sprite_Picture.prototype.updateOrigin = function() {
		_Sprite_Picture_prototype_updateOrigin.apply(this,arguments);
		const picture = this.picture();
		if(picture.origin() > 1 && picture.origin() < 9){
			this.anchor.x = anchorX[picture.origin()];
			this.anchor.y = anchorY[picture.origin()];
		}
	};

	const _Sprite_Picture_prototype_updatePosition = Sprite_Picture.prototype.updatePosition;
	Sprite_Picture.prototype.updatePosition = function() {
		_Sprite_Picture_prototype_updatePosition.apply(this,arguments);
		const picture = this.picture();
		if(picture._parentID){
			const p2 = $gameScreen.picture(picture._parentID);
			if(p2 && p2._imageWidth){
				if(picture._pictuner_fPosXPercent){ picture._x = picture.x() * 0.01 * p2._imageWidth; picture._pictuner_fPosXPercent = false;}
				if(picture._pictuner_fPosYPercent){ picture._y = picture.y() * 0.01 * p2._imageHeight; picture._pictuner_fPosYPercent = false;}
				this.x = picture.x() * p2.scaleX() * 0.01;
				this.y = picture.y() * p2.scaleY() * 0.01;
				
				this.x += Math.round(p2.x() - p2._imageWidth * anchorX[p2.origin()] * p2.scaleX() * 0.01);
				this.y += Math.round(p2.y() - p2._imageHeight * anchorY[p2.origin()] * p2.scaleY() * 0.01);
			}		
		}else{
			if(picture._pictuner_fPosXPercent){ picture._x = picture.x() * 0.01 * Graphics.boxWidth + uiOffset; picture._pictuner_fPosXPercent = false;}
			if(picture._pictuner_fPosYPercent){ picture._y = picture.y() * 0.01 * Graphics.boxHeight + uiOffset; picture._pictuner_fPosYPercent = false;}
		}
	};

	
	const _Sprite_Picture_prototype_updateScale = Sprite_Picture.prototype.updateScale;
	Sprite_Picture.prototype.updateScale = function() {
		_Sprite_Picture_prototype_updateScale.apply(this,arguments);
		const picture = this.picture();
		if(picture._parentID){
			const p2 = $gameScreen.picture(picture._parentID);
			if(p2 && p2._imageWidth){			
				if(picture._pictuner_fScaleXPercent){ picture._scaleX = picture.scaleX() * p2._imageWidth / picture._imageWidth; picture._pictuner_fScaleXPercent = false;}
				if(picture._pictuner_fScaleXPixel){ picture._scaleX  = picture.scaleX() / picture._imageWidth * 100 / (p2.scaleX() * 0.01); picture._pictuner_fScaleXPixel = false;}
				if(picture._pictuner_fScaleYPercent){ picture._scaleY = picture.scaleY() * p2._imageHeight / picture._imageHeight; picture._pictuner_fScaleYPercent = false;}
				if(picture._pictuner_fScaleYPixel){ picture._scaleY  = picture.scaleY() / picture._imageHeight * 100 / (p2.scaleY() * 0.01); picture._pictuner_fScaleYPixel = false;}

				this.scale.x = picture.scaleX() * 0.01;
				this.scale.y = picture.scaleY() * 0.01;
				this.scale.x *= p2.scaleX() * 0.01;
				this.scale.y *= p2.scaleY() * 0.01;	
			}
		}else{
			if(picture._pictuner_fScaleXPercent){ picture._scaleX = picture.scaleX() * Graphics.boxWidth / picture._imageWidth; picture._pictuner_fScaleXPercent = false;}
			if(picture._pictuner_fScaleXPixel){ picture._scaleX  = picture.scaleX() / picture._imageWidth * 100; picture._pictuner_fScaleXPixel = false;}
			if(picture._pictuner_fScaleYPercent){ picture._scaleY = picture.scaleY() * Graphics.boxHeight / picture._imageHeight; picture._pictuner_fScaleYPercent = false;}
			if(picture._pictuner_fScaleYPixel){ picture._scaleY  = picture.scaleY() / picture._imageHeight * 100; picture._pictuner_fScaleYPixel = false;}
		}
		
	};

	const _Sprite_Picture_prototype_updateOther = Sprite_Picture.prototype.updateOther;
	Sprite_Picture.prototype.updateOther = function() {
		_Sprite_Picture_prototype_updateOther.apply(this,arguments);
		
		const picture = this.picture();
		if(picture._skewX){
			this.skew.x = picture._skewX;
			this.skew.y = picture._skewY;
		}

		if(picture._parentID){
			const p2 = $gameScreen.picture(picture._parentID);
			if(p2 && p2._imageWidth){
				// 回転角度を補正
				const result = ZinPictuner.rotation(p2.x(),p2.y(),this.x,this.y,p2.angle());
				this.x = result[0];
				this.y = result[1];

				this.rotation += (p2.angle() * Math.PI) / 180;	//角度の更新
				this.opacity *= p2.opacity() / 255;	//透過率の更新
			}
		}
	};

	const _Sprite_Picture_prototype_updateBitmap = Sprite_Picture.prototype.updateBitmap;
	Sprite_Picture.prototype.updateBitmap = function() {
		_Sprite_Picture_prototype_updateBitmap.apply(this,arguments);
		const picture = this.picture();
		if(picture){
			picture._imageWidth = this.width;
			picture._imageHeight = this.height;
		}
	};

	const _Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap;
	Sprite_Picture.prototype.loadBitmap = function() {
		const picture = this.picture();
		if(picture){
			if(picture._isEnemy){
				if ($gameSystem.isSideView()) {
					this.bitmap = ImageManager.loadSvEnemy(this._pictureName);
				} else {
					this.bitmap = ImageManager.loadEnemy(this._pictureName);
				}
				return;
			}
			if(picture._isActorFace){
				this.bitmap = ImageManager.loadFace(this._pictureName);
				this.setTrim(picture._pt_FaceIndex, ImageManager.faceWidth, ImageManager.faceHeight, 4);
				return;
			}
			if(picture._pt_isIcon){
				this.bitmap = ImageManager.loadSystem(this._pictureName);
				this.setTrim(picture._pt_IconIndex, ImageManager.iconWidth, ImageManager.iconHeight, 16);
				return;
			}
		}
		_Sprite_Picture_prototype_loadBitmap.apply(this,arguments);
	};

	// 画像を切り取る
	Sprite_Picture.prototype.setTrim = function(
		faceIndex, w, h, wide
	) {
		const x = (faceIndex) % wide;
		const y = Math.floor((faceIndex) / wide);

		const dx = Math.floor(x * w);
		const dy = Math.floor(y * h);
		const sx = Math.floor(w);
		const sy = Math.floor(h);
		this.setFrame(dx, dy, sx, sy );
	};


	//-------------------------------------------------------------------------------------------------
	// Game_Interpreter拡張
	//-------------------------------------------------------------------------------------------------
	const _Game_Interpreter_prototype_update = Game_Interpreter.prototype.update;
	Game_Interpreter.prototype.update = function() {
		_Game_Interpreter_prototype_update.apply(this,arguments);
		if(!this.isRunning()){
			ZinPictuner._autoDeleteList.forEach(v=>{
				if($gameScreen.picture(v)) $gameScreen.erasePicture(v);
			});
		}
	};

	//-------------------------------------------------------------------------------------------------
	//	Scene_Boot.prototype.initialize
	//-------------------------------------------------------------------------------------------------
	const Scene_Boot_prototype_initialize = Scene_Boot.prototype.initialize;
	Scene_Boot.prototype.initialize = function() {
		Scene_Boot_prototype_initialize.apply(this,arguments);
		ZinPictuner.initialize();
	};

})();