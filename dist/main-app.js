$(function  (argument) {
	var joe = colorjoe.rgb("rgbPane", "indigo",[
				    'currentColor',
				    ['fields', {space: 'RGB', limit: 255, fix: 0}],
				    ['fields', {space: 'HSL', limit: 100}],
				    'hex',
				    'text'
				]);

	joe.on("done", function(color) {
		console.log("Selected " + color.css());
		updateNear(color.hex());
	});

	joe.on("change", function(color) {
		console.log("Selected " + color.css());
		updateNear(color.hex());
	});

	Dropzone.autoDiscover = false;
	var myImageFile = null;
	var myDropzone = new Dropzone("#dropzone",{
												url: "/",
												paramName: "file",
												accept: function(file, done) {
													console.log(file);
													if (file.name.toLowerCase().indexOf(".jpg")>-1 || file.name.toLowerCase().indexOf(".jpeg")>-1 || file.name.toLowerCase().indexOf(".png")>-1) {
													  $(".actBox").show();
													  myImageFile = file;
													  processColors();
													  return 1;
													}
													else { alert("Unsupported file/image."); }
												},
												maxFilesize:5,
												thumbnailWidth: 300,
												thumbnailHeight: 300,
												thumbnailMethod:"contain",
												maxFiles:1,
												dictDefaultMessage:"Drop image here or click box to use image."
											});

	function resetImage(){
		$(".actBox").hide();
		if(myImageFile)
			myDropzone.removeFile(myImageFile);
		$(".domC span").html("");
		$(".matE span").html("");
		$(".matE span").attr({style:""});
		$(".recom1").hide();
		$("#fetchM1").attr({disabled:true})
	}

	resetImage();

	var dCol = [];

	function processColors(){
		
		var colorThief = new ColorThief();
		setTimeout(function(){
			var timg = $(".dz-image").find("img")[0];
			dCol = colorThief.getPalette(timg, 5);
			console.log(dCol); 
			var domTre = "<ul>";
			var index = 0;
			dCol.forEach(function(dColAlone){
				domTre += "<li class='dColAlone' data-index='"+index+"' style='background:rgb("+dColAlone[0]+","+dColAlone[1]+","+dColAlone[2]+")'></li>";
				index++;
			})
			if(domTre=="<ul>"){
				domTre = "No dominant color found";
			}else{
				domTre += "</ul>";
			}
			$(".domC span").html(domTre);
			$("#fetchM1").attr({disabled:false});
			setTimeout(function(){
				$( "li.dColAlone:first" ).trigger( "click" );
			},100)
		},1000);
		
	}

	function pickDom(me){
		var target = me.target;
		$( "li.dColAlone").removeClass("active");
		$(target).addClass("active");
		var selCol = dCol[parseInt($(target).attr("data-index"))];
		selCol = one.color("rgb("+selCol[0]+","+selCol[1]+","+selCol[2]+")").hex();
		console.log(selCol);
		updateNear(selCol,true);
	}

	$( ".domC" ).on( "click", ".dColAlone", pickDom);

	$("#resetI").click(resetImage);

	var gNear = "";
	var gNear1 = "";

	function updateNear(nerar,isImageBox){

		if(isImageBox)
			$(".recom1").hide();
		else
			$(".recom").hide();
		
		if(isImageBox){

			nearMatA1 = getColorA(nerar);
			nearMatP1 = getColorP(nerar);

			var ligthtA = one.color(nearMatA1).lightness();
			var levelA = ligthtA >= 0.5 ? 1: 0;

			var ligthtP = one.color(nearMatP1).lightness();
			var levelP = ligthtP >= 0.5 ? 1: 0;

			if(levelA){
				$(".materialNear .tA1").css({color:"black",background:nearMatA1});
			}else{
				$(".materialNear .tA1").css({color:"white",background:nearMatA1});
			}

			if(levelP){
				$(".materialNear .tP1").css({color:"black",background:nearMatP1});
			}else{
				$(".materialNear .tP1").css({color:"white",background:nearMatP1});
			}
		}else{

			nearMatA = getColorA(nerar);
			nearMatP = getColorP(nerar);

			var ligthtA = one.color(nearMatA).lightness();
			var levelA = ligthtA >= 0.5 ? 1: 0;

			var ligthtP = one.color(nearMatP).lightness();
			var levelP = ligthtP >= 0.5 ? 1: 0;

			if(levelA){
				$(".materialNear .tA").css({color:"black",background:nearMatA});
			}else{
				$(".materialNear .tA").css({color:"white",background:nearMatA});
			}

			if(levelP){
				$(".materialNear .tP").css({color:"black",background:nearMatP});
			}else{
				$(".materialNear .tP").css({color:"white",background:nearMatP});
			}
		}
		
		if(isImageBox){
			$(".materialNear .tA1").html(nearMatA1);
			$(".materialNear .tP1").html(nearMatP1);
			if($('#myonoffswitch1').is(":checked"))
				gNear1 = nearMatA1;
			else
				gNear1 = nearMatP1;
		}else{
			$(".materialNear .tA").html(nearMatA);
			$(".materialNear .tP").html(nearMatP);
			if($('#myonoffswitch').is(":checked"))
				gNear = nearMatA;
			else
				gNear = nearMatP;
		}
		
	}

	function fetchMatch(me){

		var tid = $(me.target)[0].id;

		if(tid=="fetchM"){
			if($('#myonoffswitch').is(":checked"))
				gNear = nearMatA;
			else
				gNear = nearMatP;

			$(".recom").show();
		}else{
			if($('#myonoffswitch1').is(":checked"))
				gNear = nearMatA1;
			else
				gNear = nearMatP1;

			$(".recom1").show();
		}
		

		
		var col = gNear.split("#")[1];
		console.log(gNear, col);
		var matHtml = "<ul>";
		var type = "";
		$.ajax("https://kontextly.herokuapp.com/match/"+col).done(function(response) {
		  response.forEach(function(mAlone){
		  	if("#"+col == mAlone.primary){
		  		matHtml += "<li class='tabMat' style='background:"+mAlone.primary+"'>"+mAlone.accent+"<a onclick='selectCol(\""+mAlone.accent.split("#")[1]+"\",\""+mAlone.primary.split("#")[1]+"\")'  class='circle' style='background:"+mAlone.accent+"'><span class='oi' data-glyph='eye'></span></a></li>";
		  		type = "primary";
		  	}else{
		  		type = "accent";
		  		matHtml += "<li class='tabMat' style='background:"+mAlone.primary+"'>"+mAlone.primary+"<a onclick='selectCol(\""+mAlone.accent.split("#")[1]+"\",\""+mAlone.primary.split("#")[1]+"\")'  class='circle' style='background:"+mAlone.accent+"'><span class='oi' data-glyph='eye'></span></a></li>";
		  	}
		  });
		  if(matHtml=="<ul>"){
		  	matHtml = "No match found.";
		  }else{
		  	matHtml += "</ul>";
		  }

		  if(tid=="fetchM")
		  	$(".recom .match").html(matHtml)
		  else
		  	$(".recom1 .match").html(matHtml)
		})
	}



	$("#fetchM").click(fetchMatch);
	$("#fetchM1").click(fetchMatch);

	var materialPal = ["#F44336","#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#D32F2F","#C62828","#B71C1C","#FF8A80","#FF5252","#FF1744","#D50000","#E91E63","#FCE4EC","#F8BBD0","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#C2185B","#AD1457","#880E4F","#FF80AB","#FF4081","#F50057","#C51162","#9C27B0","#F3E5F5","#E1BEE7","#CE93D8","#BA68C8","#AB47BC","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#EA80FC","#E040FB","#D500F9","#AA00FF","#673AB7","#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#311B92","#B388FF","#7C4DFF","#651FFF","#6200EA","#3F51B5","#E8EAF6","#C5CAE9","#9FA8DA","#7986CB","#5C6BC0","#3F51B5","#3949AB","#303F9F","#283593","#1A237E","#8C9EFF","#536DFE","#3D5AFE","#304FFE","#2196F3","#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#1976D2","#1565C0","#0D47A1","#82B1FF","#448AFF","#2979FF","#2962FF","#03A9F4","#E1F5FE","#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#03A9F4","#039BE5","#0288D1","#0277BD","#01579B","#80D8FF","#40C4FF","#00B0FF","#0091EA","#00BCD4","#E0F7FA","#B2EBF2","#80DEEA","#4DD0E1","#26C6DA","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#84FFFF","#18FFFF","#00E5FF","#00B8D4","#009688","#E0F2F1","#B2DFDB","#80CBC4","#4DB6AC","#26A69A","#009688","#00897B","#00796B","#00695C","#004D40","#A7FFEB","#64FFDA","#1DE9B6","#00BFA5","#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20","#B9F6CA","#69F0AE","#00E676","#00C853","#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E","#CCFF90","#B2FF59","#76FF03","#64DD17","#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717","#F4FF81","#EEFF41","#C6FF00","#AEEA00","#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17","#FFFF8D","#FFFF00","#FFEA00","#FFD600","#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00","#FFE57F","#FFD740","#FFC400","#FFAB00","#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100","#FFD180","#FFAB40","#FF9100","#FF6D00","#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C","#FF9E80","#FF6E40","#FF3D00","#DD2C00","#EFEBE9","#D7CCC8","#BCAAA4","#A1887F","#8D6E63","#795548","#6D4C41","#5D4037","#4E342E","#3E2723","#FAFAFA","#F5F5F5","#EEEEEE","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#616161","#424242","#212121","#ECEFF1","#CFD8DC","#B0BEC5","#90A4AE","#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"];
	var accentPal = ["#FF8A80","#FF80AB","#EA80FC","#B388FF","#8C9EFF","#82B1FF","#80D8FF","#84FFFF","#A7FFEB","#B9F6CA","#CCFF90","#F4FF81","#FFFF8D","#FFE57F","#FFD180","#FF9E80","#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE","#B2FF59","#EEFF41","#FFFF00","#FFD740","#FFAB40","#FF6E40","#FF1744","#F50057","#D500F9","#651FFF","#3D5AFE","#2979FF","#00B0FF","#00E5FF","#1DE9B6","#00E676","#76FF03","#C6FF00","#FFEA00","#FFC400","#FF9100","#FF3D00","#D50000","#C51162","#AA00FF","#6200EA","#304FFE","#2962FF","#0091EA","#00B8D4","#00BFA5","#00C853","#64DD17","#AEEA00","#FFD600","#FFAB00","#FF6D00","#DD2C00"];
	var primaryPal = ["#F44336","#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#D32F2F","#C62828","#B71C1C","#E91E63","#FCE4EC","#F8BBD0","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#C2185B","#AD1457","#880E4F","#9C27B0","#F3E5F5","#E1BEE7","#CE93D8","#BA68C8","#AB47BC","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#673AB7","#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#311B92","#3F51B5","#E8EAF6","#C5CAE9","#9FA8DA","#7986CB","#5C6BC0","#3F51B5","#3949AB","#303F9F","#283593","#1A237E","#2196F3","#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#1976D2","#1565C0","#0D47A1","#03A9F4","#E1F5FE","#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#03A9F4","#039BE5","#0288D1","#0277BD","#01579B","#00BCD4","#E0F7FA","#B2EBF2","#80DEEA","#4DD0E1","#26C6DA","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#009688","#E0F2F1","#B2DFDB","#80CBC4","#4DB6AC","#26A69A","#009688","#00897B","#00796B","#00695C","#004D40","#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20","#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E","#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717","#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17","#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00","#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100","#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C","#EFEBE9","#D7CCC8","#BCAAA4","#A1887F","#8D6E63","#795548","#6D4C41","#5D4037","#4E342E","#3E2723","#FAFAFA","#F5F5F5","#EEEEEE","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#616161","#424242","#212121","#ECEFF1","#CFD8DC","#B0BEC5","#90A4AE","#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"];
	
	var getColorA = nearestColor.from(accentPal);
	var getColorP = nearestColor.from(primaryPal);

	updateNear("#4b0082");
});


var myclickUp = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))?"touchend":"mouseup";

function selectCol(pri,acc){
	pri = "#"+pri.toUpperCase();
	acc = "#"+acc.toUpperCase();
	$("span[data-color='"+pri+"']").trigger(myclickUp);
	$("span[data-color='"+acc+"']").trigger(myclickUp);
	$('#myTab a:first').tab('show')
}
