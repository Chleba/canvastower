
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
	for(var i=0;i<this.map.length;i++){
		for(var j=0;j<this.map[i].length;j++){
			var img = CTD.IMG[this.map[i][j]].img;			
			this.ct.canvasMap.drawImage(CTD.IMG[this.map[i][j]].img, j*this.ct.mapPointSize.w, i*this.ct.mapPointSize.h, this.ct.mapPointSize.w, this.ct.mapPointSize.h);
		}
	}
};
