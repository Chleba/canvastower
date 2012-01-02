
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
			canvas.beginPath();
			canvas.lineWidth = 2;
			canvas.strokeStyle = '#FFF';
			canvas.moveTo((c[1]*ps.w)+(ps.w/2), (c[0]*ps.h)+(ps.h/2));
			canvas.lineTo(npc[i].actualPos.x, npc[i].actualPos.y);
			canvas.stroke();
		}
	}
};
