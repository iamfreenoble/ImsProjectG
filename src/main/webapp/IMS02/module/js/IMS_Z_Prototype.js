/*=================================================================================
 *	파 일 명		: IMS_Prototype.js
 *	작성목적		: Prototype 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.03.31
 *	최종작성일	:
 *	수정내역		:
 *						2014-04-12		이상준		json encoding 추가
 *						2016-11-16		이상준		data format 추가
=================================================================================*/

//-------------------------------------------------------
//		Array prototye Set,get
//-------------------------------------------------------
Array.prototype.set	=	function(id,tobj){
	for (var n=0,m=this.length; n<m; n+=1){
		if (this[n].id === id){
			this[n].value = tobj;
			return;
		}
	}
	this.push({id:id,value:tobj});
};

Array.prototype.get	=	function(id){
	for (var n=0,m=this.length; n<m; n+=1){
		if (this[n].id === id){
			return this[n].value;
		}
	}
	return null;
};

Array.prototype.match	=	function(id){
	for (var n=0,m=this.length; n<m; n+=1){
		if (this[n].id === id || this[n] === id){
			return n;
		}
	}
	return -1;
};

//-------------------------------------------------------
//		String trim
//-------------------------------------------------------
String.prototype.trim	=	function(){
	try{
		return this.replace(/(^\s*)|(\s*$)/gi,"");
	} catch(e){
		return this;
	}
};

//-------------------------------------------------------
//	String 이 한글로만 구성되었는지 여부를 체크
//-------------------------------------------------------
String.prototype.isKor	=	function(){
	return (/^[가-힣]+$/).test(this) ? true : false;
};

//-------------------------------------------------------
//	String 이 영어로만 구성되었는지 여부를 체크
//-------------------------------------------------------
String.prototype.isEng	=	function(){
	return (/^[a-zA-Z]+$/).test(this) ? true : false;
};

//-------------------------------------------------------
//	String 이 숫자로만 구성되었는지 여부를 체크
//-------------------------------------------------------
String.prototype.isNum	=	function(){
	return (/^[0-9]+$/).test(this) ? true : false;
};

//-------------------------------------------------------
//	String 암호화
//-------------------------------------------------------
String.prototype.Encryption	=	function(){
	/*var sReturn = "";
	$A.call({url:"/ecription.do",param:"pwd="+this,async:false}, function(data){
		sReturn = data;
	});
	return sReturn;*/
	
	var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	var s = this, i = 0, len = s.length,
	c1, c2, c3,
	e1, e2, e3, e4,
	result = [];
 
	while (i < len) {
		c1 = s.charCodeAt(i++);
	    c2 = s.charCodeAt(i++);
	    c3 = s.charCodeAt(i++);
	   
	    e1 = c1 >> 2;
	    e2 = ((c1 & 3) << 4) | (c2 >> 4);
	    e3 = ((c2 & 15) << 2) | (c3 >> 6);
	    e4 = c3 & 63;
	   
	    if (isNaN(c2)) {
	      e3 = e4 = 64;
	    } else if (isNaN(c3)) {
	      e4 = 64;
	    }
	   
	    result.push(e1, e2, e3, e4);
	  }
	 
	  return result.map(function (e) { return key.charAt(e); }).join('');	
};

//-------------------------------------------------------
//	JSON stringifyencode 	stringify 를 확장하여 encode 처리
//-------------------------------------------------------
try{
	JSON.stringifybyencode	=	function(obj){
		var sVal	=	JSON.stringify(obj);	//	특수문자 변환을 위해 stringify 처리
		var jData	=	JSON.parse(sVal);	//	length 가 있으면 JSONArray not JSONObject
		if ($U.isNull(jData.length)){
			for (var sKey in jData){
				if (typeof jData[sKey] === "string"){
					jData[sKey]	=	encodeURIComponent(jData[sKey].replace(/\"/g,"\\\""));
				} else  if (typeof jData[sKey] === "object"){
					jData[sKey]	=	JSON.encode(jData[sKey]);	//	.replace(/\"/g,"\\\""));
				}
			}
		} else {
			jData	=	JSON.encode(jData);
		}
		return	JSON.stringify(jData);
	};
}catch(e){
}
//-------------------------------------------------------
//	JSON encode 처리
//-------------------------------------------------------
try{
	JSON.encode	=	function(obj){
		for (var i=0, j=obj.length; i<j; i+=1){
			for (var sKey in obj[i]){
				if (typeof obj[i][sKey] === "string"){
					obj[i][sKey]	=	encodeURIComponent(obj[i][sKey].replace(/\"/g,"\\\""));
				} else  if (typeof obj[i][sKey] === "object"){
					obj[i][sKey]	=	JSON.encode(obj[i][sKey]);	//	.replace(/\"/g,"\\\""));
				}
				
			}
		}
		return obj;
	};
}catch(e){
}

//-------------------------------------------------------
//HTML Form Serialize
//-------------------------------------------------------
try{
	HTMLFormElement.prototype.serialize	=	function(){
		var ra		=	new Array();
		$T_each(["*",this],function(o){
			if ($U.isNull(o.name) || o.name === "" || o.disabled){
			} else {
				switch(o.tagName.toUpperCase()){
				case "INPUT"	:
					switch(o.type.toUpperCase()){
					case "CHECKBOX"	:
					case "RADIO"	:
						if (o.checked){
							ra.push(o.name+"="+o.value);
						}
						break;
					default	:
						ra.push(o.name+"="+o.value);
						break;
					}
					break;
				case "SELECT"	:
					ra.push(o.name+"="+o.options[o.selectedIndex].value);
					break;
				default	:
					ra.push(o.name+"="+o.value);
					break;
				}
			}
		}) ;
		return ra.join("&");
	};

} catch(e){

}


//-------------------------------------------------------
//FIRE FOX ,CHROME 포지션 찾기
//-------------------------------------------------------
document.getBoxObjectFor = function(el) {
	var pos,parent;
	
	try{
		pos = {};
		pos.x = el.offsetLeft;
		pos.y = el.offsetTop;
		pos.width 	= el.offsetWidth;
		pos.height = el.offsetHeight;
		parent = el.offsetParent;
		if (parent != el) {
		    while (parent) {
		        pos.x += parent.offsetLeft;
		        pos.y += parent.offsetTop;
		        parent = parent.offsetParent;
		    }
		}
		
		parent = el.offsetParent;
		while (parent && parent != document.body) {
		    pos.x -= parent.scrollLeft;                   
		    if (parent.tagName != 'TR') {
		        pos.y -= parent.scrollTop;
		    }
		    parent = parent.offsetParent;
		}
		
		return pos;
	} catch(e){	
		
	} finally{
		pos	=	null;
		parent	=	null;
		
	}
};          	

//-------------------------------------------------------
//	FIRE FOX  cross browsing
//-------------------------------------------------------
if ($U.isNull(window.attachEvent)){
	window.attachEvent	=	function(type, listener){
		window.addEventListener(type.replace(/on/ig,""), listener, true);
	};
}

//-------------------------------------------------------
//	event.keyCode 사용 FireFox 는 e.which 사용함
//-------------------------------------------------------
var en = ["mousedown","mouseover","mouseout","mousemove","mousedrag","click","dblclick","keydown","keyup","keypress"];
for (var es in en) window.attachEvent(es, function(e){window.event = e;});

//-------------------------------------------------------
//	date format
//-------------------------------------------------------
Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";
	 
	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;
	     
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
	    	case "yyyy": return d.getFullYear();
	        case "yy": return (d.getFullYear() % 1000).zf(2);
	        case "MM": return (d.getMonth() + 1).zf(2);
	        case "dd": return d.getDate().zf(2);
	        case "E": return weekName[d.getDay()];
	        case "HH": return d.getHours().zf(2);
	        case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	        case "mm": return d.getMinutes().zf(2);
	        case "ss": return d.getSeconds().zf(2);
	        case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	        default: return $1;
	 	}
	});
};
	 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
