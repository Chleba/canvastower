
CanvasTower.Soldier = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower.Soldier',
	VERSION : '1.0'
});

CanvasTower.Soldier.prototype.$constructor = function(owner){
	this.ct = owner;
	this.coords = [];
	this.pxcoords = {};
	this.actualPos = { x : 0, y : 0 };
	this.direction = RPG.S;
	this.HP = 100;
	this.interval = 1000;
	this.map = CanvasTower.MAP;
	this.startTime = new Date().getTime();
	this.spriteOpt = {
		step : 30,
		steps : 3,
		interval : 150, /* delka jedne casti spritu */
		start : new Date().getTime() /* cas pocatku animace */
	}
	this.spriteOpt[RPG.N] = { top :96, height : 32 };
	this.spriteOpt[RPG.W] = { top :32, height : 32 };
	this.spriteOpt[RPG.E] = { top : 64, height : 32 };
	this.spriteOpt[RPG.S] = { top : 0, height : 32 };
	this._posOnStart();
};

CanvasTower.Soldier.prototype._posOnStart = function(){
	var coords = [];
	for(var i=0;i<this.map.length;i++){
		var index = this.map[i].indexOf(CTD.START);
		if(index > -1){
			coords.push(i);
			coords.push(index);
			break;
		}
	}
	this.coords = coords;
	this.pxcoords = this._pxPos(this.coords);
};

CanvasTower.Soldier.prototype._pxPos = function(coords){
	var x = coords[1]*this.ct.mapPointSize.w;
	var y = coords[0]*this.ct.mapPointSize.h;
	return { x : x, y : y };
};

CanvasTower.Soldier.prototype.move = function(){
	var delta = new Date().getTime() - this.startTime;
	var index = Math.floor(delta / this.interval);
	
	if(index > this.index){
		this.pxcoords = this._pxPos(this.coords);
		var coords = this._whereTo(this.coords);
		this.coords = coords;
		if(this.map[coords[0]][coords[1]] == CTD.END){
			this.ct.gameOver();
		}
		
		var num = (delta / this.interval) % 1;
		this._animate(num);
	} else {
		var num = (delta / this.interval) % 1;
		this._animate(num);
	}
	this.index = index;
};

CanvasTower.Soldier.prototype._animate = function(num){
	var pxEnd = this._pxPos(this.coords);
	var solLeft = ((pxEnd.x-this.pxcoords.x)*num)+this.pxcoords.x;
	var solTop = ((pxEnd.y-this.pxcoords.y)*num)+this.pxcoords.y;
	
	var sy = this.spriteOpt[this.direction].top; /* vyskovy zacatek */
	var height = this.spriteOpt[this.direction].height; /* vyska vyrezu */
	
	this.actualPos = { x : solLeft+((this.spriteOpt.step/1.5)/2), y : solTop+((height/1.5)/2) };
	
	var delta = new Date().getTime() - this.spriteOpt.start; /* jak dlouho uz bezi animace */
	var index = Math.floor(delta / this.spriteOpt.interval) % 3;
	var sx = index*this.spriteOpt.step; /* sirkovy zacatek zleva */
	
	this.ct.canvasMap.drawImage(CTD.IMG[CTD.NPC].img, sx, sy, this.spriteOpt.step, height, solLeft, solTop, this.spriteOpt.step/1.5, height/1.5);
	
	//var soldier = this.ct.canvasMap.drawImage(CTD.IMG[CTD.NPC].img, solLeft, solTop);
};

CanvasTower.Soldier.prototype._whereTo = function(coords){
	var goCoords = [];
	var index = 1;
	var dir = RPG.DIR;
	
	var cRight = { direction : RPG.E, coords : [coords[0]] };
	if(coords[1]+index >= this.map[0].length-1){
		cRight.coords.push(this.map[0].length-1);
	} else {
		cRight.coords.push(coords[1]+index);
	}
	/*- vlevo -*/
	var cLeft = { direction : RPG.W, coords : [coords[0]] };
	if(coords[1]-index <= 0){
		cLeft.coords.push(0);
	} else {
		cLeft.coords.push(coords[1]-index);
	}
	/*- nahoru -*/
	var cUp = { direction : RPG.N, coords : [] };
	if(coords[0]-index <= 0){
		cUp.coords.push(0, coords[1]);
	} else {
		cUp.coords.push(coords[0]-index, coords[1]);
	}
	/*- dolu -*/
	var cDown = { direction : RPG.S, coords : [] };
	if(coords[0]+index >= this.map.length-1){
		cDown.coords.push(this.map.length-1, coords[1]);
	} else {
		cDown.coords.push(coords[0]+index, coords[1]);
	}
	
	goCoords.push(cLeft, cRight, cUp, cDown);
	for(var i=0;i<goCoords.length;i++){
		if(this.map[goCoords[i].coords[0]][goCoords[i].coords[1]] == CTD.ROAD && (goCoords[i].coords.toString() != this.coords.toString())){
		    if(goCoords[i].direction == RPG.W && this.direction == RPG.E){
		        continue;
		    } else if(goCoords[i].direction == RPG.S && this.direction == RPG.N){
		        continue;
		    } else if(goCoords[i].direction == RPG.N && this.direction == RPG.S){
		        continue;
		    } else {
				this.direction = goCoords[i].direction;
				return goCoords[i].coords;
				break;
			}
		}
	}
	return 0;
};
