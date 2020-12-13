/*=================================================================================
 *	[ description ]	
 *		-	2018.12.02	이상준 	사용자 선택 팝업
=================================================================================*/

var CUserSelect	=	{
		
		grid	:	null
	,	popwin	:	null
	,	target	:	null
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
				$U.load(IMS_config.path +"/business/form/userSelectForm.html", function(d){ $U.insertHTML($hD("#frame_main"),"beforeend", d); } );
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
									,	template	:	"#UserSelect_Popup"
									,	title		:	"사용자 선택"
									,	button		:	"Cancel"		//	Save, Delete, Confirm, Select, Search, Cancel	중 선택
									,	custombutton  :	"button01"		//	button01 ~ button10 중 선택
									,	afterOpen	:	function(poo){
								
										try{
											
											//--**	textarea 자동 높이 조절
											gfnTextareaAutoheight();
											
											//--**	button event binding
											$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
											
											//--**	custombutton event binding
											$U.eventbind(poo.custombuttonobj["button01"], "onclick", function(){ poo.attr.target.apply(); });
											
											//--**	custombutton value binding
											$hD("a",poo.custombuttonobj["button01"]).innerHTML = "적용";
											
											//--**	Grid init...
											ooo.grid = new G2($hD("#userSelectList"),{InitialSearch:true});
											
											//--**	부모의 선택 부분을 선택팝업에 출력
											$hD("#UserSelectFrame > #selectUserFrame").innerHTML = poo.attr.target.target.innerHTML;
											
										} catch(e){
											alert("[ UserSelect > user select popup call ]" + e);
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
					
					f 	= 	$hD("#UserSelectFrame");
					t 	= 	"<tr>"
						+	"<th user_id='{0}' user_type='{1}' user_name='{3}'>{2}</th>"
						+	"<td class='alc'>{3}</td><td>{4}</td><td class='alc'>{5}</td><td>{6}</td><td></td><td class='alc curp' onclick='$U.remove(this.parentElement)'><i class=\"fas fa-user-minus\"></i></td>"
						+	"</tr>";
					
					utypecd	=	"";
					utypenm	=	"";
					$U.each($hA("input[name=user_type]",f), function(oo){
						if (oo.checked){
							utypecd	=	oo.value;
							utypenm	=	oo.nextElementSibling.innerHTML;
							return "break";
						}
					});
					
					//--**	정합성 체크
					if (!this.validate(ad,utypecd)){
						return;
					}
					
					t	=	$U.format(t, 		ad.user_id
											,	utypecd
											,	utypenm
											,	ad.user_nm
											,	ad.school
											,	ad.pos
											,	ad.hp1);
					
					tbody	=	$hD("#selectUserFrame table tbody", f);
					$U.insertHTML(tbody,"beforeend", t);
					
				} catch(e){
					alert("[ CUserInfo > select ]" + e);
				} finally{
				}
			}
	
	//---------------------------------
	//	apply
	//---------------------------------
	,	apply	:
			function(){
				this.target.innerHTML	=	$hD("#UserSelectFrame > #selectUserFrame").innerHTML;
				if (!$U.isNull(this.callback)){
					
					var uoo = $hA("#UserSelectFrame > #selectUserFrame table tbody th");
					var p = new Array();
					$U.each(uoo,function(uooo){
						if (!$U.isNull($U.get(uooo,"user_id"))){
							p.push({"user_id":$U.get(uooo,"user_id"), "user_type": $U.get(uooo,"user_type"), "user_name": $U.get(uooo,"user_name")});
						}
					});
					this.callback(p);
					
				}
				this.popwin.close();
			}
	
	//---------------------------------
	//	validate
	//---------------------------------
	,	validate	:
			function(ad,utypecd){
				
				var chk_userid,chk_01usertype,tho,ooo;
		
				try{
					//--**	연구책임자는 1인... 선택영역에 연구책임자가 있는경우
					//--**	체크를 다음 컬럼으로 옮기고 오브젝트를 disable 처리
					//--**	현재 선택이 연구책임자이고 선택영역에 없으면 선택영역에 1줄 생성처리하고 
					//--**	체크를 다음 컬럼으로 옮기고 오브젝트를 disable 처리
					
					//--**	01 user_type 여부와 동일 user_id 를 판단
					chk_userid	=	false;
					chk_01usertype	=	false;
					tho = $hA("th", $hD("#UserSelectFrame > #selectUserFrame"));
					$U.each(tho,function(o){
						if ("01" === $U.get(o,"user_type")){
							chk_01usertype	=	true;
						}
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
					
					//--**	연구책임자가 존재하는데 또다시 연구책임자를 등록하는 경우
					if (utypecd === "01" && chk_01usertype){
						alert("연구책임자는 1명입니다.");
						ooo = $hA("input[name=user_type]", $hD("#UserSelectFrame"))[0];
						ooo.disabled	=	true;
						ooo.nextElementSibling.nextElementSibling.checked = "checked";
						return false;
					}
					
					//--**	연구책임자를 등록하는 경우, 연구책임자 선택을 disable 처리
					if (utypecd === "01"){
						ooo = $hA("input[name=user_type]", $hD("#UserSelectFrame"))[0];
						ooo.disabled	=	true;
						ooo.nextElementSibling.nextElementSibling.checked = "checked";
					}	
					
				} catch(e){
					alert("[ CUserInfo > validate ]" + e);
				} finally{
					chk_userid	=	null;
					chk_01usertype	=	null;
					tho	=	null;
					ooo	=	null;
				}
				
				return true;
			}
	
	
}

$U.ready($hD(".bootContainer"),function(){
	CUserSelect.begin();
});


function lfnCallCUserSelectSelect(d,ad){
	CUserSelect.select(d,ad);
}
