;(function (root, factory) {
	if (typeof module != 'undefined' && module.exports) {
		module.exports = factory();
	} else if (typeof define != 'undefined' && define.amd) {
		define(factory);
	} else {
		root.circleH = factory.call(root);
	}
}(this, function () {

/**
  *	var c  = new circleH({
  *		canvas对象
  *		canvas: document.querySelector('#canvas1'),
  *      颜色，如图所示
  *		c1: '#397839',
  *		c2: '#fff',
  *		c3: '#b23880',
  *		百分比值
  *		percent: 60,
  *		圆环的宽度
  *		huanW: 40,
  *		动画执行过程中的回调函数，动态的显示加载的百分比
  *		cb: function (percent)  {
  *			
  *		}
  *	});	
  *
  *	可以调用c.update(percent);传入百分比值改变百分比
  *	
*/

	var circleH = function (obj) {
//			颜色			
			this.c1 = obj.c1;
			this.c2 = obj.c2;
			this.c3 = obj.c3;
//			百分比			
			this.percent = obj.percent;
//			圆环的宽度			
			this.huanW = obj.huanW;
//			canvas对象			
			this.canvas = obj.canvas;
			this.ctx = this.canvas.getContext('2d');
//			canvas的宽高
			this.canW = this.canvas.width;
			this.canH = this.canvas.height;			
//			圆的直径
			this.radius = this.canW > this.canH ? this.canH :this.canW;
//			圆的中心		
			this.center = this.radius/2;
//			执行的回调函数
			this.cb = obj.cb;
			this._init();
		};

		circleH.prototype = {
			constructor: circleH,
			_init: function () {
				this._drawCircle(this.radius/2, this.c1);
				this._drawHlaf(this.c3, this.percent);
				this._drawCircle((this.radius-this.huanW)/2, this.c2);

			},
//			绘制静态圆的方法
			_drawCircle: function (r, c) {
				var center = this.center,
					 radius = this.radius,
					 ctx = this.ctx;

				ctx.save();
				ctx.translate(center, center);
				ctx.beginPath();
				ctx.fillStyle = c;
				ctx.arc(0, 0, r, 0, Math.PI*2);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			},
//			绘制的动态加载圆环的主要方法，
//			动画支持匀速和变速，change=true表示变速，flase表示匀速，默认为匀速
			_drawHlaf: function (c, percent, change) {
				var ctx = this.ctx,
					 center = this.center,
					 radius = this.radius,
					 cb = this.cb,
					 percent = Math.floor((percent/100)*360),
					 num = Math.PI/180,
					 _this = this,
					 cur = 0,
					 speed = 10,
					 timer = null;
					 timer && clearInterval(timer);
					 timer = setInterval(function () {
						ctx.clearRect(0, 0, _this.canW, _this.canH);
						if (change) {
							speed = Math.ceil((percent - cur)/8);
						}
						cb && cb.call(null, Math.ceil(cur/3.6));
						_this._drawCircle(radius/2, _this.c1);

						ctx.save();
						ctx.translate(center, center);	
						ctx.beginPath();	
						ctx.strokeStyle = c;
						ctx.fillStyle = c;
						ctx.moveTo(0, 0);	
						ctx.arc(0, 0, radius/2, 0, cur*num);
						ctx.closePath();
						ctx.stroke();
						ctx.fill();
						ctx.restore();

						_this._drawCircle((radius - _this.huanW)/2, _this.c2);		
						if (change) {
							if (speed == 0) {
								clearInterval(timer);
								timer = null;
							}
						} else {
							if ( Math.abs(percent - cur)<speed ) {
								cb && cb.call(null, Math.ceil(percent/3.6));
								clearInterval(timer);
								timer = null;
							}
						}
						cur += speed;
					}, 15);
			},
//			更新百分比，对外部暴露的方法
			update: function (percent, change) {
				this._drawHlaf(this.c3, percent, change);
			}
		};
	return circleH;

}))