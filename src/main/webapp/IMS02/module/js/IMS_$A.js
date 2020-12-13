/*=================================================================================
 *	파 일 명		: IMS_$A.js
 *	작성목적		: $A 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.04
 *	최종작성일	:
 *	수정내역		:
 *				2014-03-31		이상준		함수 수정 및 추가
 *				2016-11-05		이상준		json object param 추가
=================================================================================*/

//===================================================================
//	$A 
//===================================================================
var $A = {
		
		type		:	"POST"		
	,	url			:	""
	,	param		:	""
	,	ptype		:	"string"	
	,	ptarget		:	null	
	,	async		:	true
	,	loading		:	true
	,	encode		:	IMS_config.encode
		
	//-------------------------------------------------------
	//	set
	//-------------------------------------------------------
	,	set	:
			function(vArr){
				this.url		=	vArr.url;
				this.type		=	$U.nvl(vArr.type, 		"POST");
				this.async		=	$U.nvl(vArr.async,		true);
				this.loading	=	$U.nvl(vArr.loading,	true);
				this.ptype		=	$U.nvl(vArr.ptype,		IMS_config.messageType);
				this.ptarget	=	$U.nvl(vArr.ptarget,	null);
				this.encode		=	$U.nvl(vArr.encode,		IMS_config.encode);
				
				if (this.ptype === "string"){
					this.param	=	this.encode ? this.paramset($U.nvl(vArr.param,"")) : $U.nvl(vArr.param,"");
				} else if (this.ptype === "json"){
					this.param	=	$U.isNullOrEmpty(vArr.param) ? this.tojsonparam() : this.paramsettojson($U.nvl(vArr.param));
				}
				
			}
	
	//-------------------------------------------------------
	//	param set
	//	-	한글 처리를 위해 파라메터를 encoding 처리한다.
	//	-	Json 형태의 데이타인 경우 미리 encoding 한다.
	//-------------------------------------------------------
	,	paramset	:
			function(vParam){
				if (vParam === "") return "";
				var arrParam	=	vParam.split("&");
				var arrValue	=	null;
				var sReturn		=	"";
				var vValue01	=	"";
				for (var i=0,j=arrParam.length; i<j; i+=1){
					arrValue	=	arrParam[i].split("=",2);
					vValue01	=	$U.nvl(arrValue[1],"");
					vValue01	=	(vValue01.indexOf("{\"") > -1 || vValue01.indexOf("%26lt") > -1)  ? vValue01 : (this.encode ? encodeURIComponent(vValue01) : vValue01);	//	.replace(/\%/g,"%24")
					if ($U.isNullOrEmpty(arrValue[0])) continue;
					sReturn		+=	(sReturn === "" ? "" : "&") + arrValue[0] + "=" + vValue01;	
				}
				return	sReturn;
			}

	//-------------------------------------------------------
	//	param set
	//	-	Json parameter 처리
	//-------------------------------------------------------
	,	tojsonparam	:	
			function(){
		
				if ($U.isNullOrEmpty(this.ptarget)){
					return "";
				}
				
				var p={},hiddeno,inputo,inputn,inputd,inputt,inpute,radioo,selecto,checko,texto,val;
				try{
					
					hiddeno	=	$hA("input[type=hidden]",this.ptarget);
					inputo	=	$hA("input[type=text]",this.ptarget);
					inputn	=	$hA("input[type=number]",this.ptarget);
					inputd	=	$hA("input[type=date]",this.ptarget);
					inpute	=	$hA("input[type=email]",this.ptarget);
					inputt	=	$hA("input[type=tel]",this.ptarget);
					radioo	=	$hA("input[type=radio]",this.ptarget);
					password	=	$hA("input[type=password]",this.ptarget);
					checko	=	$hA("input[type=checkbox]",this.ptarget);
					selecto	=	$hA("select",this.ptarget);
					texto	=	$hA("textarea",this.ptarget);
					
					//	hidden
					if (!$U.isNull(hiddeno)){
						for (var i=0,o; o=hiddeno[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val	= this.encode ? encodeURIComponent(o.value) : o.value;
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input
					if (!$U.isNull(inputo)){
						for (var i=0,o; o=inputo[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val	=	this.encode ? encodeURIComponent(o.value) : o.value;
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input - number
					if (!$U.isNull(inputn)){
						for (var i=0,o; o=inputn[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value) : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input - date
					if (!$U.isNull(inputd)){
						for (var i=0,o; o=inputd[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value).replace(/\%/g,"%24") : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input - tel
					if (!$U.isNull(inputt)){
						for (var i=0,o; o=inputt[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value) : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input - e
					if (!$U.isNull(inpute)){
						for (var i=0,o; o=inpute[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value) : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	input - password
					if (!$U.isNull(password)){
						for (var i=0,o; o=password[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value) : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	radio
					if (!$U.isNull(radioo)){
						for (var i=0,o; o=radioo[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							if (o.checked){
								val = this.encode ? encodeURIComponent(o.value) : o.value;	
								p[$U.get(o,"name")] = val;	
							}	
						}
					}
					
					//	checko
					if (!$U.isNull(checko)){
						for (var i=0,o; o=checko[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val	= o.checked ? ( this.encode ? encodeURIComponent(o.value) : o.value ) : " ";	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//	selecto
					if (!$U.isNull(selecto)){
						for (var i=0,o; o=selecto[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							if (o.options.length === 0) continue;
							val = this.encode ? encodeURIComponent(o.options[o.selectedIndex].value) : o.options[o.selectedIndex].value;
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					//---*	textarea
					if (!$U.isNull(texto)){
						for (var i=0,o; o=texto[i]; i+=1){
							if ($U.isNull($U.get(o,"name"))) continue;
							val = this.encode ? encodeURIComponent(o.value) : o.value;	
							if ($U.isNull(p[$U.get(o,"name")])){
								p[$U.get(o,"name")] = val;	
							} else {
								p[$U.get(o,"name")] = p[$U.get(o,"name")] + IMS_config.seperator + val;	
							}
						}
					}
					
					// console.log(JSON.stringify(p));
					
					return JSON.stringify(p);
					
				} catch(e) {
					alert("[$A tojsonparam] " + e);
				} finally {
					p	=	null;
					hiddeno	=	null;
					inputo	=	null;
					inputn	=	null;
					inputd	=	null;
					inputt	=	null;
					inpute	=	null;
					radioo	=	null;
					selecto	=	null;
					checko	=	null;
					texto	=	null;
					val		=	null;
				}
			
			}
	//-------------------------------------------------------
	//	param set to json
	//	-	json 이고 파라메터가 입력되는 경우.
	//-------------------------------------------------------
	,	paramsettojson	:
			function(vParam){
				if (vParam === "") return "";
				var p={},arrParam =	vParam.split("&"),arrValue = null,sReturn =	"",vValue01	="";
				try {
					for (var i=0,j=arrParam.length; i<j; i+=1){
						arrValue	=	arrParam[i].split("=",2);
						vValue01	=	$U.nvl(arrValue[1],"");
						vValue01	=	(vValue01.indexOf("{\"") > -1 || vValue01.indexOf("%26lt") > -1)  ? vValue01 : (this.encode ? encodeURIComponent(vValue01) : vValue01);
						if ($U.isNullOrEmpty(arrValue[0])) continue;
						p[arrValue[0]] = vValue01;
					}
					return JSON.stringify(p);
				} catch(e){
					alert("[$A paramsettojson] " + e);
				} finally{
					p	=	null;
					arrParam 	=	null;
					arrValue	= 	null;
					sReturn		=	null;
					vValue01	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	send
	//-------------------------------------------------------
	,	call	:
			function(vArr,callback,errorcallback){
				if ($U.isNullOrEmpty(vArr.url)){
					XAlert.alert("$A -> URL is null or Empty!!!");
					return;
				}
				
				this.set(vArr);
				
				//	Loading Start
				if (this.loading) LoadingControl.start(vArr.url);
				
				var $AReq = null;

				//IE인경우
				if(window.ActiveXObject){
					$AReq = new ActiveXObject('Msxml2.XMLHTTP');
				
				} else {
					$AReq = new XMLHttpRequest();
					$AReq.overrideMimeType('text/xml');
				}   
				
				//------------------------------------------------------------------------------------------------
				//  GET 방식인 경우 URL 에 Parameter 를 추가한다.
				//	this.param 은 "" 로 변경한다.
				//------------------------------------------------------------------------------------------------
				if (this.type.toUpperCase() === "GET"){
					this.url	= 	this.url + (this.url.indexOf("?") > -1 ? "&" : "?") + this.param;
					this.param	=	null;
				}
				
				//------------------------------------------------------------------------------------------------
				//  First 	->	POST,GET 선택 $A의 경우 POST 선호
				//	Second	->	처리 URL 
				//	Third	->	비동기/동기 방식에 대한 선택인데 true인 경우 비동기 방식으로 처리한다.
				//				비동기 방식의 경우 Request를 전송한 다음 서버로부터 응답이 없더라도 브라우저는 계속해서 다른 처리를 할 수 있다.
				//				사용자로부터 입력을 받거나 다른 스크립트를 수행할 수도 있다.
				//				반면 동기방식은 요청후 서버로부터 결과를 받을때까지 다른 처리는 할 수 없도록 하는 방식이다.     
				//------------------------------------------------------------------------------------------------
				$AReq.open(this.type, this.url, this.async);
			  
				//------------------------------------------------------------------------------------------------
				//	GET 방식인 경우 설정할 필요가 없지만 POST 방식인 경우에는 content type을 다음과 같이 설정한다.
				//------------------------------------------------------------------------------------------------
				$AReq.setRequestHeader("Content-Type", (this.ptype === "string" ? "application/x-www-form-urlencoded" : "application/json"));
				$AReq.setRequestHeader("Accept", "application/json");
//				$AReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
				
				//------------------------------------------------------------------------------------------------
				//	Return 시 처리 ....
				//		readyState	0	->	(Uninitialized)	The object has been created, 
				//											but not initialized (the open method has not been called).
				//		readyState	1	->	(Open)	The object has been created, but the send method has not been called.
				//		readyState	2	->	(Sent)	The send method has been called, 
				//									but the status and headers are not yet available.
				//		readyState	3	->	(Receiving)	Some data has been received.
				//		readyState	4	->	(Loaded)	All the data has been received, and is available.
				//------------------------------------------------------------------------------------------------
				try{
					var oooo	=	this;
					$AReq.onreadystatechange = function() {
						
						if($AReq.readyState === 4){
							
							switch ($AReq.status){
						     	case 200 :
						     		var d = $AReq.responseText;
						     		
						     		//---*	2017.04.06 db에 따라 값이 비워있는 경우 null 로 보내오는 경우가 있어 다음과 같이 처리함
						     		d = d.replace(/:null/g,':""');
						     		
						     		//--**	보안 이슈를 제거하기 위해  전송된 오류페이지에 response status 를 200 으로 세팅하는
						     		//--**	불필요한 처리로 인해 발생하는 문제점을 해결하기 위해 
						     		//--**	오류 페이지엑 ERROR-TAG 를 삽입하고 이 태그가 존재하는 경우
						     		//--**	오류처리 함
						     		if (!oooo.errorcheck(d,vArr.url,errorcallback)){
						     			return;
						     		}
						     		
						     		try{
							     		if (d.length > 0 && ( d.substring(0, 1) === "{" || d.substring(0, 1) === "[") ){	//	JSON
								     		callback(JSON.parse(d));
							     		} else {	//	json 이 아닌경우...
								     		callback(d);
							     		}
						     		  
						     		} catch(e){
							     		//callback(d);
						     		}
							    	//	Loading End
						     		LoadingControl.end(vArr.url);
									XEvent.bind();
						     		break;     
						     	case 401:
						     		LoadingControl.end(vArr.url);
						     		var d = $AReq.responseText;
						     		d = JSON.parse(d.replace(/:null/g,':""'));
						     		if (d.result === "-999"){
						     			XAlert.error(decodeURIComponent(d.message));
						     			//alert(decodeURIComponent(d.message));
						     			top.location.href = IMS_config.gologin;
						     		} else {
							     		//--**	오류 페이지를 사용하는 경우 처리
						     			if (!oooo.errorcheck(d,vArr.url,errorcallback)){
							     			return;
							     		}
						     		}
						     		break;
						     	default:
							    	//	Loading Force End
						     		LoadingControl.end(vArr.url);
									if ( $AReq.status !== 0 ){
							     		
										//--**	오류 페이지를 사용하는 경우 처리
						     			if (!oooo.errorcheck(decodeURIComponent($AReq.responseText),vArr.url,errorcallback)){
							     			return;
							     		}

										XAlert.error("[ ERROR CODE : " + $AReq.status + "]\r\n"	+ decodeURIComponent($AReq.responseText));
										if (!$U.isNull(errorcallback)){
											errorcallback();
										}
										
									}
						     		break;     
					  		} 
						}
					};
					
					$AReq.send(this.param);     				
					
				} catch(e){
					XAlert.error("[ $A Connect Error]\r\n"	+	e);
				}
		
			}
	
	//-------------------------------------------------------
	//	error check
	//-------------------------------------------------------
	,	errorcheck	:
			function(vdoo, varroo, verrorcallback){
		 		if (vdoo.indexOf("ERROR-TAG") > -1){
		     		LoadingControl.end(varroo);
		     		var msg	=	$U.trim(vdoo.substring(vdoo.indexOf("<ERROR-TAG>"),vdoo.indexOf("</ERROR-TAG>")).replace("<ERROR-TAG>",""));
					XAlert.error("[ ERROR CODE : -XXX ]\r\n" + msg);
					if (!$U.isNull(verrorcallback)){
						verrorcallback();
					}
		 			return false;
		 		}
		 		return true;
			}
		
};	
