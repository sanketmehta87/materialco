define(function (require) {
    var Color = require('./color');	
    var colorList = require('./color-list');	
	var white = Color("rgb(255,255,255)");

	var eventCounterGA = 0;

	var clip = function(el) {
	  var range = document.createRange();
	  range.selectNodeContents(el);
	  var sel = window.getSelection();
	  sel.removeAllRanges();
	  sel.addRange(range);
	};

	var myclick = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))?"touchstart":"click";
	var myclickUp = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))?"touchend":"mouseup";

	var lister = document.querySelector(".selector");
	for (var key in colorList) {
		var camlekey = key.split(" ").join("");
		lister.innerHTML += "<li><span class='color-keys' data-color='"+key+"' style='background:"+colorList[key]["500"]+"'>"+key+"</span><ul class='sub-cont' id='"+camlekey+"_cont'></ul></li>";
		var lister1 = document.querySelector("#"+camlekey+"_cont");
		var colorkey = key;
		for (var subkey in colorList[colorkey]) {
			var cvalue = Color(colorList[colorkey][subkey]).getLightness();
			cvalue = cvalue.toFixed(2);
			cvalue=cvalue>=0.88?1:0;
			var shade = colorList[colorkey]["900"];
			var parid = colorkey.split(" ").join("");
			lister1.innerHTML += "<li><span id='"+parid+"_"+subkey+"' class='color-sub-keys' data-parent='"+colorkey+"' data-shade='"+shade+"' data-light='"+cvalue+"' data-color='"+colorList[colorkey][subkey]+"' style='background:"+colorList[colorkey][subkey]+"'>"+subkey+"</span></li>";
		}
	}

	$(".color-keys").on(myclick,function(){
		// var colorkey = $(this).attr("data-color");
		// var lister = document.querySelector(".trey");
		// lister.innerHTML = "";		
	});
	
	$(document).on(myclickUp,".color-sub-keys",function(){
		eventCounterGA++;
		var tint = parseInt($(this).attr("data-light"))==0?0.2:0.4;
		var shade = parseInt($(this).attr("data-light"))==0?0.2:0.1;
		var parent = $(this).attr("data-parent");
		var maincolor = Color($(this).attr("data-color")).toCSS();

		var tintcolor = Color($(this).attr("data-color")).blend(white,tint).toCSS();
		var shadecolor = Color($(this).attr("data-color")).blend(Color($(this).attr("data-shade")),shade).toCSS();
		$(".tint").css({background:tintcolor}).html(tintcolor);
		$(".shade").css({background:shadecolor}).html(shadecolor);
		$(".maincolor").css({background:maincolor}).html(maincolor);
		$(".tint-trey > div").css({background:maincolor,borderColor:tintcolor + " transparent "+shadecolor})

		$(this).addClass("sel");
		var isPrimary;
		
		if($(this).html().indexOf("A")===-1){
			isPrimary = true;
			$(".selector .primary").removeClass("sel primary");
			$(".selector span").removeClass("priHigh priLow");

			$(this).addClass("primary");
			var priLow,priHigh;
			if(parseInt($(this).html())>=500){
				priLow = parseInt($(this).html())-400;
				var tempid = parent.split(" ").join("")+"_"+priLow;
				$("#"+tempid).addClass("priLow");
			}else if(parseInt($(this).html())==50){
				priLow = 0;
			}else{
				priLow = 50;
				var tempid = parent.split(" ").join("")+"_"+priLow;
				$("#"+tempid).addClass("priLow");
			}

			if(parseInt($(this).html())==900){
				priHigh = 1000;
			}else if(parseInt($(this).html())==50){
				priHigh = 200;
				var tempid = parent.split(" ").join("")+"_"+priHigh;
				$("#"+tempid).addClass("priHigh");
			}else{
				priHigh = Math.min(parseInt($(this).html())+200,900);
				var tempid = parent.split(" ").join("")+"_"+priHigh;
				$("#"+tempid).addClass("priHigh");
			}

			if(priLow==0){
				priLow = Color("#ffffff");
			}else{
				priLow = Color(colorList[parent][priLow]);
			}

			if(priHigh==1000){
				priHigh = Color("#000000");
			}else{
				priHigh = Color(colorList[parent][priHigh]);
			}
			window.primary = maincolor;
			window.priLow = priLow.toCSS();
			window.priHigh = priHigh.toCSS();

			var hash = window.primary?window.primary+"/"+ (window.accent?window.accent.split("#")[1]:""):"";
			console.log(hash);
			if(hash)
				location.hash = hash;

			less.modifyVars({
			  '@primary': maincolor,
			  '@primaryLow': priLow.toCSS(),
			  '@primaryHigh': priHigh.toCSS(),
			  '@accent': window.accent,
			  '@accentLow': window.accentLow,
			  '@accentTint': window.accenttint,
			  '@accentShade': window.accentshade
			});

			if(eventCounterGA>2  && typeof ga!="undefined")
				ga('send', 'event', 'MaterialMix', 'Primary', window.primary+"|"+window.accent);

		}else{
			isPrimary = false;
			var accentLow;
			$(".selector .secondary").removeClass("sel secondary");
			$(".color-sub-keys").removeClass("accentLow");
			$(this).addClass("secondary");
			if($(this).html()=="A100"){
				accentLow = maincolor;
				$(this).addClass("accentLow");
			}else{
				$(this).parent().prev().find("span").addClass("accentLow");
				accentLow = $(this).parent().prev().find("span").attr("data-color");
			}
			window.accent = maincolor;
			window.accentLow = accentLow;
			window.accenttint = tintcolor;
			window.accentshade = shadecolor;

			var hash = window.primary?window.primary+"/"+ (window.accent?window.accent.split("#")[1]:""):"";
			console.log(hash);
			if(hash)
				location.hash = hash;

			less.modifyVars({
			  '@primary': window.primary,
			  '@primaryLow': window.priLow,
			  '@primaryHigh': window.priHigh,
			  '@accent': maincolor,
			  '@accentLow': accentLow,
			  '@accentTint': window.accenttint,
			  '@accentShade': window.accentshade
			});
			if(eventCounterGA>2  && typeof ga!="undefined")
				ga('send', 'event', 'MaterialMix', 'Accent', window.primary+"|"+window.accent);
		}

		var cssString = "/* Palette generated by Material Mixer - http://materialmixer.co/ */ \n\
.dark-primary-color    { background: "+window.priHigh+"; } \n\
.default-primary-color { background: "+window.primary+"; } \n\
.light-primary-color   { background: "+window.priLow+"; } \n\
.accent-color          { background: "+maincolor+"; } \n\
.accent-light          { background: "+window.accentLow+"; } \n\
.accent-tint           { background: "+window.accenttint+"; } \n\
.accent-shade          { background: "+window.accentshade+"; } \n\
.accent-button       { background: "+maincolor+"; box-shadow: 0px 1px 0px "+window.accenttint+" inset, 0px -1px 0px "+window.accentshade+" inset, 0px 0px 5px rgba(0, 0, 0, 0.5); }";
	
		$("#cssmodel pre").html(cssString);

		//console.log(window.primary);
		//console.log(window.accent);

		$(".primTag").css({background:window.primary}).html(window.primary);
		$(".primTagLow").css({background:window.priLow}).html(window.priLow);
		$(".primTagHigh").css({background:window.priHigh}).html(window.priHigh);
		$(".accentTag").css({background:window.accent}).html(window.accent);
		$(".accentTagLow").css({background:window.accentLow}).html(window.accentLow);
		
	});
	
	$(".menu a,.menuMobile a,.codeBtn a").on(myclick,function(){
		$(".modelBack").show();
		var tid= $(this).attr("data-model");

		$(".model#"+tid).show();
		if($(".nav i").is(":visible")){
			$(".nav ul.menuMobile").slideUp();
		}
		if(typeof ga != "undefined")
			ga('send', 'event', 'MaterialMix', 'Model', tid);

		if(tid=="cssmodel")
			clip($("#cssmodel pre")[0]);
	})
	$("cross").on(myclick,function(){
		$(".modelBack").hide();
		$(".model").hide();
	})
	$(".burger").on(myclick,function(){
		if($(".nav ul.menuMobile").is(":visible")){
			$(".nav ul.menuMobile").slideUp();
		}else{
			$(".nav ul.menuMobile").slideDown();
		}
	})
	
	setTimeout(function(){
		if(location.hash.split("/").length==2){
			var colref = location.hash.split("/");
			if(colref[0].length==7 && colref[1].length==6){
				colref[0] = colref[0].toUpperCase();
				colref[1] = "#"+colref[1].toUpperCase();
				eventCounterGA = 2;
				$("span[data-color='"+colref[0]+"']").trigger(myclickUp);
				$("span[data-color='"+colref[1]+"']").trigger(myclickUp);
				return 1;
			}
		}
		$("#Purple_600").trigger(myclickUp);
		$("#Orange_A700").trigger(myclickUp);
	},1000)
	
});