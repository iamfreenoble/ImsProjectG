/*=================================================================================
 *	[ description ]	
 *		-	2019.08.02	이상준 	사용자 선택 팝업 (공통 )
=================================================================================*/

var CUserSelectComm	=	{
		
		grid	:	null
	,	popwin	:	null
	,	callback :	null
		
	//---------------------------------
	//	begin
	//---------------------------------
	,	begin	:
			function(){
		
				$G.push(this);	//--**	가비지 처리 필수임

				this.formload();
			}
	
	//---------------------------------
	//	form load
	//---------------------------------
	,	formload	:
			function(){
				$U.load(IMS_config.path +"/business/form/userSelectCommForm.html", function(d){ $U.insertHTML($hD("#frame_main"),"beforeend", d); } );
			}

	//---------------------------------
	//	선택 팝업 오픈
	//---------------------------------
	,	popupselect	:	
			function(ptarget,callback){
				this.target	=	ptarget;	
				this.callback	=	callback;
				var ooo = this;
				this.popwin = new $P({	target		:	ooo
									,	template	:	"#UserSelectComm_Popup"
									,	title		:	"사용자 선택"
									,	button		:	"Cancel"		//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
									,	custombutton  :	"button01"		//	button01 ~ button10 중 선택
									,	afterOpen	:	function(poo){
								
										try{
											
											//gfnSelectboxSet($hD("select[name=degree_cd]", $hD("form[name=UserInfoForm]")), "school_degree", null);
											
											//--**	textarea 자동 높이 조절
											gfnTextareaAutoheight();
											
											//--**	button event binding
											//--**	custombutton event binding
											//--**	custombutton value binding
											$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
											$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.apply(); });
											$hD("a",poo.custombuttonobj["button01"]).innerHTML = "적용";
											
											//--**	Grid init...
											ooo.grid = new G2($hD("#userSelectList"),{InitialSearch:true});
											
										} catch(e){
											alert("[ UserSelectComm > user select popup call ]" + e);
										} finally {
										}	
									
									}	
								},{w:1024,h:860,mw:500,mh:600}
					);
			
			}

	//---------------------------------
	//	select
	//---------------------------------
	,	select	:
			function(d,ad){
				var t,f,tbody,utypecd,utypenm;
				try{
					
					f 	= 	$hD("#UserSelectCommFrame");
					t 	= 	"<tr>"
						+	"<td user_id='{0}'>{1}</th>"
						+	"<td class='alc'>{2}</td>"
						+	"<td class='alc'>{3}</td>"
						+	"<td class='alc'>{4}</td>"
						+	"<td class='alc'>{5}</td>"
						+	"<td class='alc'>{6}</td>"
						+	"<td class='alc curp' onclick='$U.remove(this.parentElement)'><i class=\"fas fa-user-minus\"></i></td>"
						+	"</tr>";
					
					//--**	정합성 체크
					if (!this.validate(ad)){
						return;
					}
					
					t	=	$U.format(t, 		ad.user_id
											,	ad.user_nm
											,	ad.school
											,	ad.pos
											,	ad.major
											,	ad.hp1
											,	ad.email);
					
					tbody	=	$hD("#selectUserCommFrame table tbody", f);
					$U.insertHTML(tbody,"beforeend", t);
					
				} catch(e){
					alert("[ CUserSelectComm > select ]" + e);
				} finally{
				}
			}
	
	//---------------------------------
	//	apply
	//---------------------------------
	,	apply	:
			function(){
				
				//--**	화면 닫기
				var oooo = this;
				setTimeout(function(){
					oooo.popwin.close();
				},500);
				
				if (!$U.isNull(this.callback)){
					
					var troo = $hA("#UserSelectCommFrame > #selectUserCommFrame table tbody tr");
					var p = new Array();
					$U.each(troo,function(uooo){
						
						var tdoo = $hA("td", uooo);
						if (tdoo.length !== 0){	//--**	non header
							p.push(	{	"user_id"	:	$U.get(tdoo[0],"user_id")
									, 	"user_nm"	: 	tdoo[0].innerHTML
									, 	"school"	: 	tdoo[1].innerHTML
									, 	"pos"		: 	tdoo[2].innerHTML
									, 	"major"		: 	tdoo[3].innerHTML
									, 	"hp1"		: 	tdoo[4].innerHTML
									, 	"email"		: 	tdoo[5].innerHTML
									,	"commissioner_id"	:	$U.get(tdoo[0],"user_id")
									, 	"commissioner_name"	: 	tdoo[0].innerHTML
									, 	"position"	: 	tdoo[2].innerHTML
									, 	"science"	: 	""
									, 	"agency"	: 	""
									, 	"expedited_reviewer"	: 	""
									});
						}
					});
					this.callback(p);
				}
			}
	
	//---------------------------------
	//	validate
	//---------------------------------
	,	validate	:
			function(ad){
				
				var chk_userid,tdo;
		
				try{
					//--**	01 user_type 여부와 동일 user_id 를 판단
					chk_userid	=	false;
					tdo = $hA("td", $hD("#UserSelectCommFrame > #selectUserCommFrame"));
					$U.each(tdo,function(o){
						if (ad.user_id === $U.get(o,"user_id")){
							chk_userid	=	true;
							return "break";
						}
					})
					
					//--**	동일 사용자가 있을경우 즉시 중지
					if (chk_userid){
						alert("동일 사용자가 존재합니다.");
						return false;
					}
					
				} catch(e){
					alert("[ CUserSelectComm > validate ]" + e);
				} finally{
					chk_userid	=	null;
					tho	=	null;
				}
				
				return true;
			}
	
	
}

$U.ready($hD("#committeeManagementList"),function(){
	CUserSelectComm.begin();
});

//--**	Grid 에서 선택시
function lfnCallCUserSelectCommSelect(d,ad){
	CUserSelectComm.select(d,ad);
}
