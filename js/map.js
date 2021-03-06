
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
		var mc = this.ct.mouseCoords.coords || [];
		var ax = (mc[1]*mpw)+(mpw/2);
		var ay = (mc[0]*mph)+(mph/2);
		this.ct.canvasMap.save();
		
		this._lines = [
			{width: 18, opacity:0.1, color: "rgba(0,255,0,0.1)"},
			{width: 14, opacity:0.2, color: "rgba(0,255,0,0.2)"},
			{width: 10, opacity:0.3, color: "rgba(0,255,0,0.3)"},
			{width: 6, opacity:1, color: "rgba(0,255,0,1)"},
			{width: 2, color: "rgb(255,255,255)"}
		];
		
		for(var i=0;i<this._lines.length;i++){
			this.ct.canvasMap.save();
			this.ct.canvasMap.beginPath();
			this.ct.canvasMap.lineWidth = this._lines[i].width;
			//this.ct.canvasMap.strokeStyle = 'rgba(100, 100, 100, 0.'+i+')';
			//var styleStr = 'rgba('+(i*11)+', '+(i*11)+', '+(i*11)+', 0.'+(9-i)+')';
			var styleStr = this._lines[i].color;
			this.ct.canvasMap.strokeStyle = styleStr;
			this.ct.canvasMap.arc(ax, ay, mpw+(mpw/2), 0, Math.PI*2, true);
			this.ct.canvasMap.closePath();
			this.ct.canvasMap.stroke();
			this.ct.canvasMap.restore();
		}
	}
	
};
