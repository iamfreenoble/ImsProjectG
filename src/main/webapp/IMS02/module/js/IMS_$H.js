/*=================================================================================
 *	파 일 명		: IMS_$H.js
 *	작성목적		: 공통 $H 함수 - Form , input Tag 관련 
 *	작 성 자		: 이상준
 *	최초작성일		: 2013.04.16
 *	최종작성일		:
 *	수정내역		:
 *				
 *				
 *					
=================================================================================*/

var $H = {
		
	//-------------------------------------------------------
	//	input auto resize
	//-------------------------------------------------------
		autofit:
			function(obj,opt){
				var w,l,r,t,b,c;
				try{
					for (var i=0,ooo;ooo=obj[i];i+=1){
						//--**	오브젝트가 1개 이상인 경우 pass
						c = $hA("input",ooo.parentElement).length + $hA("select",ooo.parentElement).length;
						if (c > 1) continue; 
						//--**	autofit attribute 가 NO 인경우 패스
						//--**	type이 button 인경우 pass
						if ($U.nvl($U.get(ooo,"autofit"),"").toUpperCase() === "NO") continue;
						if ($U.get(ooo,"type").toUpperCase() === "BUTTON") continue;
						w	=	ooo.parentElement.offsetWidth;
						l	=	$U.nvl(opt.left,0);
						r	=	$U.nvl(opt.right,0);
						t	=	$U.nvl(opt.top,0);
						b	=	$U.nvl(opt.bottom,0);
						ooo.style.width	= (w - l - r) + "px";
						if (t !==0 ) ooo.style.marginTop = t +"px"; 
						if (b !==0 ) ooo.style.marginBottom = b +"px"; 
					}
				} catch(e){
					alert("$H > autofit : " + e);
					
				} finally {
					w	=	null;
					l	=	null;
					r	=	null;
					t	=	null;
					b	=	null;
					c	=	null;
				}
			}
	//-------------------------------------------------------
	//	Form mode 변경
	//-------------------------------------------------------
	,	modeset:
			function(obj,opt){
				
				var allobj,bc,ds,ps,oform;
				try{
					oform = typeof(obj) === "string" ? $hLD("form[name="+obj+"]") : obj;
					if ($U.isNull(oform)){
						oform = document;
					}

					bc 	= 	(opt.mode === "VIEW" ? "transparent" : ""); 
					ds	=	(opt.mode === "VIEW" ? "none" : "");
					allobj = $hA("*", oform);
					
					for (var i=0,ooo;ooo=allobj[i];i+=1){
						
						//--**	modeapply NO 인경우 적용안함
						if ($U.get(ooo,"modeapply") === "NO"){
							continue;
						}
						
						if (opt.mode === "VIEW"){
							ps	=	"";
						} else {
							$U.set(ooo,"placeholder2",$U.nvl($U.get(ooo,"placeholder"),""));
							ps	=	$U.get(ooo,"placeholder2");
						}
						
						
						if (ooo.tagName === "INPUT"){
							switch($U.get(ooo,"type")){
							case "text" :
								ooo.style.borderColor	=	bc;
								if (opt.mode === "VIEW"){
									$U.set(ooo,"readonly",true);
								} else {
									if ( $U.get(ooo,"readonly") !== true && $U.get(ooo,"readonly") !== "readonly"){
										$U.del(ooo,"readonly");
									} 
								}
								$U.set(ooo,"placeholder",ps);
								break;
								
							case "checkbox" :
							case "radio" :
								$U.set(ooo,"disabled",opt.mode === "VIEW");
								break;
								
							case "select" :
								$U.set(ooo,"disabled",opt.mode === "VIEW");
								$U.set(ooo,"placeholder",ps);
								break;
								
							case "button" :
								ooo.style.display	=	ds;
								break;
							}
							
						}
						
						if (ooo.tagName === "SELECT"){
							$U.set(ooo,"disabled",opt.mode === "VIEW");
							$U.set(ooo,"placeholder",ps);
						}
						
						if (ooo.tagName === "TEXTAREA"){
							$U.set(ooo,"disabled",opt.mode === "VIEW");
							$U.set(ooo,"placeholder",ps);
						}

						if (ooo.tagName === "BUTTON"){
							ooo.style.display	=	ds;
						}
					
					
					}
				//} catch(e){
				//	alert("$H > modeset : " + e);
					
				} finally {
					bc	=	null;
					ds	=	null;
					ps	=	null;
					allobj = null;
					oform	=	null;
				}
			}

	//-------------------------------------------------------
	//	Form data sync
	//	console.log("KEY : " +key + ", VALUE = " + data[key] + ", TYPE : " + $U.get(ooo[0],"type"));
	//-------------------------------------------------------
	,	datasync:
			function(pobj,data){
				
				var ooo,oform,ichk;
				try{
					
					oform = typeof(pobj) === "string" ? $hLD("form[name="+pobj+"]") : pobj;
					if ($U.isNull(oform)){
						oform = document;
					}
					
					ichk	=	0;
					for (var key in data){
						
						ooo = $hA("[name="+key+"]", oform);
						if ($U.isNullOrEmpty(ooo)){	ooo = $hA("[name="+key.toLowerCase()+"]", oform)	}
						if ($U.isNullOrEmpty(ooo)){	ooo = $hA("[name="+key.toUpperCase()+"]", oform)	}
						if ($U.isNull(ooo) || ooo.length === 0) continue;
						
						for (var mm=0,tttooo; tttooo=ooo[mm]; mm+=1){
							
							if (tttooo.tagName.toUpperCase() === "INPUT"){
								switch($U.get(tttooo,"type")){
								case "date" :
								case "email" :
								case "number" :
								case "tel" :
								case "password" :
								case "hidden" :
								case "text" :
									tttooo.value	=	data[key];
									break;
								case "select" :
									for(var xx=0,soo;soo=tttooo.options[xx];xx+=1){
										if (soo.value === data[key]){
											soo.checked	=	true;
											break;
										}
									}
									break;
								case "radio" :
									if (tttooo.value === data[key]){
										tttooo.checked	=	true;
										break;
									}
									break;
								case "checkbox" :
									if (( "," + data[key] + ",").indexOf(","+tttooo.value+",") > -1){
										tttooo.checked	=	true;
										break;
									}
									break;
								}
							
							} else if (tttooo.tagName.toUpperCase() === "SELECT"){
								
								for(var xx=0,soo;soo=tttooo.options[xx];xx+=1){
									if (soo.value === data[key]){
										soo.selected =	true;
										break;
									}
								}
							
							} else if (tttooo.tagName.toUpperCase() === "TEXTAREA"){
								tttooo.value	=	data[key];
								
							} else if (tttooo.tagName.toUpperCase() === "SPAN"){
								tttooo.innerHTML =	data[key];
								
							}
						}
					}
					
				} catch(e){
					alert("$H > datasync : " + e);
					
				} finally {
					
					ooo	=	null;
				}
				
			}

};	

