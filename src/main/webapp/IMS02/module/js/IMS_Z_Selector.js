/*=================================================================================
 *	파 일 명	: 	IMS_Z_Selector.js
 *	작성목적	: 	Selector 공통함수 
 *	작 성 자	: 	이상준
 *	수정내역	:
 *				2019.04.13
 *					query selector 을 사용하는 경우 모체가 2 개 이상인 경우 첫번쨰 모체에서
 *					정보를 가져오는데 이것을 마지막 모체에서 가져오도록 하는 function을 추가함
 *					현재 붛완정 -> 추추 수정할것
=================================================================================*/

// html5 querySelector 
//	#contents ul li:first-child span
function $hD(id, obj){
	if ($hD.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;
	
	//--**	:selected 가 있는 경우  select 중에서 select 된 오브젝트를 찾아 반환
	if (id.indexOf(":selected") > -1){
		var raoooo = obj.querySelector(id.replace(":selected",""));
		return raoooo.options[raoooo.selectedIndex];
	
	} else {
		return obj.querySelector(id);
	}
	
}

//	html5 querySelector All
//	#contents ul li:first-child span
//					input[name="aaa"]
function $hA(id, obj){
	if ($hA.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;
	return obj.querySelectorAll(id);
}

//--** 
//--** 2019.04.13
//--** 	query selector 을 사용하는 경우 모체가 2 개 이상인 경우 첫번쨰 모체에서
//--** 	정보를 가져오는데 이것을 마지막 모체에서 가져오도록 하는 function을 추가함
//--** 
function $hLD(id, obj){
	if ($hLD.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;
	
	//--**	모체 구하기
	var momarr 	= 	id.split(" ");
	var mom		=	null; 
	var momobj 	= 	null;
	if (obj === document){
		momarr 	= 	id.split(" ");
		if ($U.isNull(momarr.length) || momarr.length === 0){
			return obj.querySelector(id);
		}
		momobj	=	$hA(momarr[0],obj);
		mom		=	momobj[momobj.length-1];
		id		=	id.substring(momarr[0].length);
		if ($U.isNullOrEmpty(id)){
			return mom;
		}

		//--**	:selected 가 있는 경우  select 중에서 select 된 오브젝트를 찾아 반환
		if (id.indexOf(":selected") > -1){
			var raoooo = mom.querySelector(id.replace(":selected",""));
			return raoooo.options[raoooo.selectedIndex];
		
		} else {
			return mom.querySelector(id);
		}
		
	} else {
		if (!$U.isNull(obj.length) && obj.length > 0){
			obj = obj[obj.length-1];
		}
		
		//--**	:selected 가 있는 경우  select 중에서 select 된 오브젝트를 찾아 반환
		if (id.indexOf(":selected") > -1){
			var raoooo = obj.querySelector(id.replace(":selected",""));
			return raoooo.options[raoooo.selectedIndex];
		
		} else {
			return obj.querySelector(id);
		}
	}
}

//--** 
//--** 2019.04.13
//--** 	query selector 을 사용하는 경우 모체가 2 개 이상인 경우 첫번쨰 모체에서
//--** 	정보를 가져오는데 이것을 마지막 모체에서 가져오도록 하는 function을 추가함
//--** 
function $hLA(id, obj){
	if ($hLA.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;

	//--**	모체 구하기
	var momarr 	= 	id.split(" ");
	var mom		=	null; 
	var momobj 	= 	null;
	if (obj === document){
		momarr 	= 	id.split(" ");
		if ($U.isNull(momarr.length) || momarr.length === 0){
			return obj.querySelectorAll(id);
		}
		momobj	=	$hA(momarr[0],obj);
		mom		=	momobj[momobj.length-1];
		id		=	id.substring(momarr[0].length);
		if ($U.isNullOrEmpty(id)){
			return mom;
		}
		return mom.querySelectorAll(id);
		
	} else {
		if (!$U.isNull(obj.length) && obj.length > 0){
			obj = obj[obj.length-1];
		}
		return obj.querySelectorAll(id);
	}

}


//===================================================================
//document.getElementById	->	$D로 대체
//-	id		:	id 
//-	obj	:	찾고자 하는 대상 obj
//===================================================================
function $D(id,obj){
	if ($D.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;
	return obj.getElementById(id);
}

//===================================================================
//$D 의 each 함수 
//-	arrObj		:	id, obj  
//-	callback	:	callback 
//===================================================================
function $D_each(arrObj,callback){
var arrReObj	=	arrObj.length === 1 ? $D(arrObj[0]) : $D(arrObj[0],arrObj[1]);
var reObj		=	null;
for (var i=0,j=arrReObj.length; i<j; i+=1){
	reObj	=	callback(arrReObj[i]);
	if ($U.isNull(reObj)) continue;
	if (reObj[0] === "continue") continue;
	if (reObj[0] === "break") break;
	if (reObj[0] === "error"){
		alert(reObj[1]);
		break;
	}
}
}

//===================================================================
//document.getElementsByName	->	$N로 대체
//-	id	:	nm 	-> document 에만 유효함.
//===================================================================
function $N(nm){
	if ($U.isNull(nm)) return null;
	//if ($U.isNull(obj)) obj = document;
	return document.getElementsByName(nm);
}

//===================================================================
//$N 의 each 함수 
//-	arrObj	:	id, obj  
//-	callback	:	callback 
//===================================================================
function $N_each(arrObj,callback){
	var arrReObj	=	arrObj.length === 1 ? $N(arrObj[0]) : $N(arrObj[0],arrObj[1]);
	if ($U.isNull(arrReObj)) return null;
	var reObj		=	["",""];
	for (var i=0,j=arrReObj.length; i<j; i+=1){
		reObj	=	callback(arrReObj[i]);
		if ($U.isNull(reObj)) continue;
		if (reObj[0] === "continue") continue;
		if (reObj[0] === "break") break;
		if (reObj[0] === "return"){
			return reObj[1];
			break;
		};
		if (reObj[0] === "error"){
			alert(reObj[1]);
			break;
		};
	};
}

//===================================================================
//document.getElementsByTagName	->	$T로 대체
//-	id		:	id (tag)
//-	obj	:	찾고자 하는 대상 obj
//===================================================================
function $T(id,obj){
	if ($T.arguments.length === 2 && $U.isNull(obj)) return null;
	if ($U.isNull(id)) return null;
	if ($U.isNull(obj)) obj = document;
	return obj.getElementsByTagName(id);
}

//===================================================================
//$T 의 each 함수 
//-	arrObj	:	id, obj  
//-	callback	:	callback 
//===================================================================
function $T_each(arrObj,callback){
	var arrReObj	=	arrObj.length === 1 ? $T(arrObj[0]) : $T(arrObj[0],arrObj[1]);
	if ($U.isNull(arrReObj)) return null;
	var reObj		=	["",""];
	for (var i=0,j=arrReObj.length; i<j; i+=1){
		reObj	=	callback(arrReObj[i]);
		if ($U.isNull(reObj)) continue;
		if (reObj[0] === "continue") continue;
		if (reObj[0] === "break") break;
		if (reObj[0] === "return"){
			return reObj[1];
			break;
		};
		if (reObj[0] === "error"){
			alert(reObj[1]);
			break;
		};
	};
}

//===================================================================
//document 클래스 명으로 가져오기 	->	$C
//-	cm		:	클래스명 
//-	obj	:	찾고자 하는 대상 obj
//===================================================================
function $C(cm,obj){
	if ($U.isNull(cm)) return null;
	if ($U.isNull(obj)) obj = document;
	var arrObj	=	new Array();
	$T_each(["*"],function(obj){
		if (!$U.isNull(obj.className)) {
			if (obj.className.toUpperCase() === cm.toUpperCase()) arrObj.push(obj);
		}
	});
	return arrObj;
}

//===================================================================
//$C 의 each 함수 
//-	arrObj	:	id, obj  
//-	callback	:	callback 
//===================================================================
function $C_each(arrObj,callback){
	var arrReObj	=	arrObj.length === 1 ? $C(arrObj[0]) : $C(arrObj[0],arrObj[1]);
	if ($U.isNull(arrReObj)) return null;
	var reObj		=	["",""];
	for (var i=0,j=arrReObj.length; i<j; i+=1){
		reObj	=	callback(arrReObj[i]);
		if ($U.isNull(reObj)) continue;
		if (reObj[0] === "continue") continue;
		if (reObj[0] === "break") break;
		if (reObj[0] === "return"){
			return reObj[1];
			break;
		}
		if (reObj[0] === "error"){
			alert(reObj[1]);
			break;
		};
	};
}
