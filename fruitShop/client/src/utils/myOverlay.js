/**
 * Created by sun77 on 2019/10/15.
 */
class myOverlay{
    constructor(center,length,color){
        this._center=center;
        this._length=length;
        this._color=color;
    }
}
myOverlay.prototype = new BMap.Overlay();
myOverlay.prototype.initialize = function(map){   //初始化覆盖物
    this._map = map;
    let div = document.createElement("div");
    let img = document.createElement('img');
    let inner = document.createElement("div");
    let border = document.createElement("div");
    let innerBorder = document.createElement("div");
    // 里面的div
    inner.style.position="relative";
    inner.style.width = this._length + "px";
    inner.style.height = this._length + "px";
    inner.style.background = this._color;
    inner.style.borderRadius='50%';
    inner.style.border='1px solid #7a7a7a';
    //小三角
    border.style.position="absolute";
    border.style.width=0;
    border.style.height=0;
    border.style.borderWidth=this._length*0.26+"px";
    border.style.borderColor=`#7a7a7a transparent transparent transparent`;
    border.style.borderStyle='solid';
    border.style.bottom=-this._length*0.48+"px";
    border.style.left="50%";
    border.style.marginLeft=-this._length*0.26+'px';

    innerBorder.style.position="absolute";
    innerBorder.style.width=0;
    innerBorder.style.height=0;
    innerBorder.style.borderWidth=this._length*0.26*0.9+"px";
    innerBorder.style.borderColor=`white transparent transparent transparent`;
    innerBorder.style.borderStyle='solid';
    innerBorder.style.bottom=-this._length*0.411+"px";
    innerBorder.style.left="50%";
    innerBorder.style.marginLeft=-this._length*0.26*0.9+'px';
    inner.appendChild(border);
    inner.appendChild(innerBorder);
    // 可以根据参数设置元素外观
    img.style.position='absolute';
    img.style.borderRadius='50%';
    img.style.overflow='hidden';
    img.style.width= (this._length*0.85) + "px";
    img.style.height= (this._length*0.85) + "px";
    img.src='http://47.107.134.55:4004/GoodImg/location.jpg';
    img.style.left="50%";
    img.style.top="50%";
    img.style.marginLeft=-(this._length*0.85/2)+'px';
    img.style.marginTop=-(this._length*0.85/2)+'px';
    img.onload=()=> {
        inner.appendChild(img);
    };
    div.style.position = "absolute";
    div.style.width = this._length+2 + "px";
    div.style.height = this._length+2 + "px";
    div.appendChild(inner);
    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div;
};
myOverlay.prototype.draw = function(){
// 根据地理坐标转换为像素坐标，并设置给容器
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._length / 2 + "px";
    this._div.style.top = position.y - this._length / 2 + "px";
};
myOverlay.prototype.show = function(){
    if (this._div){
        this._div.style.display = "";
    }
};
// 实现隐藏方法
myOverlay.prototype.hide = function(){
    if (this._div){
        this._div.style.display = "none";
    }
};
export default myOverlay;
