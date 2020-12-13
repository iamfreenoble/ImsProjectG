<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<section class="title"><i class="fab fa-hubspot"></i>&nbsp;PPT,PPTX -> PDF 변환</section>

<!-- LIST -->
<div id="bootContainer">

</div>

<script>
	var gv_f2_key	=	"";
	function lfFileUploadCallback(too,gkey,rod){
		gv_f2_key	=	rod[0].f2_key;		
	}
	
	function lfSamplePdfOpen(){
		let v=[];
		v.p			=	"f2_key="	+	gv_f2_key;
		yCenterPopup("/FileOpenManage?"+v.p,"XXXXX_XXXX","1000","800","Y","Y");
		
	}
</script>

<section class="buttonarea">
	<span gubun="upload" class="button01" name="f2_group_key_span" onclick="F2.open(this,lfFileUploadCallback,'sampleForm')" f2_group_key="" >PPT,PPTX -> UPLOAD</span>
	<span gubun="insert" class="button01" onclick="lfSamplePdfOpen()">PPT,PPTX -> PDF 변환</span>
</section>

<form name="sampleForm">
	<input type="hidden" name="f2_mass_group_key" value="">
</form>



<!-- INCLUDE -->
<script type="text/javascript" charset="utf-8" src="/business/common/garbage.js"></script>  <!-- 항상 맨앞 gaebage 처리 필수임 -->
