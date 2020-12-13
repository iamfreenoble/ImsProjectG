/*=================================================================================
 *	[ description ]	
 *		-	2020.03.28	이상준 	G2 Basic List
=================================================================================*/

var CR_G2Double	=	{
		
		grid		:	null
	,	grid2		:	null
	,	registForm	:	null	
	,	popwin		:	null
		
	//---------------------------------
	//	begin
	//---------------------------------
	,	begin	:
			function(){
				$G.push(this);	//--**	가비지 처리 필수임
				this.grid 	= 	new G2($hD("#G2DoubleList01"),{InitialSearch:true});
				this.grid2 	=	new G2($hD("#G2DoubleList02"),{InitialSearch:true});
				this.buttonset();
				this.formload();
			}
	
	//---------------------------------
	//	button set
	//---------------------------------
	,	buttonset	:
			function(){
				$U.each($hA("span"),function(o){
					switch($U.get(o,"gubun")){
					case "insert" : 
						$U.eventbind(o, "onclick" , function(){ CR_G2Double.popupregist(); });
						break;
					}
				});
			}

	//---------------------------------
	//	form load
	//---------------------------------
	,	formload	:
			function(){
				$U.load(IMS_config.path +"/business/form/userInfoForm.html", function(d){ $U.insertHTML($hD("#frame_main"),"beforeend", d); } );
			}
	
	//---------------------------------
	//	list
	//---------------------------------
	,	list	:
			function(){
				this.grid.call();
			}

	//---------------------------------
	//	등록 팝업 오픈
	//---------------------------------
	,	popupregist	:	
			function(){
				var ooo = this;
				this.popwin = new $P({	target		:	ooo
						,	template	:	"#UserInfo_Regist"
						,	title		:	"사용자 정보 등록"
						,	button		:	"Save,Cancel"		//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
						,	afterOpen	:	function(poo){
								
								try{
									
									//--**	textarea 자동 높이 조절
									gfnTextareaAutoheight();
									
									gfnPlaceholderSet("UserInfoForm");
									gfnSelectboxSet($hD("select[name=degree_cd]", $hD("form[name=UserInfoForm]")), "school_degree", null);
									
									//--**	button event binding
									$U.eventbind(poo.buttonobj["Save"], "onclick", function(){ poo.attr.target.regist(); });
									$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
									
								} catch(e){
									alert("[ CR_G2Double > regist popup call ]" + e);
								} finally {
								}	
							
							}	
						},{w:1024,h:550,mw:300,mh:300}
					);
			
			}

	//---------------------------------
	//	regist
	//---------------------------------
	,	regist	:
			function(opt){
				try{
					if (!this.validate()){
						return;
					}
					
					var ooo = this;
					$A.call({url:"/userInfo/insert.do",ptarget:$hD("form[name=UserInfoForm]")},function(d){
					  alert("등록되었습니다!!");
					  ooo.list();
					  ooo.popwin.close();
					});
					
				} catch(e){
					alert("[ CR_G2Double > regist ]" + e);
				} finally{
				}
			}

	//---------------------------------
	//	수정 팝업 오픈
	//---------------------------------
	,	popupupdate	:	
			function(id){
				var ooo = this;
				this.popwin = new $P({	target		:	ooo
									,	template	:	"#UserInfo_Regist"
									,	title		:	"사용자 정보 수정"
									,	button		:	"Save,Delete,Cancel"		//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
									,	afterOpen	:	function(poo){
											
											try{
												
												//--**	textarea 자동 높이 조절
												gfnTextareaAutoheight();
												
												gfnPlaceholderSet("UserInfoForm");
												gfnSelectboxSet($hD("select[name=degree_cd]", $hD("form[name=UserInfoForm]")), "school_degree", null);
												
												//--**	button event binding
												$U.eventbind(poo.buttonobj["Save"], "onclick", function(){ poo.attr.target.update(); });
												$U.eventbind(poo.buttonobj["Delete"], "onclick", function(){ poo.attr.target.remove(); });
												$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });

												//--**	조회값 세팅
												$hD("input[name=user_id]",$hD("form[name=UserInfoForm]")).value = id;
												$A.call({url:"/userInfo/view.do",ptarget:$hD("form[name=UserInfoForm]")},function(d){
													$H.datasync("UserInfoForm", d);
													//CR_G2Double.convertPw(d);
												});
												
												
											} catch(e){
												alert("[ UserInfo > update popup call ]" + e);
											} finally {
											}	
										
										}	
									},{w:1024,h:550,mw:300,mh:300}
								);
			
			}
	
	//---------------------------------
	//	convertPw  패스워드복호화
	//---------------------------------
	,	convertPw	:
			function(d){alert(d.user_pw);
				var ooo = this;
				$A.call({url:"/userInfo/convertPw.do",ptype:"string",param:"user_pw="+d.user_pw},function(d){
					$hD("form[name=UserInfoForm] input[name=user_pw]").value=d;
				});
			}
	//---------------------------------
	//	update
	//---------------------------------
	,	update	:
			function(){
				if (!this.validate()){
					return;
				}
				
				var ooo = this;
				$A.call({url:"/userInfo/update.do",ptarget:$hD("form[name=UserInfoForm]")},function(d){
				  alert("수정되었습니다!!");
				  ooo.list();
				  ooo.popwin.close();
				});
			}

	//---------------------------------
	//	validate
	//---------------------------------
	,	validate	:
			function(){
				if (!$V.validate("UserInfoForm")){
					return false;
				}
				return true;
			}
	
	
	//---------------------------------
	//	remove
	//---------------------------------
	,	remove	:
			function(){
				var ooo = this;
				$A.call({url:"/userInfo/remove.do",ptarget:$hD("form[name=UserInfoForm]")},function(d){
				  alert("삭제되었습니다!!");
				  ooo.list();
				  ooo.popwin.close();
				});
			}
	
}

$U.ready($hD(".bootContainer"),function(){
	CR_G2Double.begin();
});
