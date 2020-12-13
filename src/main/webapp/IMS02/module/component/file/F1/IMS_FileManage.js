/*=================================================================================
 *	파 일 명		: IMS_FileManage.js
 *	작성목적		: HTML5 파일 업로드 / 다운로드
 *	작 성 자		: 이상준
 *	최초작성일	: 2014.05.25
 *	최종작성일	:
 *	수정내역		:
=================================================================================*/

//===================================================================
//	File Upload / Download
//===================================================================

//	file 전송후 서버에서 파일로 write
//	결국 file 전송 + file 생성으로 리스너 구성함
var _FM_FW_PROG	=	null;
var _FM_FW_TEXT	=	null;
function FileManage_fwritechk(fname){
	if ( _FM_FW_PROG === null){
		_FM_FW_PROG	=	$hA(".fsendprog02",$hD("#filezone_01"))[0];
		_FM_FW_TEXT		=	$hA(".fsendtext02",$hD("#filezone_01"))[0];
	}
    $A.call({url:"/filemanage/filewrite/check.do",loading:false, param:"fname="+fname}, function(d){
    	_FM_FW_PROG.style.backgroundPosition	=	(( 225 * ( Number(d) /100 )) - 225 ) + "px 0"; 
    	_FM_FW_TEXT.innerHTML	=	"파일생성("+d + "%)";		
    	if ( Number(d) < 100){
        	setTimeout(function(){ FileManage_fwritechk(fname); },10);
    	} else {
    	    $A.call({url:"/filemanage/filewrite/delete.do",loading:false, param:"fname="+fname}, function(d){
    	    });	
    	}
    });
}

var FileManage = {
		
		filedata	:	[]
	,	fileformat		:	"<li fileid='{0}'><div class='progdiv'><span></span></div><a class='progressrate'>0%</a>&nbsp;<div class='fileinfo'><strong>{0}</strong> ({1}) - {2} kb</div></li>"	
	,	fileprocesschk	:	""
		
	//-------------------------------------------------------
	//	drag over 		
	//-------------------------------------------------------
	,	dragover :	
			function(evt){
			    evt.stopPropagation();
			    evt.preventDefault();
			    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			}
	
	//-------------------------------------------------------
	//	drag over 		
	//-------------------------------------------------------
	,	drop :	
			function(evt){
				FileManage.filedropselect(evt);
			}
	
	//-------------------------------------------------------
	//	file drop 시 select
	//-------------------------------------------------------
	,	filedropselect :	
			function(evt){
				var f; 
				try{
					evt.stopPropagation();
				    evt.preventDefault();
				    f = evt.dataTransfer.files; // FileList object.
				    FileManage.fileselect(f,evt);
			    } finally{
			    	f = null;
			    }
			}
	
	//-------------------------------------------------------
	//	file input select
	//-------------------------------------------------------
	,	fileinputselect :	
			function(evt){
				var f ;
				try{
					f = (evt.target || evt.srcElement).files;
					FileManage.fileselect(f,evt);
				} finally{
					f	=	null;
				}
			}

	//-------------------------------------------------------
	//	file select
	//-------------------------------------------------------
	,	fileselect :	
			function(fs,evt){
				var output;
				try{
					/*
					output = [];
				    for (var i = 0, f; f = fs[i]; i++) {
				      output.push($U.format(this.fileformat, f.name, f.type || "n/a", Math.round( (f.size / 1024) * 100) / 100));
				    }
				    $T("span",(evt.target || evt.srcElement).parentElement)[1].innerHTML = "<ul>" + output.join("") + "</ul>";
				    */
					
					$hA(".filezone", $hD("#filezone_01"))[0].innerHTML = $U.format("<div class='fileinfo'><strong>{0}</strong><br>{1}<br>{2} kb</div>", fs[0].name, fs[0].type || "n/a", Math.round( (fs[0].size / 1024) * 100) / 100 );
				    FileManage.filedata.set(event.srcElement.parentElement.id, fs);
		    	} finally{
					output	=	null;
		    	}
			}
	
	//-------------------------------------------------------
	//	file send 
	//-------------------------------------------------------
	,	send :
			function(id, callback){
				var fs;
				try{
					fs = FileManage.filedata.get(id);
					if	(fs === null || fs.length === 0){
						callback("Send file not exists!!");
						return;
					}
					this.fileprocesschk	=	"S";
					this.sendchk(id,fs,0,callback);
				} finally{
					fs	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	file send process
	//-------------------------------------------------------
	,	sendchk :
			function(id, fs, icnt, callback){
				if (this.fileprocesschk === "E"){
					callback("File send error!!!");
					return;
				}
				
				if (this.fileprocesschk === "S"){
					if (icnt === fs.length) { 
						callback("OK");
						return; 
					}
					
					this.sendprocess(id, fs[icnt++]);	
				}
				
				setTimeout(function(){
					FileManage.sendchk(id, fs, icnt, callback);
				},1000);
			}
	
	
	//-------------------------------------------------------
	//	file send 
	//-------------------------------------------------------
	,	sendprocess : 
			function(id,f){

				var progobj,rateobj,formData;
				this.fileprocesschk = "P";
				/*var objarr = $T("li",$D(id));
				var progobj	=	null;
				var rateobj	=	null;
				for (var x=0,obj; obj=objarr[x]; x+=1){
					if ($U.get(obj,"fileid") === f.name){
						progobj	=	obj.childNodes[0].childNodes[0];
						rateobj	=	obj.childNodes[1];
						break;
					}
				}*/
			    
				xhr = new XMLHttpRequest();
			    
			    // 업로드 이벤트 처리  -> xhr.download.onloadstart로 하면 download
			    xhr.upload.onloadstart = function(e){};
			    
				progobj	=	$hA(".fsendprog01",$hD("#filezone_01"))[0];
			    rateobj	=	$hA(".fsendtext01",$hD("#filezone_01"))[0];
			    xhr.upload.onprogress= function(e){
			    	progobj.style.backgroundPosition	=	(( 225 * (e.loaded / e.total)) - 225 ) + "px"; 
			    	rateobj.innerHTML	=	"파일전송("+Math.round((e.loaded / e.total) * 100 ) + "%)";		
				    if ( Math.round((e.loaded / e.total) * 100) > 99){
				    	FileManage_fwritechk(f.name);
				    }
			    };
	
			    xhr.upload.onload = function( e ){};
			    
			    //	var contentType = "multipart/form-data; boundary=----WebkitFormBoundary" + (new Date).getTime();
			    //	지정하면 크롬, 사파리, 파폭에서 처리 안됨 뺼것
			    formData	=	new FormData();
	    		formData.append("file", f );
	    		
	    		xhr.open("POST", "/FileUploadManage", true);	
	    		
	    		if (IDV_BROWSER.IE === "Y"){
	    			//var contentType = "multipart/form-data; boundary=AJAX--------------" + (new Date).getTime();
			    	//xhr.setRequestHeader("Content-Type", contentType );
	    		}
	    		
			    xhr.onreadystatechange = function() {
			        if (xhr.readyState === 4) {
				    	switch (xhr.status){
				     	case 200 :
				     		break;     
				     	default:
							if ( xhr.status !== 0 ){
								alert("[" + xhr.status + "]\r\n"	+	xhr.statusText);
							}
				     		break;  
				    	}
				    	FileManage.fileprocesschk	=	(xhr.status === 200 ? "S" : "E");
			        }
			        
			    };
			    xhr.send(formData);
			
			}

    /*
     	ie 10 이하 버전에서는 다음을 사용한다.
    	이때에는 iereadfile 이 성립되도록 소스를 확인하여야 한다
    	ie 10 이상에서는 formData를 사용한다.
    	var data = this.builddata(files, boundary);
    	xhr.send(data);
     */		    
	
	//-------------------------------------------------------
	//	file data build	- IE10 이하
	//-------------------------------------------------------
	,	builddata : 
			function(elements, boundary) {
		    	var CRLF 	=	"\r\n";
		    	var parts 	= 	[];
		    	var part		=	"";
	
		    	for (var i=0,element; element=elements[i]; i+=1){
		    		
		            part	+= 'Content-Disposition: form-data; '
		            		+	'name="file"; '
		            		+ 	'filename="'+ element.name + '"' + CRLF
		            		+	"Content-Type: application/octet-stream"
		            		+	CRLF + CRLF	// marks end of the headers part
		            		+	FileManage.getfilecontent(element) + CRLF;
		            parts.push(part);
		    		
		    	};

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
				    return FileManage.iereadfile(file);
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

};	


