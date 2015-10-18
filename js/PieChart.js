;(function (root, factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory;
	} else if (typeof define !== 'undefined' && define.amd) {
		define(factory);
	} else {
		root.PieChart = factory.call(root);
	}
}(this, function () {
	/**
		var c = new PieChart({
			canvas: document.querySelector('#canvas1'),
			颜色数组			
			colorArr: ["#24a274","#2a70a6","#6d56c3","#b23880","#7a9a36","#b48548","#397839","#89489c"],
			百分比数组，一共为百分百			
			dataArr: [10, 20, 15, 7, 12, 3, 25, 8]
		});
		设置遮罩层		
		c1.drawLayer('#fff', 70);

	*/
	var PieChart = function (obj) {
		this.canvas = obj.canvas;
		this.ctx = this.canvas.getContext('2d');
//			canvas的宽高
		this.canW = this.canvas.width;
		this.canH = this.canvas.height;			
//			圆饼的直径
		this.radius = this.canW > this.canH ? this.canH :this.canW;
//			圆饼的中心			
		this.center = this.radius/2;
//			圆饼的颜色数组
		this.colorArr = obj.colorArr;
//			百分比数据
		this.dataArr = obj.dataArr;
		this._init();
	};

	PieChart.prototype = {
		constructor: PieChart,
//		绘制圆饼
		_init: function () {
			var ctx = this.ctx,
				 colorArr = this.colorArr,
				 radius = this.radius,
				 center = this.center,
				 dataArr = this._convert(this.dataArr),
				 num = Math.PI/180;
			if (this.dataArr.length != this.colorArr.length) {
				alert('请传入对于百分比的颜色，一块对于一个颜色');
			}
			for (var i=1, len=colorArr.length; i<=len; i++) {
				ctx.save();
				ctx.translate(center, center);	
				ctx.beginPath();	
				ctx.strokeStyle = colorArr[i-1];
				ctx.fillStyle = colorArr[i-1];
				ctx.moveTo(0,0);	
				ctx.arc(0, 0, center, dataArr[i-1]*num, dataArr[i]*num);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();
				ctx.restore();
			}
		},
//		绘制遮罩		
		drawLayer: function (c, r) {
			var ctx = this.ctx,
				 center = this.center;
			ctx.save();
			ctx.translate(center, center);	
			ctx.fillStyle = c;
			ctx.beginPath();	
			ctx.arc(0, 0, r, 0, Math.PI*2);
			ctx.fill();
			ctx.restore();
		},
//		把对应的百分比转换为区块所占的比例		
		_convert: function (arr) {
			var newArr = arr.concat([]),
				 sum = 0;
			for (var i=0,len=newArr.length; i<len; i++) {
				newArr[i] = newArr[i]*3.6;
			}
			for (var i=0,len=newArr.length; i<len; i++) {
				sum += newArr[i];
				newArr[i] = sum;
			}
			newArr.unshift(0);
			return newArr;
		}
	};
	return PieChart;

}))