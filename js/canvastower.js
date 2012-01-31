
RPG = {};
RPG.N				= 0;
RPG.NE				= 1;
RPG.E				= 2;
RPG.SE				= 3;
RPG.S				= 4;
RPG.SW				= 5;
RPG.W				= 6;
RPG.NW				= 7;
RPG.CENTER			= 8;

RPG.DIR = {};
RPG.DIR[RPG.N] =  [0, -1];
RPG.DIR[RPG.NE] = [1, -1];
RPG.DIR[RPG.E] =  [1,  0];
RPG.DIR[RPG.SE] = [1,  1];
RPG.DIR[RPG.S] =  [0,  1];
RPG.DIR[RPG.SW] = [-1, 1];
RPG.DIR[RPG.W] =  [-1, 0];
RPG.DIR[RPG.NW] = [-1,-1];
RPG.DIR[RPG.CENTER] =  [0, 0];

CTD = {};
CTD.WALL = 0;
CTD.ROAD = 1;
CTD.START = 2;
CTD.END = 3;
CTD.NPC = 4;
CTD.NONE = 5;
CTD.CANNON = 6;

CTD.IMG = {};
CTD.IMG[CTD.WALL] = { img : './img/t-lava-pool.png', color : '#000' };
CTD.IMG[CTD.NONE] = { img : './img/t-lava.png', color : '#000' };
CTD.IMG[CTD.ROAD] = { img : './img/place.png', color : '#ccc' };
CTD.IMG[CTD.START] = { img : './img/t-lava.png', color : 'green' };
CTD.IMG[CTD.END] = { img : './img/t-lava.png', color : 'red' };
CTD.IMG[CTD.CANNON] = { img : './img/kanon.png', color : 'red' };
CTD.IMG[CTD.NPC] = {
	img : './img/capeman.png',
	up : 96,
	left : 32,
	right : 64,
	down : 0,
	width : 30,
	height : 32,
	steps : 3,
	interval : 400
};

var CanvasTower = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower',
	VERSION : '1.0'
});

CanvasTower.MAP = [
	[CTD.START ,CTD.ROAD  , CTD.ROAD , CTD.WALL , CTD.WALL , CTD.WALL , CTD.WALL , CTD.WALL , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.ROAD  , CTD.ROAD  , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.WALL , CTD.NONE ],
	[CTD.NONE  ,CTD.WALL , CTD.ROAD , CTD.ROAD  , CTD.ROAD  , CTD.WALL , CTD.WALL , CTD.ROAD  , CTD.ROAD  , CTD.END  ],
	[CTD.NONE  ,CTD.NONE  , CTD.NONE , CTD.NONE  , CTD.NONE  , CTD.NONE  , CTD.NONE  , CTD.NONE  , CTD.NONE  , CTD.NONE ]
	/*
	[CTD.WALL,CTD.START,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.ROAD,CTD.WALL],
	[CTD.WALL,CTD.END,CTD.WALL]
	*/
];

CanvasTower.prototype.$constructor = function(){
	this.dom = {};
	this.ec = [];
	this.started = 0;
	this.dom.canvasMap = JAK.gel('canvasMap');
	this.dom.canvasPlace = JAK.gel('canvasPlace');
	this.canvasMap = this.dom.canvasMap.getContext('2d');
	this.mapSize = { w : this.dom.canvasMap.offsetWidth, h : this.dom.canvasMap.offsetHeight };
	this.canvasPlace = this.dom.canvasPlace.getContext('2d');
	this.placeSize = { w : this.dom.canvasPlace.offsetWidth, h : this.dom.canvasPlace.offsetHeight };
	this.timekeeper = JAK.Timekeeper.getInstance();
	this.startTime = new Date().getTime();
	this._getPointSizes();
	this._imageLoad();
};

CanvasTower.prototype._imageLoad = function(){
	for( i in CTD.IMG ){
		if(!CTD.IMG[i].loaded){
			var img = JAK.mel('img');
			img.src = CTD.IMG[i].img;
			CTD.IMG[i].loaded = 1;
			CTD.IMG[i].img = img;
			this.ec.push( JAK.Events.addListener(img, 'load', this, '_imageLoad') );
			return;
		}
	}
	this.startGame();
	this._link();
};

CanvasTower.prototype._getPointSizes = function(){
	this.mapPointSize = { w : this.mapSize.w/CanvasTower.MAP[0].length, h : this.mapSize.h/CanvasTower.MAP.length }
	this.placePointSize = { w : this.placeSize.w/CanvasTower.MAP[0].length, h : this.placeSize.h/CanvasTower.MAP.length }
};

CanvasTower.prototype.clearMap = function(){
	this.canvasMap.clearRect(0, 0, this.mapSize.w, this.mapSize.h);
};

CanvasTower.prototype.clearPlace = function(){
	this.canvasPlace.clearRect(0, 0, this.placeSize.w, this.placeSize.h);
};

CanvasTower.prototype.startGame = function(){
	this.started = 1;
	this.map = new CanvasTower.Map(CanvasTower.MAP, this);
	this.map.draw();
	//try{ new CanvasTower.Soldier(this) } catch(e){ console.log(e); }
	this.cannons = [];
	this.startTime = new Date().getTime();
	this.npcs = [
		new CanvasTower.Soldier(this),
		new CanvasTower.Soldier(this),
		new CanvasTower.Soldier(this),
		new CanvasTower.Soldier(this),
		new CanvasTower.Soldier(this)
	];
	this.ticker = this.timekeeper.addListener(this, 'animationManager', 2);
};

CanvasTower.prototype.clearCanvas = function(){
	this.canvasMap.fillRect(0, 0, this.mapSize.w, this.mapSize.h);
};

CanvasTower.prototype.animationManager = function(){
	var d = new Date().getTime();
	var sd = this.startTime-d;
	if((Math.floor(sd/1000) % 3) == 0){
		for(var i=0;i<9;i++){
			this.npcs.push(new CanvasTower.Soldier(this));
		}
	}
	
	this.clearCanvas();
	this.map.draw();
	/*- pohyb npc -*/
	this._npcMove();
	/*- strelba kanonu -*/
	for(var i=0;i<this.cannons.length;i++){
		this.cannons[i].check();
	}
};

CanvasTower.prototype._npcMove = function(){
	var delta = new Date().getTime() - this.startTime;
	var index = Math.floor(delta / 1000);
	for(var i=0;i<this.npcs.length;i++){
		if(this.npcs[i].alive == 0){
			this.npcs.splice(i, 1);
		} else {
			if(i < index){
				this.npcs[i].move();
			}
		}
	}
};

CanvasTower.prototype.gameOver = function(){
	this.timekeeper.removeListener(this);
	alert('The end');
};

CanvasTower.prototype._getCoords = function(e){
	var boxpos = JAK.DOM.getBoxPosition(this.dom.canvasMap);
	var clickPos = [ e.clientY-boxpos.top, e.clientX-boxpos.left ];	
	var ct = Math.floor(clickPos[0]/this.mapPointSize.h);
	var cl = Math.floor(clickPos[1]/this.mapPointSize.w);
	var type = CanvasTower.MAP[ct][cl];
	return { type : type, coords : [ct, cl] };
};

CanvasTower.prototype._mouseMove = function(e, elm){
	var c = this._getCoords(e);
	this.mouseCoords = c;
};

CanvasTower.prototype._mouseClick = function(e, elm){
	var c = this._getCoords(e);
	if(c.type == CTD.WALL){
		CanvasTower.MAP[c.coords[0]][c.coords[1]] = CTD.CANNON;
		this.cannons.push(new CanvasTower.Cannon(this, c.coords));
	}
};

CanvasTower.prototype._link = function(){
	this.ec.push( JAK.Events.addListener(this.dom.canvasPlace, 'mousemove', this, '_mouseMove') );
	this.ec.push( JAK.Events.addListener(this.dom.canvasPlace, 'click', this, '_mouseClick') );
};

