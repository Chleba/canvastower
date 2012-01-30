
CanvasTower.Cannon = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower.Cannon',
	VERSION : '1.0'
});

CanvasTower.Cannon.prototype.$constructor = function(owner, coords){
	this.ct = owner;
	this.coords = coords;
	this.map = CanvasTower.MAP;
	this.timekeeper = JAK.Timekeeper.getInstance();
	//this.timekeeper.addListener(this, '_check', 2);
	this.shotInterval = 1000;
	this.shoots = [];
	this.shootTime = new Date().getTime();
};

CanvasTower.Cannon.prototype.shoot = function(npc){
	var from = {
		x : (this.coords[1]*this.ct.mapPointSize.w)+this.ct.mapPointSize.w/2,
		y : (this.coords[0]*this.ct.mapPointSize.h)+this.ct.mapPointSize.h/2
	};
	var d = new Date().getTime();
	if(d > this.shootTime){
		this.shootTime = new Date().getTime()+this.shotInterval;
		this.shoots.push(new CanvasTower.Cannon.SHOT({
			canvas : this.ct.canvasMap,
			from : from,
			to : npc.actualPos
		}));
	}
};

CanvasTower.Cannon.prototype.check = function(){
	var npc = this.ct.npcs;
	var c = this.coords;
	var canvas = this.ct.canvasMap;
	var ps = this.ct.mapPointSize;
	for(var i=0;i<npc.length;i++){
		//var n1 = (npc[i].coords[0]*ps.w);
		var n1 = (npc[i].actualPos.x);
		//var n2 = (npc[i].coords[1]*ps.h);
		var n2 = (npc[i].actualPos.y);
		var m1 = (c[1]*ps.w)+(ps.w/2);
		var m2 = (c[0]*ps.h)+(ps.h/2);
		var a = (n1-m1);
		var b = (n2-m2);
		var r = Math.sqrt((a*a)+(b*b));
		
		if(r <= (ps.w+ps.w/1.5)){
			this.shoot(npc[i]);
			//continue;
			//break;
			//return;
			/*canvas.beginPath();
			canvas.lineWidth = 2;
			canvas.strokeStyle = '#FFF';
			canvas.moveTo((c[1]*ps.w)+(ps.w/2), (c[0]*ps.h)+(ps.h/2));
			canvas.lineTo(npc[i].actualPos.x, npc[i].actualPos.y);
			canvas.stroke();*/
		}
	}
	this._animateShots();
};

CanvasTower.Cannon.prototype._animateShots = function(){
	for(var i=0;i<this.shoots.length;i++){
		if(this.shoots[i].opt == null){
			this.shoots.splice(i, 1);
		} else {
			this.shoots[i].draw();
			this.shoots[i].update();
		}
	}
};

/**
 * Strela z kanonu
 * @params
 * opt.canvas canvasContext vykreslovaci cast
 * opt.from obj pixelove souradnice x,y
 * opt.to obj pixelove souradnice x,y
 * opt.img img obrazek strely
 **/
CanvasTower.Cannon.SHOT = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower.Cannon.SHOT',
	VERSION : '1.0'
});
CanvasTower.Cannon.SHOT.prototype.$constructor = function(opt){
	this.particles = [];
	this.opt = {
		canvas : null,
		from : { x : 0, y : 0 },
		to : { x : 0, y : 0 },
		life : 500,
		img : new Image()
	}
	this.opt.img.src = './img/strela.png';
	this.img = this.opt.img;
	for(var p in opt){ this.opt[p] = opt[p]; }
	this.startTime = new Date();
	
	this.posX = this.opt.from.x;
	this.posY = this.opt.from.y;
	
	var angle = Math.atan2( (this.opt.to.y - this.posY), (this.opt.to.x - this.posX) );
	
	//var speed = 5;
	var dist = Math.sqrt(((this.posX-this.opt.to.x)*(this.posX-this.opt.to.x))+((this.posY-this.opt.to.y)*(this.posY-this.opt.to.y)));
	var speed = dist/10;
	
	var a = this.posX + speed * Math.cos(angle);
    var b = this.posY + speed * Math.sin(angle);
    
    this.x = a - this.posX;
	this.y = b - this.posY;
};
CanvasTower.Cannon.SHOT.prototype.$destructor = function(){
	for(var p in this){
		this[p] = null;
	}
};
CanvasTower.Cannon.SHOT.prototype.update = function(){
	this.posX += this.x;
	this.posY += this.y;
	
	//console.log(this.opt.from.x+' --- '+this.opt.to.x);
	//console.log(this.posX+' --- '+this.opt.to.x);
	//console.log(this.posY+' --- '+this.opt.to.y);
	
	if(((this.opt.from.x < this.opt.to.x) && (this.posX > this.opt.to.x)) || ((this.opt.from.y < this.opt.to.y) && (this.posY > this.opt.to.y)) ){
		this.$destructor();
		return;
	} else if(((this.opt.from.x > this.opt.to.x) && (this.posX < this.opt.to.x)) || ((this.opt.from.y > this.opt.to.y) && (this.posY < this.opt.to.y)) ){
		this.$destructor();
		return;
	}
	
	this.particles.push(new Particle({
		posX : this.posX,
		posY : this.posY,
		gravity : 0,
		alpha : 0.5,
		size : 1.2,
		shrink : 0.94,
		life : 200,
		canvas : this.opt.canvas,
		img : this.img
	}));
};
CanvasTower.Cannon.SHOT.prototype.draw = function(){
	for(var i=0;i<this.particles.length;i++){
		var p = this.particles[i];
		if(p.opt === null){
			this.particles.splice(i, 1);
		} else {
			p.draw();
			p.update();
		}
	}
};

