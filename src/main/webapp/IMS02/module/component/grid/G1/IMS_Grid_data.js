/*=================================================================================
 *	파 일 명		: IMS_Grid_data.js
 *	작성목적		: Grid DATA 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일	: 2013.08.29
 *	최종작성일	:
 *	수정내역		:
 *				2014-03-28		이상준		함수 추가 및 수정
 *				
=================================================================================*/

//-------------------------------------------------------
//		Grid Data
//-------------------------------------------------------
var Griddata	=	{
		
		dataset 		: 	[]
	,	origindataset 	: 	[]
	,	paramset 	: 	[]
	,	deldataset 	:	[]
	,	sortdataset	:	[]
	,	filterdataset	:	[]
	,	beforedataset	:	[]
	,	footertimeout	:	null
	
	//-------------------------------------------------------
	//	data 가져오기
	//	- getdata		:	JSON의 string 형태
	//	- getrowdata 	: 	JSON의 string 형태 data 중 rows 정보만
	//			id			:	data id
	//			opt		:	null 인경우 변경 데이타
	//							all -> 전체 데이타
	//			rowsyn	:	rows 데이타만 여부, null 이면 모두 임
	//			nonencode	:	encode 여부  true -> encode 하지 않음. 기본 encode
	//			basevaluepass	:	base value 를 합칠것인가 여부
	//								STATUS, chk, EXT-ROWINDEX
	//-------------------------------------------------------
	,	getdata	:
			function(id,opt,rowsyn, nonencode, basevaluepass){
				var data	=	Griddata.dataset.get(id);
				if ($U.isNull(data)) return null;
				
				var retval	=	null;
				var icnt		=	-1;
				var arrHead	=	$U.get($D(id), "HEADID").split(",");
				
				switch(opt){
					case	"all"	:		
					case	"ALL"	:		
						
						icnt 	= 	-1;
						retval	=	$U.clone(data);
						while (!$U.isNull(retval.rows[++icnt])){
							for (var i=0,j=arrHead.length; i<j; i+=1){
								if (basevaluepass){
									if (arrHead[i] === "STATUS" || arrHead[i] === "chk" || arrHead[i] === "EXT-ROWINDEX") continue;
								}
								retval.rows[icnt][arrHead[i]]	=	nonencode ? $U.nvl(retval.rows[icnt][arrHead[i]],"") : encodeURIComponent($U.nvl(retval.rows[icnt][arrHead[i]],""));
							}
						}
						retval = JSON.stringify(( rowsyn === true ? retval.rows : retval));
						break;
					
					default	:
						
						var deldata		=	Griddata.deldataset.get(id);
						var chgdataset 	= 	JSON.parse(JSON.stringify(data));
						chgdataset.rows	= 	[];
						for (var i=0,j=data.rows.length; i<j; i+=1){
							if (data.rows[i].STATUS === "U" || data.rows[i].STATUS === "A"){
								
								retval	=	$U.clone(data.rows[i]);
								for (var q=0,w=arrHead.length; q<w; q+=1){
									if (basevaluepass){
										delete retval["EXT-ROWINDEX"];
										if (arrHead[q] === "STATUS" || arrHead[q] === "chk" || arrHead[q] === "EXT-ROWINDEX"){
											delete retval[arrHead[q]];
											continue;
										};
									}
									retval[arrHead[q]]	=	nonencode ? $U.nvl(retval[arrHead[q]],"") : encodeURIComponent($U.nvl(retval[arrHead[q]],""));
								}
								chgdataset.rows.push(retval);
			
							}
						}
						if (!$U.isNull(deldata)){
							for (var i=0,j=deldata.rows.length; i<j; i+=1){
								
								retval	=	$U.clone(deldata.rows[i]);
								for (var q=0,w=arrHead.length; q<w; q+=1){
									if (basevaluepass){
										delete retval["EXT-ROWINDEX"];
										if (arrHead[q] === "STATUS" || arrHead[q] === "chk" || arrHead[q] === "EXT-ROWINDEX"){
											delete retval[arrHead[q]];
											continue;
										};
									}
									retval[arrHead[q]]	=	nonencode ? $U.nvl(retval[arrHead[q]],"") : encodeURIComponent($U.nvl(retval[arrHead[q]],""));
								}
								chgdataset.rows.push(retval);
							}
						}
						retval = JSON.stringify(( rowsyn === true ? chgdataset.rows : chgdataset));
						break;
						
				}
				return retval;
			
			}
	
	,	getrowdata	:
			function(id,opt,nonencode){
				return this.getdata(id, opt, true, nonencode);
			}
	//-------------------------------------------------------
	//	data copy 
	//		id	:	id
	//-------------------------------------------------------
	,	copy	:
			function(id){
				return JSON.parse(JSON.stringify(this.dataset.get(id)));
			}
	
	//-------------------------------------------------------
	//	data add 
	//		id		:	id
	//		idx		:	added point  
	//		data	:	rows 를 포함한 json 형태의 data
	//-------------------------------------------------------
	,	dataadd	:
			function(id, idx, vdata){
				if ($U.isNull(vdata)) return;
				var data	=	this.dataset.get(id);
				var vArr	=	null;
				if ($U.isNull(data)){
					this.dataset.set(id, vdata);
					data	=	vdata;
					vArr	=	$U.nvl(data.rows,[]);
					
				} else {
					data.rows	=	$U.nvl(data.rows, []);
					vdata.rows	=	$U.nvl(vdata.rows, []);
					vArr		=	data.rows.slice(0,idx).concat(vdata.rows).concat(data.rows.slice(idx));
					
				}
				data.rows		=	vArr;
				data.records	=	data.rows.length;
				data.limit		=	data.rows.length;
				data.total		=	data.rows.length;
	
			}
	
	//-------------------------------------------------------
	//	data del
	//		id		:	id
	//		idx		:	deleted point  
	//		icnt	:	delete cnt
	//-------------------------------------------------------
	,	datadel	:
			function(id, idx, icnt){
				if (idx < 0 || icnt < 1) return;
				var data		=	this.dataset.get(id);
				data.rows		=	$U.nvl(data.rows,[]);
				var vArr		=	data.rows.slice(0,idx).concat(data.rows.slice(idx+icnt));
				data.rows		=	vArr;
				data.records	=	data.rows.length;
				data.limit		=	data.rows.length;
				data.total		=	data.rows.length;
		
			}
	
	//-------------------------------------------------------
	//	data update 
	//		obj		:	span obj
	//		v		:	값
	//-------------------------------------------------------
	,	dataupdate	:
			function(obj,v){
				var pobj		=	obj.parentElement;
				var id			=	$U.get(pobj.parentElement,"pid");
				var irowidx		=	$U.get(pobj,	"ROWINDEX");
				var icellidx	=	$U.get(pobj,	"CELLINDEX");
				Griddata.update(id,irowidx,icellidx,v,obj.checked,true);
			}
		
	//-------------------------------------------------------
	//	data & grid update 
	//		pid			:	pid
	//		irowidx		:	row index  
	//		icolidx		:	col	index  
	//		val			:	value
	//		checked		:	checkbox, radio 인 경우 checked 여부
	//		dataonly	:	data 만 업데이트
	//-------------------------------------------------------
	,	update	:
			function(pid, irowidx, icolidx, val, checked, dataonly){
				var data 		= 	this.dataset.get(pid);
				var vcolid		= 	Gridext.getcolname(pid,icolidx);	
				var arrVal		=	val.toString().split(_GRID_CHECKDIVIDE);
				if ( $U.isNull(data.rows[irowidx-1])) return;
				var vstatus	=	data.rows[irowidx-1]["STATUS"] === "N" ? "U" : data.rows[irowidx-1]["STATUS"];
				data.rows[irowidx-1][vcolid]	=	arrVal[0] + ( $U.isNull(checked) || !checked ? "" : _GRID_CHECKDIVIDE + "checked" ) ;
				data.rows[irowidx-1]["STATUS"]	=	vstatus;
				var erowidx		=	data.rows[irowidx-1]["EXT-ROWINDEX"]-1;
				
				//---*	origindata도 업데이트 처리한다
				var origindata 	= 	this.origindataset.get(pid);
				if (!$U.isNull(origindata) && !$U.isNull(origindata.rows[erowidx])){
					origindata.rows[erowidx][vcolid]	=	data.rows[irowidx-1][vcolid];
					origindata.rows[erowidx]["STATUS"]	=	vstatus;	
				}
				
				//---*	footer 정보 setting
				clearTimeout(Griddata.footertimeout);
				Griddata.footertimeout	=	setTimeout(function(){
					Grid.footer.set(pid,null);
					Grid.footerdetail(pid);
				},1000);
				
				if (!$U.isNull(dataonly) && dataonly === true) return;
				if (Number(Grid.toprowindex[Grid.toprowindex.match(pid)].value)	>=	irowidx ) return;
				if (Number(Grid.bottomrowindex[Grid.bottomrowindex.match(pid)].value)	<	irowidx ) return;
				Grid.update(pid,irowidx,icolidx, data.rows[irowidx-1][vcolid]);
				Grid.update(pid,irowidx,Gridext.getcolindex(pid,"STATUS"),vstatus);
			}

	//-------------------------------------------------------
	//	updatechk	변경된 데이타가 있는지를 확인한다 
	//		id	:	id
	//-------------------------------------------------------
	,	updatechk	:
			function(id){
				return (!$U.isNull(this.dataset.get(id)) && JSON.parse(this.getdata(id, null, true, true)).length !== 0);
			}
	
	//-------------------------------------------------------
	//	checkupdate 체크 버튼 클릭시 업데이트
	//		obj	:	checkbox object
	//-------------------------------------------------------
	,	checkupdate	:
			function(obj){
				if (obj.checked){ 
					$U.set(obj,"checked",true);
				} else {
					$U.del(obj,"checked");
				}
				var lObj	=	obj.parentElement;
				var pid		=	$U.get(lObj.parentElement,"pid");
				var irow	=	Number($U.get(lObj,"ROWINDEX"));
				var icol	=	Number($U.get(lObj,"CELLINDEX"));
				Griddata.update(pid,irow,icol,$U.text(lObj),obj.checked);
			}

	//-------------------------------------------------------
	//	span checkupdate SPAN 체크 버튼 클릭시 업데이트
	//		sobj		:	span object
	//		id			:	data id
	//		irowidx		:	row index
	//		icellidx	:	cell index
	//-------------------------------------------------------
	,	spancheckupdate	:
			function(sobj,id,irowidx,icellidx){
				var obj 	= 	Grid.getcell(id,irowidx,icellidx).childNodes[0];
				obj.checked	=	sobj.checked;
				Griddata.checkupdate(obj);
			}
	
	//-------------------------------------------------------
	//	radio  버튼 클릭시 업데이트
	//		obj	:	radio object
	//-------------------------------------------------------
	,	radioupdate	:
			function(obj){
				var lObj	=	obj.parentElement;
				var pid		=	$U.get(lObj.parentElement,"pid");
				var icol	=	Number($U.get(lObj,"CELLINDEX"));
				
				//  바로 전 데이타의 값을 false 로 변경한다.
				var bData	=	Griddata.beforedataset.get(pid);
				if (!$U.isNull(bData)){
					Griddata.update(pid,bData.rowidx,icol,bData.text,false);
				}
				
				var irow	=	Number($U.get(lObj,"ROWINDEX"));
				Griddata.update(pid,irow,icol,$U.text(lObj),obj.checked);
				Griddata.beforedataset.set(pid, { rowidx:irow,text : $U.text(lObj) });
				
			}

	//-------------------------------------------------------
	//	CheckButton  check 된 로우 정보 얻기 
	//		id			:	Grid Id
	//		icellidx	:	CELLIDX	
	//-------------------------------------------------------
	,	getcheckedrow	:	
			function(id,icellidx){
				if (icellidx < 0) return null;
				var data			=	Griddata.dataset.get(id);
				if ($U.isNull(data)) return null;
				var cellname 	= 	Gridext.getcolname(id,icellidx);
				var arrReturn	=	new Array();
				var arrValue	=	null;
				for (var a=0,s=data.rows.length; a<s; a+=1){
					if ($U.isNull(data.rows[a][cellname])) continue;
					arrValue 	=	data.rows[a][cellname].split(_GRID_CHECKDIVIDE);
					if (arrValue.length === 1) continue;
					if (arrValue[1] === "checked"){
						arrReturn.push(data.rows[a]);
					}
				}
				return arrReturn;
			
			}
	
	//-------------------------------------------------------
	//	boolcheckedrow	지정된 로우가 선택되었는지 여부를 리턴 
	//		id			:	Grid Id
	//		icellidx	:	CELLIDX	
	//		irowidx	:	ROWIDX	
	//-------------------------------------------------------
	,	boolcheckedrow	:	
			function(id,icellidx,irowidx){
				if (icellidx < 0 || irowidx < 0) return false;
				var data	=	Griddata.dataset.get(id);
				if ($U.isNull(data)) return false;
				data.rows	=	$U.nvl(data.rows,[]);
				var cellname	=	Gridext.getcolname(id, icellidx);
				if ($U.isNull(data.rows[irowidx][cellname])) return false;
				var arrValue	=	data.rows[irowidx][cellname].split(_GRID_CHECKDIVIDE);
				if (arrValue.length < 2) return false;
				return (arrValue[1] === "checked");
	
			}
	
	//-------------------------------------------------------
	//	getselectdrow	선택된 로우 정보 얻기 
	//		id			:	Grid Id
	//-------------------------------------------------------
	,	getselectedrow	:	
			function(id){
				if ($U.isNull(this.dataset.get(id)) || $U.isNull(Grid.selectrow.get(id))) return null;
				return this.dataset.get(id).rows[Grid.selectrow.get(id)-1];
	
			}
	
	//-------------------------------------------------------
	//	getselectdrow	선택된 로우 idx 정보 얻기 
	//		id			:	Grid Id
	//-------------------------------------------------------
	,	getselectedrowidx	:	
			function(id){
				if ($U.isNull(this.dataset.get(id)) || $U.isNull(Grid.selectrow.get(id))) return null;
				return Grid.selectrow.get(id)-1;
			}
	//-------------------------------------------------------
	//	clear	그리드 clear
	//		id			:	Grid Id
	//-------------------------------------------------------
	,	clear	:
			function(id){
				Griddata.dataset.set(id,{record:0,total:0,rows:[]});
				Grid.reload(id);
			}
	
	//-------------------------------------------------------
	//	final 메모리 릴리즈 한다
	//-------------------------------------------------------
	,	final	:
			function(){
				this.dataset			=	null;
				this.origindataset	=	null;
				this.paramset		=	null;
				this.deldataset		=	null;  
				this.sortdataset	=	null;
				this.filterdataset	=	null;
				this.beforedataset	=	null;
				this.self				=	null;
	
			}

};