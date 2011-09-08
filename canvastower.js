
var CanvasTower = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower',
	VERSION : '1.0'
});
/*- policka -*/
CanvasTower.Konstant = {};
CanvasTower.Konstant['none'] = { name : 'none', color : '#1a2e2f' };
CanvasTower.Konstant['road'] = { name : 'road', color : '#755252', img : JAK.mel('img', { src : './img/road.png'}) };
CanvasTower.Konstant['place'] = { name : 'place', color : '#cccccc', img : JAK.mel('img', { src : './img/place.png' }) };
CanvasTower.Konstant['tower'] = { name : 'tower', color : '#000', img : JAK.mel('img', { src : './img/kanon.png' }) };
CanvasTower.Konstant['start'] = { name : 'start', color : 'green' };
CanvasTower.Konstant['end'] = { name : 'end', color : 'red' };
/*- nepratele -*/
CanvasTower.Enemy = {};
CanvasTower.Enemy['SOLDIER'] = {
	width:16,
	height:21,
	hp:100,
	interval : 1000,
	img : { right : JAK.mel('img', { src:'./img/elf1.png' }), down : JAK.mel('img', { src:'./img/elf.png' }), up : JAK.mel('img', {src:'./img/elf2.png'}) }
};
/**
 * Constructor
 **/
CanvasTower.prototype.$constructor = function(canvasMap, canvasPlace){
	this.shoot = {};
	this.direction = null;
	this.interval = 1000;
	this.timekeeper = JAK.Timekeeper.getInstance();
	/*- prave jdouci nepritel -*/
	this.enemy = CanvasTower.Enemy.SOLDIER;
	/*- souradnice nepritele -*/
	this.enemyMove = { direction : '', coords : [0,0] };
	/*- rozvrzeni mapy -*/
	/*this.MAP = [
		['start' ,'road'  , 'road' , 'place' , 'place' , 'place' , 'place' , 'place' , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'road'  , 'road'  , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'place' , 'road'  , 'place' , 'place' , 'road'  , 'place' , 'none' ],
		['none'  ,'place' , 'road' , 'road'  , 'road'  , 'place' , 'place' , 'road'  , 'road'  , 'end'  ],
		['none'  ,'none'  , 'none' , 'none'  , 'none'  , 'none'  , 'none'  , 'none'  , 'none'  , 'none' ]
	];*/
	this.MAP = [[ 'start', 'road', 'road', 'road','road','road','road','road','road','end' ]];
	this.dom = {};
	this.ec = [];
	this.dom.canvasMap = JAK.gel(canvasMap);
	this.dom.canvasPlace = JAK.gel(canvasPlace);
	this.contextMap = this.dom.canvasMap.getContext('2d');
	this.contextPlace = this.dom.canvasPlace.getContext('2d');
	this._buildMap();
	this._buildSoldiers();
	this._link();
};
/**
 * Vytvoreni mapy
 **/
CanvasTower.prototype._buildMap = function(){
	var canvasWidth = this.dom.canvasMap.offsetWidth;
	var canvasHeight = this.dom.canvasMap.offsetHeight;
	this.canvasPointHeight = canvasHeight/this.MAP.length;
	this.canvasPointWidth = canvasWidth/this.MAP[0].length;
	var startPoint = 0;
	for(var i=0;i<this.MAP.length;i++){
		for(var j=0;j<this.MAP[i].length;j++){			
			if(CanvasTower.Konstant[this.MAP[i][j]].img){
				this.contextMap.drawImage(CanvasTower.Konstant[this.MAP[i][j]].img, j*this.canvasPointWidth, i*this.canvasPointHeight);
			} else {
				this.contextMap.fillStyle = CanvasTower.Konstant[this.MAP[i][j]].color;
				this.contextMap.fillRect( j*this.canvasPointWidth, i*this.canvasPointHeight, this.canvasPointWidth, this.canvasPointHeight );
			}
		}
	}
};
/**
 * Vytvoreni vojacka
 **/
CanvasTower.prototype._buildSoldiers = function(){
	var soldier = this.contextPlace.drawImage(this.enemy.img.right, 0,0);
	this.startGame();
};
/**
 * Start hry
 **/
CanvasTower.prototype.startGame = function(){
	var startCoords = {direction : '', coords : [], time : new Date().getTime() };
	for(var i=0;i<this.MAP.length;i++){
		for(var j=0;j<this.MAP[i].length;j++){
			if(this.MAP[i][j] == 'start'){
				startCoords.coords.push(i);
				startCoords.coords.push(j);
				break;
			}
		}
	}
	this.enemyMove = startCoords;
	this.ticker = this.timekeeper.addListener(this, "_animationManager", 2 );
	
	/*-this._moveSoldier();-*/
};

CanvasTower.prototype._animationManager = function(){
	var time = new Date().getTime();
	if(this.enemyMove.time < time){
		var coords = this._whereTo(this.enemyMove);
		if(coords){
			this._animateSoldier(coords);
		}
		if(this.moveEndCoords){
			this._finnishMove();
		}
	} else {
		var num = (((this.moveEndCoords.time-this.enemy.interval)-time)/this.enemy.interval*-1);
		this._posSoldier(num);
	}
};

/**
 * hledac cesty
 **/
CanvasTower.prototype._whereTo = function(coords){
	var goCoords = [];
	var index = 1;
	/*- vpravo -*/
	var cRight = { direction : 'right', coords : [coords.coords[0]] };
	if(coords.coords[1]+index >= this.MAP[0].length-1){
		cRight.coords.push(this.MAP[0].length-1);
	} else {
		cRight.coords.push(coords.coords[1]+index);
	}
	/*- vlevo -*/
	var cLeft = { direction : 'left', coords : [coords.coords[0]] };
	if(coords.coords[1]-index <= 0){
		cLeft.coords.push(0);
	} else {
		cLeft.coords.push(coords.coords[1]-index);
	}
	/*- nahoru -*/
	var cUp = { direction : 'up', coords : [] };
	if(coords.coords[0]-index <= 0){
		cUp.coords.push(0, coords.coords[1]);
	} else {
		cUp.coords.push(coords.coords[0]-index, coords.coords[1]);
	}
	/*- dolu -*/
	var cDown = { direction : 'down', coords : [] };
	if(coords.coords[0]+index >= this.MAP.length-1){
		cDown.coords.push(this.MAP.length-1, coords.coords[1]);
	} else {
		cDown.coords.push(coords.coords[0]+index, coords.coords[1]);
	}

	goCoords.push(cLeft, cRight, cUp, cDown);
	for(var i=0;i<goCoords.length;i++){
		if(this.MAP[goCoords[i].coords[0]][goCoords[i].coords[1]] == 'road' && (goCoords[i].coords.toString() != this.enemyMove.coords.toString())){
		    if(goCoords[i].direction == 'left' && this.enemyMove.direction == 'right'){
		        continue;
		    } else if(goCoords[i].direction == 'down' && this.enemyMove.direction == 'up'){
		        continue;
		    } else if(goCoords[i].direction == 'up' && this.enemyMove.direction == 'down'){
		        continue;
		    } else {
				goCoords[i].time = new Date().getTime()+this.enemy.interval;
				return goCoords[i];
				break;
			}
		}
	}
	return 0;
};
/**
 * start animace
 **/
CanvasTower.prototype._moveSoldier = function(){
	var coords = this._whereTo(this.enemyMove);
	if(coords){
		this._animateSoldier(coords)
	} else {
		return;
		alert('the end');
	}
};
/**
 * animace a pocitani pozice
 **/
CanvasTower.prototype._posSoldier = function(num){
	/*- podklad predchozi -*/
	var rectPos = [this.enemyMove.coords[1]*this.canvasPointWidth, this.enemyMove.coords[0]*this.canvasPointHeight];
	if(CanvasTower.Konstant[this.MAP[this.enemyMove.coords[0]][this.enemyMove.coords[1]]].img){
		this.contextPlace.drawImage(CanvasTower.Konstant[this.MAP[this.enemyMove.coords[0]][this.enemyMove.coords[1]]].img, rectPos[0], rectPos[1]);
	} else {
		this.contextPlace.fillStyle = 'blue';
		this.contextPlace.fillRect( rectPos[0], rectPos[1], this.canvasPointWidth, this.canvasPointHeight);
	}
	/*- podklad nasledujici -*/
	var rectPos = [this.moveEndCoords.coords[1]*this.canvasPointWidth, this.moveEndCoords.coords[0]*this.canvasPointHeight];
	if(CanvasTower.Konstant[this.MAP[this.moveEndCoords.coords[0]][this.moveEndCoords.coords[1]]].img){
		this.contextPlace.drawImage(CanvasTower.Konstant[this.MAP[this.moveEndCoords.coords[0]][this.moveEndCoords.coords[1]]].img, rectPos[0], rectPos[1]);
	} else {	
		this.contextPlace.fillStyle = CanvasTower.Konstant['road'].color;
		var rectPos = [this.moveEndCoords.coords[1]*this.canvasPointWidth, this.moveEndCoords.coords[0]*this.canvasPointHeight];
		this.contextPlace.fillRect( rectPos[0], rectPos[1], this.canvasPointWidth, this.canvasPointHeight);
	}
	/*- nepritel -*/
	var enemyImg = this.enemy.img[this.moveEndCoords.direction] || this.enemy.img['right'];
	var solLeft = ((this.endLeftPos-this.startLeftPos)*num)+this.startLeftPos;
	var solTop = ((this.endTopPos-this.startTopPos)*num)+this.startTopPos;
	var solPos = [solLeft, solTop];
	this.actualSolPos = solPos;
	this._isOnFire(solPos);
	var soldier = this.contextPlace.drawImage(enemyImg, solPos[0], solPos[1]);
};
/**
 * Je nepritel v dostrelu veze ?
 **/
CanvasTower.prototype._isOnFire = function(pos){
	for(var i=0;i<this.MAP.length;i++){
		for(var j=0;j<this.MAP[i].length;j++){
			if(this.MAP[i][j] == 'tower'){
				var ct = (i*this.canvasPointHeight)+(this.canvasPointHeight/2);
				var cl = (j*this.canvasPointWidth)+(this.canvasPointWidth/2);
				this.contextPlace.strokeStyle = '#000';
				this.contextPlace.beginPath();
				this.contextPlace.arc(cl, ct, 75, 0, Math.PI*2, true);
				this.contextPlace.closePath();
				this.contextPlace.stroke();
				
				var isIn = this.contextPlace.isPointInPath(pos[0], pos[1]);
				if(isIn){ this._shoot([i,j], pos); break; }
			}
		}
	}
};
CanvasTower.prototype._shoot = function(tc, pos){
	var tcs = tc.toString();
	if(!this.shoot[tcs]){
		this.shoot[tcs] = 1;
		var inter = new JAK.Interpolator( 0, 1, 200, this._animateShoot.bind(this), { endCallback : this._endShoot.bind(this) }  );
		inter.start();
	}
};
CanvasTower.prototype._rebuildPlace = function(){
	this.contextPlace.clearRect(0,0,this.dom.canvasMap.offsetWidth, this.dom.canvasMap.offsetHeight);
};
CanvasTower.prototype._animateShoot = function(num){
	this._rebuildPlace();
	for(i in this.shoot){
		var sc = i.split(',');
		var shoot = JAK.mel('img', { src : './img/strela.png' });
		var st = (sc[0]*this.canvasPointHeight)+(this.canvasPointHeight/2);
		var sl = (sc[1]*this.canvasPointWidth)+(this.canvasPointWidth/2);
		var shootL = sl+((this.actualSolPos[0]-sl)*num);
		var shootT = st+((this.actualSolPos[1]-st)*num);
		this.contextPlace.drawImage(shoot, shootL, shootT);
	}
};
CanvasTower.prototype._endShoot = function(){
	this.shoot = {};
	/*-
	for(i in this.shoot){
		delete this.shot[i];
	}-*/
}
/**
 * konec pohybu
 **/
CanvasTower.prototype._finnishMove = function(){
	this.enemyMove = this.moveEndCoords;
	/*-this._moveSoldier();-*/
};
/**
 * start interpolace
 **/
CanvasTower.prototype._animateSoldier = function(coords){
	this.moveEndCoords = coords;
	this.startLeftPos = this.enemyMove.coords[1]*this.canvasPointWidth;
	this.endLeftPos = this.moveEndCoords.coords[1]*this.canvasPointWidth;
	this.startTopPos = this.enemyMove.coords[0]*this.canvasPointHeight;
	this.endTopPos = this.moveEndCoords.coords[0]*this.canvasPointHeight;
	/*-
	var interpolator = new JAK.Interpolator( 0, 1, this.interval, this._posSoldier.bind(this), { endCallback:this._finnishMove.bind(this) } );
	interpolator.start();
	-*/ 
};
CanvasTower.prototype._getCoords = function(e){
	var boxpos = JAK.DOM.getBoxPosition(this.dom.canvasMap);
	var clickPos = [ e.clientY-boxpos.top, e.clientX-boxpos.left ];
	var ct = Math.floor(clickPos[0]/this.canvasPointHeight);
	var cl = Math.floor(clickPos[1]/this.canvasPointWidth);
	var type = this.MAP[ct][cl];
	return { type : type, coords : [ct, cl] };
};
CanvasTower.prototype._placeTower = function(e, elm){
	var boxpos = JAK.DOM.getBoxPosition(this.dom.canvasMap);
	var clickPos = [ e.clientY-boxpos.top, e.clientX-boxpos.left ];
	var ct = Math.floor(clickPos[0]/this.canvasPointHeight);
	var cl = Math.floor(clickPos[1]/this.canvasPointWidth);
	var type = this.MAP[ct][cl];
	if(type == 'place'){
		this.MAP[ct][cl] = 'tower';
		this._buildMap();
	}
};
CanvasTower.prototype._move = function(e, elm){
	var place = this._getCoords(e);
	if(place.type == 'tower'){
		var ct = (place.coords[0]*this.canvasPointHeight)+(this.canvasPointHeight/2);
		var cl = (place.coords[1]*this.canvasPointWidth)+(this.canvasPointWidth/2);
		this.contextPlace.strokeStyle = '#000';
		this.contextPlace.beginPath();
		this.contextPlace.arc(cl, ct, 75, 0, Math.PI*2, true);
		this.contextPlace.closePath();
		this.contextPlace.stroke();
	}
}
CanvasTower.prototype._removeTicker = function(e, elm){
	this.timekeeper.removeListener(this);
};
CanvasTower.prototype._link = function(){
	this.ec.push( JAK.Events.addListener(this.dom.canvasPlace, 'click', this, '_placeTower') );
	this.ec.push( JAK.Events.addListener(this.dom.canvasPlace, 'mousemove', this, '_move') );
	this.ec.push( JAK.Events.addListener(window, 'unload', this, '_removeTicker') );
};
