/*=================================================================================
 *	파 일 명		: IMS_F2.js
 *	작성목적		: HTML5 파일 업로드 / 다운로드
 *	작 성 자		: 이상준
 *	최초작성일		: 2018.05.01
 *	최종작성일		:
 *	수정내역		: file upload layer 오픈후 파일 선택 처리하고 그 결과를 서버에 저장하는 형태로 처리함	
=================================================================================*/

var F2	=	{

		filedata		:	[]
	,	fileprocesschk	:	""
	,	fgrid			:	null
	,	fcallback		:	null
	,	fgroupkey		:	null
	,	ftarget			:	null
	,	fpopwin			:	null
	,	fIE10check		:  (IDV_BROWSER.NAME === "IE" && IDV_BROWSER.VER < 10)
	
	//-------------------------------------------------------
	//	begin  		
	//-------------------------------------------------------
	,	begin	:
			function(){
				$G.push(this);	//--**	가비지 처리 필수임
				this.formload();
			}
	
	//-------------------------------------------------------
	//	form load  		
	//-------------------------------------------------------
	,	formload	:
			function(){
				var templatesection	=	$U.isNullOrEmpty(IMS_config.templateloadsection) ? document.body : $hD("#"+IMS_config.templateloadsection);
				$U.load(IMS_config.path +"/IMS02/module/template/file/F2_frame.html", function(d){ $U.insertHTML(templatesection,"beforeend", d); } );
			}
	
	//-------------------------------------------------------
	//	file template open  		
	//-------------------------------------------------------
	,	open	:	
			function(gobj, callback, fname){
				
				this.ftarget	=	gobj;
				this.fcallback	=	callback;
				var	ooo	=	this;
				
				this.fpopwin	=	new $P({	target		:	ooo
											,	template	:	"#template_F2_frame"
											,	title		:	"파일 관리"
											,	button		:	"Cancel"						//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
											,	custombutton  :	"button01,button02,button03"	//	button01 ~ button10 중 선택
											,	afterOpen	:	function(poo){
												
												//--**	button event binding
												$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
												
												//--**	custombutton value binding
												$hD("a",poo.custombuttonobj["button01"]).innerHTML = "삭제확정";
												$hD("a",poo.custombuttonobj["button02"]).innerHTML = "삭제취소";
												$hD("a",poo.custombuttonobj["button03"]).innerHTML = "적용";
												
												//--**	custombutton event binding
												$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ ooo.fileuseynupdateall("D"); 	});
												$U.eventbind(poo.custombuttonobj["button02"], "onclick", function(){ ooo.fileuseynupdateall("Y"); 	});
												$U.eventbind(poo.custombuttonobj["button03"], "onclick", function(){ ooo.approve(); });
					
												//--**	pkey 
												var pkey	=	$U.get(gobj,"f2_group_key");	
												if ($U.isNull(pkey)){
													alert("해당 object에 f2_group_key 가 선언되어야 합니다..");
													poo.close();
													return;
												}
												
												if ($U.isNull(fname)){
													alert("form 명이 선언되어야 합니다..");
													poo.close();
													return;
												}
												
												if ($U.isNull($hD("form[name="+fname+"]"))){
													alert("form 이 존재하지 않습니다..");
													poo.close();
													return;
												}
												
												if ($U.isNull($hD("form[name="+fname+"] input[name=f2_mass_group_key]"))){
													alert("해당 form에  f2_mass_group_key 이 존재하지 않습니다..");
													poo.close();
													return;
												}
												
												//--**	empty 인경우
												let f2_mass_group_key = "";
												if ($U.isEmpty($hD("form[name="+fname+"] input[name=f2_mass_group_key]"))){
													f2_mass_group_key	=	new Date().getTime() +	"_" + $U.randowm(0,10000);
												} else {
													f2_mass_group_key	=	$hD("form[name="+fname+"] input[name=f2_mass_group_key]").value;
												}
												$hD("form[name="+fname+"] input[name=f2_mass_group_key]").value	=	f2_mass_group_key;
												
												//--**	IE10 미만인 경우
												$hD("#IMS_F2 #F2_dropzone_div").style.display	=	ooo.fIE10check ? "none" : "";
												
												//--**	key	값이 없는 경우 key  값을 구한다
												if ($U.isEmpty(pkey)){
													$A.call({url:"/ims/f2/getgroupkey.do",ptype:"string",param:"f2_mass_group_key="	+ f2_mass_group_key },function(d){
														ooo.fgrid = new G2(		$hD("#F2_list")
																			,	{InitialSearch:true}
																			, 	"f2_list_type=group&f2_group_key=" + d
																			, 	{ initsort : {sortid:"f2_regist_datetime",sorttype:"DESC"} });
														ooo.fgroupkey	=	d;
													});
												} else {
													ooo.fgrid = new G2(		$hD("#F2_list")
																		,	{InitialSearch:true}
																		, 	"f2_list_type=group&f2_group_key=" + pkey 
																		, 	{ initsort : {sortid:"f2_regist_datetime",sorttype:"DESC"} });
													ooo.fgroupkey	=	pkey;
												}
							
											}	
									},{w:700,h:500,mw:300,mh:300});
			}
	
	//-------------------------------------------------------
	//	file select object click  		
	//-------------------------------------------------------
	,	fileselectclick	:
			function(){
				$hD("#F2_file_select").click();
			}
	
	//-------------------------------------------------------
	//	drag over 		
	//-------------------------------------------------------
	,	dragover	:
			function(evt){
				var e	= window.event || evt;
			    try{
					e.stopPropagation();
				    e.preventDefault();
			    } catch(e){
			    }
			    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			}
	
	//-------------------------------------------------------
	//	drag drop
	//-------------------------------------------------------
	,	drop	:
			function(evt){
				var e	= window.event || evt;
				this.filedropselect(e);
			}
	
	//-------------------------------------------------------
	//	file drop 시 select
	//-------------------------------------------------------
	,	filedropselect	:
			function(evt){
				var e	= window.event || evt;
				try{
					e.stopPropagation();
				    e.preventDefault();
			    } finally{
			    }
			    var f = e.dataTransfer.files; // FileList object.
			    this.fileselect(f,0);
			}
	
	//-------------------------------------------------------
	//	file input select
	//-------------------------------------------------------
	,	fileinputselect	:
			function(evt){
				if ( this.fIE10check ){
					
					/*
					var ff = $hD("#F2_file_select");
					var fd = new FormData(ff);
					fd.append(ff.name, ff.value);
					*/
					
					//	var foo = $hD("#IMS_F2 #F2_file_select");
					//	this.send3(foo, 1);	이 방법은 보안에 위반되어 사용안함
					this.send2();
					
				} else {
					var e	= window.event || evt;
					var f = (e.target || e.srcElement).files;
					this.fileselect(f,0);
				
				}	
			}

	//-------------------------------------------------------
	//	file select
	//-------------------------------------------------------
	,	fileselect	:
			function(fs,fcnt){
				
				if (fcnt > fs.length -1){
					//--**	전송후 그리드를 reload 한다.
					this.fgrid.reload();
					return;
				}
		
				//--**	해당파일을 서버로 전송한다.
				$hLD("#F2_progress_bar").style.width	=	"0";
				this.send(fs, fcnt);
				
			}

	//-------------------------------------------------------
	//	file useyn updateall
	//-------------------------------------------------------
	,	fileuseynupdateall	:
			function(v, endcheck){
				var fooo = this;
				$A.call({url:"/ims/f2/updateuseynall.do", ptype:"json", param : "f2_group_key="+ this.fgroupkey+"&f2_use_yn="+v },function(d){
					fooo.fgrid.reload();
					if (endcheck){
						//--**	callback 수행
						setTimeout(function(){
							fooo.popupclose();
						},2000);
					}
				});
			}
	
	//-------------------------------------------------------
	//	approve	callback 처리
	//-------------------------------------------------------
	,	approve	:
			function(v){
				var v=[];
				
				try{
					
					v.check	=	false;
					$U.each(this.fgrid.data.rows,function(d){
						if (d.f2_use_yn === "N"){
							v.check	=	true;
							return "break";
						}
					})
					
					//--**	삭제하고자 하는 데이타가 있는 경우
					if(v.check){
						if (confirm("삭제하고자 하는 파일정보가 있습니다\r\n확인을 선택하는 경우 삭제확정이 되고\r\n취소를 선택하는 경우 삭제취소가 진행됩니다\r\n선택해주세요 !!")){
							this.fileuseynupdateall("D", true);
						} else {
							this.fileuseynupdateall("Y", true);
						}
						return;
					}
					
					this.popupclose();
					
				} catch(e){
					alert("[ F2 > approve ]" + e);
					
				} finally{
					v	=	null;
				}
			}
	//-------------------------------------------------------
	//	popupclose
	//-------------------------------------------------------
	,	popupclose	:
			function(){
				//--**	callback 수행
				$U.set(this.ftarget,"f2_group_key",this.fgroupkey);
				if (!$U.isNull(this.fcallback)){
					this.fcallback(this.ftarget,this.fgroupkey,this.fgrid.data.rows);
				}
				this.fpopwin.close();
		
			}
	
	//-------------------------------------------------------
	//	popuponlyclose
	//-------------------------------------------------------
	,	popuponlyclose	:
			function(){
				this.fpopwin.close();
			}
	
	//-------------------------------------------------------
	//	file send 
	//-------------------------------------------------------
	,	send	:	
			function(ff, ffcnt){
				
				var f = ff[ffcnt];
				var progobj,rateobj,formData,xhr;
				var stime = new Date().getTime();	
			    
				//IE인경우
				if(window.ActiveXObject){
					xhr = new ActiveXObject('Msxml2.XMLHTTP');
				} else {
					xhr = new XMLHttpRequest();
				}   
			    
			    // 업로드 이벤트 처리  -> xhr.download.onloadstart로 하면 download
				progobj	=	$hLD("#F2_progress");
			    rateobj	=	$hLD("#F2_progress_bar");
			    if (xhr.upload){
					xhr.upload.onloadstart = function(e){};
				    xhr.upload.onprogress= function(e){
						var ptime = new Date().getTime();	
						var mgap  = Math.floor((ptime - stime) / 1000 / 60);
						var sgap  = Math.floor((ptime - stime) / 1000) - (mgap * 60); 
				    	rateobj.style.width	=	( 680 * (e.loaded / e.total)) + "px"; 
				    	progobj.innerHTML	=	"&nbsp;&nbsp;&nbsp;"+ f.name 
				    						+ 	"&nbsp;&nbsp;<span class='percent'>"+Math.round((e.loaded / e.total) * 100 ) + "</span>&nbsp;%"		
				    						+ 	"&nbsp;&nbsp;<span class='ptime'>"+ mgap + "&nbsp;m&nbsp;" + sgap +"&nbsp;s</span>";		
				    };
				    xhr.upload.onload = function( e ){};
			    }
			    
			    //	var contentType = "multipart/form-data; boundary=----WebkitFormBoundary" + (new Date).getTime();
			    //	지정하면 크롬, 사파리, 파폭에서 처리 안됨 뺼것
			    formData	=	new FormData();
				formData.append("file", f );
				formData.append("filename="+f.name, "" );
				formData.append("fgroupkey="+this.fgroupkey, "" );
				
				xhr.open("POST", "/FileUploadManage", true);	
				
				if (IDV_BROWSER.IE === "Y" && IDV_BROWSER.NAME !== "edge"){
					var contentType = "multipart/form-data; boundary=AJAX--------------" + (new Date).getTime();
			    	xhr.setRequestHeader("Content-Type", contentType );
				}
				
				var fooo = this;
			    xhr.onreadystatechange = function() {
			        if (xhr.readyState === 4) {
				    	
			        	switch (xhr.status){
				     	case 200 :
					    	rateobj.style.width	=	0; 
					    	progobj.innerHTML	=	"";		
				     		fooo.fileselect(ff,++ffcnt);
				     		break;     
				     	default:
							if ( xhr.status !== 0 ){
								if (confirm("[" + xhr.status + "]\r\n File Upload Error !!\r\nNext File Upload Process??")){
							    	rateobj.style.width	=	0; 
							    	progobj.innerHTML	=	"";		
						     		fooo.fileselect(ff,++ffcnt);
								} 
							}
				     		break;  
				    	}
			        }
			    };
			    xhr.send(formData);
			}

	//-------------------------------------------------------
	//	file send2	IE 10 이하 
    //	------------------------------------------
 	//	멀티파트 폼데이타를 사용하여 처리함
	//-------------------------------------------------------
	,	send2	:
			function(){
				var v =[];
				try{
					var tooo	=	this;
					var prog	=	$hD("#IMS_F2 #F2_progress");
					prog.innerHTML	=	"   파일 업로드 처리중입니다";
					v.form		=	$hD("#IMS_F2 #F2_ie_file_upload_form");
					$hD("input[name=F2_fgroupkey]", v.form).value =	this.fgroupkey;
					v.form.target	=	"F2_iframe_target";
					$hD("iframe[name=F2_iframe_target]").onload	=	function(){
						tooo.fgrid.reload();
						prog.innerHTML	=	"   파일 업로드 완료되었습니다";
						setTimeout(function(){	prog.innerHTML	=	""; }, 3000);
					}
					v.form.submit();
					
				}catch(e){
					alert("IMS_F2 > send2 Error -> " + e)
				} finally{
					v	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	file send3	IE 10 이하 
    //	------------------------------------------
 	//	ie 10 이하 버전에서는 다음을 사용한다.
	//	이때에는 iereadfile 이 성립되도록 소스를 확인하여야 한다
	//	ie 10 이상에서는 formData를 사용한다.
	//	var data = this.builddata(files, boundary);
	//	xhr.send(data);
	//	*******   
	//
	//	[[ 이 방법은 ActiveX 스크립트를 사용하므모 보안에 위배되어 사용안함 ]]
	//
	//-------------------------------------------------------
	,	send3	:	
			function(ff, ffcnt){
				
				var f = ff[ffcnt];
				var progobj,rateobj,formData,xhr;
				var stime = new Date().getTime();	
			    
				//IE인경우
				if(window.ActiveXObject){
					xhr = new ActiveXObject('Msxml2.XMLHTTP');
				} else {
					xhr = new XMLHttpRequest();
				}   
			    
				var formData = this.builddata(ff, "AJAX--------------");
				progobj	=	$hLD("#F2_progress");
			    rateobj	=	$hLD("#F2_progress_bar");
				
				xhr.open("POST", "/FileUploadManage", true);	
				
				if (IDV_BROWSER.IE === "Y" && IDV_BROWSER.NAME !== "edge"){
					var contentType = "multipart/form-data; boundary=AJAX--------------" + (new Date).getTime();
			    	xhr.setRequestHeader("Content-Type", contentType );
				}
				
				var fooo = this;
			    xhr.onreadystatechange = function() {
			        if (xhr.readyState === 4) {
				    	
			        	switch (xhr.status){
				     	case 200 :
					    	rateobj.style.width	=	0; 
					    	progobj.innerHTML	=	"";		
				     		fooo.fileselect(ff,++ffcnt);
				     		break;     
				     	default:
							if ( xhr.status !== 0 ){
								if (confirm("[" + xhr.status + "]\r\n File Upload Error !!\r\nNext File Upload Process??")){
							    	rateobj.style.width	=	0; 
							    	progobj.innerHTML	=	"";		
						     		fooo.fileselect(ff,++ffcnt);
								} 
							}
				     		break;  
				    	}
			        }
			    };
			    xhr.send(formData);
			}
	
	//-------------------------------------------------------
	//	file data build	- IE10 이하
	//-------------------------------------------------------
	,	builddata	:	
			function(elements, boundary) {
		    	var CRLF 	=	"\r\n";
		    	var parts 	= 	[];
		    	var part	=	"";
		    	
		    	if ($U.isNull(elements.length)){

		            //--**	파일
		    		part	+= 'Content-Disposition: form-data; '
		            		+	'name="file"; '
		            		+	"Content-Type: application/octet-stream"
		            		+	CRLF + CRLF	// marks end of the headers part
		            		+	this.getfilecontent(elements) + CRLF;
		            parts.push(part);

		            //--**	파일명
		            part	+= 'Content-Disposition: form-data; '
		            		+	'name="filename='+elements.name+'"; '
		            		+	"Content-Type: text/html"
		            		+	CRLF + CRLF	// marks end of the headers part
		            		+	"" + CRLF;
		            parts.push(part);
		            
		            //--**	파일 그룹 key
		            part	+= 'Content-Disposition: form-data; '
		            		+	'name="fgroupkey='+this.fgroupkey+'"; '
		            		+	"Content-Type: text/html"
		            		+	CRLF + CRLF	// marks end of the headers part
		            		+	"" + CRLF;
		            parts.push(part);
		    		
		    	} else {
			    	
		    		for (var i=0,element; element=elements[i]; i+=1){
			    		
			            //--**	파일
			    		part	+= 'Content-Disposition: form-data; '
			            		+	'name="file"; '
			            		+	"Content-Type: application/octet-stream"
			            		+	CRLF + CRLF	// marks end of the headers part
			            		+	this.getfilecontent(element) + CRLF;
			            parts.push(part);

			            //--**	파일명
			            part	+= 'Content-Disposition: form-data; '
			            		+	'name="filename='+element.name+'"; '
			            		+	"Content-Type: text/html"
			            		+	CRLF + CRLF	// marks end of the headers part
			            		+	"" + CRLF;
			            parts.push(part);
			            
			            //--**	파일 그룹 key
			            part	+= 'Content-Disposition: form-data; '
			            		+	'name="fgroupkey='+this.fgroupkey+'"; '
			            		+	"Content-Type: text/html"
			            		+	CRLF + CRLF	// marks end of the headers part
			            		+	"" + CRLF;
			            parts.push(part);
			            
			    	};
		    		
		    	}
		    	

			    var request = 	"--" + boundary + CRLF
		    				+	parts.join("--" + boundary + CRLF)
		    				+	"--" + boundary + "--" + CRLF;
		
			    return request;
			}	
	
	//-------------------------------------------------------
	//	file content get		- IE10 이하
	//-------------------------------------------------------
	,	getfilecontent	:	
			function (file){
				if (IDV_BROWSER.IE === "Y") {
				    // try the IE method
				    return this.iereadfile(file);
				}else {
				    var reader = new FileReader();
				    reader.readAsText(file, "UTF-8");
				    reader.onload = function (evt) {
				        return evt.target.result;
				    };
				}		
			}	
	
	//-------------------------------------------------------
	//	ie file content get	- IE10 이하
	//-------------------------------------------------------
	,	iereadfile	:	
			function(file){
		    	var fso  = new ActiveXObject("Scripting.FileSystemObject"); 
		    	var fh = fso.OpenTextFile(filename, 1); 
		    	var contents = fh.ReadAll(); 
		    	fh.Close();
		    	return contents;
			}

	//-------------------------------------------------------
	//	file template download open 2  		
	//-------------------------------------------------------
	,	downloadopen	:	
			function(mkey,tobj){
				tobj.innerHTML	=	$hD("#template_F2_download_frame").innerHTML;
				new G2(		$hD("#F2_download_list", tobj)
						,	{InitialSearch:true}
						, 	"f2_list_type=mass&f2_mass_group_key=" + mkey 
						, 	{ initsort : {sortid:"f2_regist_datetime",sorttype:"DESC"} });
			}
	
}

$U.ready(document,function(){
	F2.begin();
});

//--**	사이즈를 단위에 맞추어 출력
function ims_f2_sizeconverter(d,ad){
	if (d > (1024 * 1024  * 1024)){
		return (Math.floor((( d / (1024 * 1024)) / 1024) * 100) / 100) + " GB";
	}
	if (d > (1024 * 1024)){
		return (Math.floor((( d / 1024 ) / 1024)*100) / 100) + " MB";
	}
	if (d > 1024){
		return (Math.floor( (d / 1024) * 100 ) / 100) + " KB";
	}
	return d; 
}

//--**	사용여부 칼라 구분함
function ims_f2_useyn_formatter(d,ad){
	if ( d === "Y"){
		return "<font style='color:blue;font-weight:bolder'>&nbsp;" + d + "</font>"; 
	} else {
		return "<font style='color:red;font-weight:bolder'>&nbsp;" + d + "</font>"; 
	}
}

//--**	사용과 삭제대기 switch
function ims_f2_useyn_click(d,ad){
	$A.call({url:"/ims/f2/updateuseyn.do", ptype:"json", param : "f2_key="+ad.f2_key+"&f2_use_yn="+(d === "Y" ? "N" :"Y")},function(d){
		F2.fgrid.reload();
	});
}

//--**	file download
function ims_f2_download(d,ad){
	$hD("#ims_f2_fileDownloadFrm input[name=f2_key]").value = ad.f2_key;
	$hD("#ims_f2_fileDownloadFrm").submit();
}

//--**	file list
function ims_f2_getlist(fkey,ftype,callback){
	var p	=	"getdata=*&rowFirst=0&pageRowCnt=1000&rowLast=1000&";
	if (ftype==="group"){
		p	+=	"f2_list_type=group&f2_mass_group_key=&f2_group_key=" + fkey;
	} else {
		p	+=	"f2_list_type=mass&f2_group_key=&f2_mass_group_key=" + fkey;
	}
	$A.call({url:"/ims/f2/list.do",param:p,ptype:"string"},function(d){
		callback(d.rows);
	})
}
