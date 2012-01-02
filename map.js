
CanvasTower.Map = JAK.ClassMaker.makeClass({
	NAME : 'CanvasTower.Map',
	VERSION : '1.0'
});

CanvasTower.Map.prototype.$constructor = function(map, owner){
	this.ct = owner;
	this.map = map;
	this.imgs = {};
};

CanvasTower.Map.prototype.draw = function(){
	var mpw = this.ct.mapPointSize.w;
	var mph = this.ct.mapPointSize.h;
	for(var i=0;i<this.map.length;i++){
		for(var j=0;j<this.map[i].length;j++){
			var img = CTD.IMG[this.map[i][j]].img;			
			this.ct.canvasMap.drawImage(CTD.IMG[this.map[i][j]].img, j*this.ct.mapPointSize.w, i*this.ct.mapPointSize.h, this.ct.mapPointSize.w, this.ct.mapPointSize.h);
		}
	}
	
	if(this.ct.mouseCoords && (this.ct.mouseCoords.type == CTD.WALL || this.ct.mouseCoords.type == CTD.CANNON)){
		this.ct.canvasMap.beginPath();
		var mc = this.ct.mouseCoords.coords || [];
		var ax = (mc[1]*mpw)+(mpw/2);
		var ay = (mc[0]*mph)+(mph/2);
		this.ct.canvasMap.lineWidth = 6;
		this.ct.canvasMap.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		//this.ct.canvasMap.shadowColor = '#000';
		//this.ct.canvasMap.shadowBlur = 10;
		this.ct.canvasMap.lineOpacity = 60;
		this.ct.canvasMap.arc(ax, ay, mpw+(mpw/2), 0, Math.PI*2, true);
		this.ct.canvasMap.stroke();
	}
	
};
