var responseData;
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
			  '@accent': window.accent?window.accent:"#fff",
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
		//var tid="";
		console.log(tid)
		console.log($(".model#"+tid))
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
		$('#cssmodel').modal('hide');
	})
	$(".codeBtn").on(myclick,function(){
		$('#cssmodel').modal({backdrop:false});
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

	
	
	function loadClient() {
		var apiKey="AIzaSyCygAU0S8DTlUWDMExRS0jl7JVceufdf1A";
	    gapi.client.setApiKey(apiKey);
	    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/webfonts/v1/rest")
	        .then(function() { console.log("GAPI client loaded for API"); 
	    					 execute();
	    					},
	              function(err) { console.error("Error loading GAPI client for API", err); });

	  }
	  // Make sure the client is loaded before calling this method.
	  function execute() {
	    return gapi.client.webfonts.webfonts.list({
	      "sort": "popularity"
	    })
	        .then(function(response) {
	                // Handle the results here (response.result has the parsed body).
	                //console.log("Response", response);
	                responseData=response;
	                console.log(responseData)
	                loadExtraFonts();
	                fetchFontNames();
	              },
	              function(err) { console.error("Execute error", err); });
	  }
	  gapi.load("client");

	  setTimeout(function(){
			loadClient();
			
		},5000)


    //   <input type="checkbox" class="custom-control-input" id="customCheck" name="example1">
    //   <label class="custom-control-label" for="customCheck">Custom checkbox</label>
    // </div>
		function fetchFontNames(){
			var s1='<div class="custom-control custom-checkbox"><div class="checkContent">'
					+'<input id="' 
			var s2=	'" type="checkbox" class="custom-control-input" onchange="doalert(this.id)" name="example1">'
					+'<label class="custom-control-label" for="'
			var s3='">'
			var s4='</label></div></div>'
			var fString="";
			var categoryArr=[];

			responseData.result.items.forEach(function(alone){
				if(categoryArr.indexOf(alone.category)==-1){
			    	categoryArr.push(alone.category)
				}
			})

			categoryArr.forEach(function(alone){
				fString=fString+s1+alone+s2+alone+s3+alone+s4;
			})

			document.querySelector(".checkBoxParent").innerHTML=fString;


			var finalString='';
			var appendString1='<div class="fontName"><div class="custom-control custom-radio"><input class="custom-control-input" onchange="radioCallPrimary(this.id.split(\'-\')[1])"  type="radio" name="customRadio123" id="customIdRadio1-';
			var appendString2='" value="option1"><label class="custom-control-label" style="font-family:\''
			var appendString3='\'" for="customIdRadio1-';
			var appendString4='">';
			var appendString5='</label></div></div>'
			responseData.result.items.forEach(function(alone){
				finalString=finalString+appendString1+alone.family+appendString2+alone.family+appendString3+alone.family+appendString4+alone.family+appendString5;
			})

			document.querySelector(".fontsParent1").innerHTML=finalString;
			var t1 = finalString.replace(/customRadio123/g,"customRadio234");
			t1 = t1.replace(/customIdRadio1/g,"customIdRadio2");
			t1 = t1.replace(/radioCallPrimary/g,"radioCallSecondary")
			document.querySelector(".fontsParent2").innerHTML=t1;

			var finalDropString="";
			var dropString1='<a class="dropdown-item pimaryList" onclick="radioCallPrimary(this.id)" style="font-family:\'';
			var dropString2='\'" id="';
			var dropString3='">';
			var dropString4='</a>';
			responseData.result.items.forEach(function(alone){
				finalDropString=finalDropString+dropString1+alone.family+dropString2+alone.family+dropString3+alone.family+dropString4;
			})

			document.querySelector('.primaryDrop .dropdown-menu').innerHTML=finalDropString;
			var t2=finalDropString.replace(/pimaryList/g,"secondaryList");
			t2=t2.replace(/radioCallPrimary/g,"radioCallSecondary");
			document.querySelector('.secondaryDrop .dropdown-menu').innerHTML=t2;

		}

});

var fontNameArray=[];
var firstFontName=[];
var secondFontArray=[];
var progress=0;
function loadExtraFonts(){
	responseData.result.items.forEach(function(alone){
		fontNameArray.push(alone.family)
	});

	for(var i=0;i<10;i++){
		firstFontName.push(fontNameArray[i]);
	}
	for(var i=10;i<fontNameArray.length;i=i){
		var temp=[];
		for(var j=0;j<25;j++){
			if(fontNameArray[i])
				temp.push(fontNameArray[i]);
			i++;
		}
		secondFontArray.push(temp);
	}
	progress=progress+10;
	console.log(firstFontName);
	downloadFonts(firstFontName);
}

function downloadFonts(Arr){
	console.log(Arr);
	WebFont.load({
    google: {
      families: Arr
    },
    classes: false
    // fontactive: function(familyName, fvd) {
    // 	console.log(familyName)
    // },
  });

}
var activeIndex=0;
function googleFont(){
	document.querySelector('.container-fluid.content').classList.remove('googleFonts')
	
}
function downFonts(firstLoad){
	document.querySelector('.container-fluid.content').classList.add('googleFonts')
	if(firstLoad){
		$('.sliderFont').unslider();
	}
	
	for(var i=0;i<9;i++){
		setTimeout(function(){
			console.log(secondFontArray,activeIndex)
			downloadFonts(secondFontArray[activeIndex]);
			activeIndex++;
		},100)
		
		
	}
}
var checkedArray=[];
function doalert(id){
	var tempId;
	console.log(id);
	document.querySelector('.FilterName').innerHTML=id;
	var finalString='';
	var appendString1='<div class="fontName"><div class="custom-control custom-radio"><input class="custom-control-input" onchange="radioCallPrimary(this.id.split(\'-\')[1])" type="radio" name="customRadio123" id="customIdRadio1-';
	var appendString2='" value="option1"><label class="custom-control-label" style="font-family:\''
	var appendString3='\'" for="customIdRadio1-';
	var appendString4='">';
	var appendString5='</label></div></div>'
	if(document.getElementById(id).checked){
		checkedArray.push(id);
		checkedArray.forEach(function(aln){
			responseData.result.items.forEach(function(alone){
				if(alone.category==aln){
					finalString=finalString+appendString1+alone.family+appendString2+alone.family+appendString3+alone.family+appendString4+alone.family+appendString5;
				}
			})
		})
		document.querySelector(".fontsParent1").innerHTML="";
		document.querySelector(".fontsParent2").innerHTML="";
		
		document.querySelector(".fontsParent1").innerHTML=finalString;
		var t1 = finalString.replace(/customRadio123/g,"customRadio234");
		t1 = t1.replace(/customIdRadio1/g,"customIdRadio2");
		t1 = t1.replace(/radioCallPrimary/g,"radioCallSecondary")
		document.querySelector(".fontsParent2").innerHTML=t1;
		
	}else{
		tempId=checkedArray.indexOf(id);
		checkedArray.splice(tempId,1);
		finalString="";
		if(checkedArray.length!=0){
			checkedArray.forEach(function(aln){
				responseData.result.items.forEach(function(alone){
					if(alone.category==aln ){
						finalString=finalString+appendString1+alone.family+appendString2+alone.family+appendString3+alone.family+appendString4+alone.family+appendString5;
					}
				})
			})
		}else{
			responseData.result.items.forEach(function(alone){
				finalString=finalString+appendString1+alone.family+appendString2+alone.family+appendString3+alone.family+appendString4+alone.family+appendString5;
			})
		}
		
		document.querySelector(".fontsParent1").innerHTML="";
		document.querySelector(".fontsParent2").innerHTML="";
		
		document.querySelector(".fontsParent1").innerHTML=finalString;
		var t1 = finalString.replace(/customRadio123/g,"customRadio234");
		t1 = t1.replace(/customIdRadio1/g,"customIdRadio2");
		t1 = t1.replace(/radioCallPrimary/g,"radioCallSecondary")
		document.querySelector(".fontsParent2").innerHTML=t1;
	}	
}
function scrollCall(ele){
	var sHeight=document.querySelector("."+ele.className).scrollHeight;
	var sTop=document.querySelector("."+ele.className).scrollTop;
	var sTopPercentage=(sTop*100)/sHeight;
	if(sTopPercentage<=50){
		if(progress<460){
			//second 9
			activeIndex = 9;
			progress=progress+(25*9);
			console.log("second 9",sTopPercentage,progress)
			downFonts();
		}
	}else if(sTopPercentage<=65 && sTopPercentage>50){
		if(progress<685){
			//third 9
			activeIndex = 18;
			progress=progress+(25*9);
			console.log("third 9",sTopPercentage)
			downFonts();
		}
	}else if(sTopPercentage<=100 && sTopPercentage>65){
		if(progress<904){
			//last 9
			console.log("last 9",sTopPercentage,progress)
			activeIndex = 27;
			progress=progress+(25*9);
			console.log("last 9",sTopPercentage)
			downFonts();
		}
	}
}
var currentSecondaryFont="Titillium Web";
var currentPrimaryFont="Titillium Web";
function radioCallPrimary(eleId){
	
	currentPrimaryFont=eleId;
	console.log(eleId)
	downloadFonts([eleId]);
	less.modifyVars({
			  '@primaryFont': currentPrimaryFont, 
			  '@secondaryFont': currentSecondaryFont,
			  '@primary': window.primary,
			  '@primaryLow': window.priLow,
			  '@primaryHigh': window.priHigh,
			  '@accent': window.accent?window.accent:"#fff",
			  '@accentLow': window.accentLow?window.accentLow:"#fff",
			  '@accentTint': window.accenttint,
			  '@accentShade': window.accentshade
	});
	document.querySelector('.currentPfont').innerHTML=currentPrimaryFont;
}
function radioCallSecondary(eleId){
	
	currentSecondaryFont=eleId;
	downloadFonts([eleId]);
	less.modifyVars({
			  '@primaryFont': currentPrimaryFont,  
			  '@secondaryFont': currentSecondaryFont, 
			  '@primary': window.primary,
			  '@primaryLow': window.priLow,
			  '@primaryHigh': window.priHigh,
			  '@accent': window.accent?window.accent:"#fff",
			  '@accentLow': window.accentLow?window.accentLow:"#fff",
			  '@accentTint': window.accenttint,
			  '@accentShade': window.accentshade
	});
	document.querySelector('.currentSfont').innerHTML=currentSecondaryFont;
}
function displayFilters(){

	if(!document.querySelector('.checkBoxParent').classList.contains('filterHidden') && 
		!document.querySelector('.checkBoxParent').classList.contains('filterShow')){

		document.querySelector('.checkBoxParent').classList.add("filterHidden");

		document.querySelector('.plusBtn').style.backgroundImage="url('../img/plus.png')";

		document.querySelector('.fontsParent1').classList.add("minusFilter");
		document.querySelector('.fontsParent2').classList.add("minusFilter");
		
	}else if(document.querySelector('.checkBoxParent').classList.contains('filterHidden')){
		
		document.querySelector('.checkBoxParent').classList.remove("filterHidden");

		document.querySelector('.checkBoxParent').classList.add("filterShow");
		document.querySelector('.plusBtn').style.backgroundImage="url('../img/minus.png')";

		document.querySelector('.fontsParent1').classList.remove("minusFilter");
		document.querySelector('.fontsParent2').classList.remove("minusFilter");

		document.querySelector('.fontsParent1').classList.add("plusFilter");
		document.querySelector('.fontsParent2').classList.add("plusFilter");
		
	}else if(document.querySelector('.checkBoxParent').classList.contains('filterShow')) {

		document.querySelector('.checkBoxParent').classList.remove("filterShow");

		document.querySelector('.checkBoxParent').classList.add("filterHidden");
		document.querySelector('.plusBtn').style.backgroundImage="url('../img/plus.png')";


		document.querySelector('.fontsParent1').classList.remove("plusFilter");
		document.querySelector('.fontsParent2').classList.remove("plusFilter");

		document.querySelector('.fontsParent1').classList.add("minusFilter");
		document.querySelector('.fontsParent2').classList.add("minusFilter");

	}else{

	}
	
}
function displaySideMenu(){
	if(!document.querySelector('.sectionLeft').classList.contains('hideMenu') &&
		!document.querySelector('.sectionLeft').classList.contains('showMenu')){

		document.querySelector('.sectionLeft').classList.add("hideMenu");

		document.querySelector('.sectionRight').style.width='100%'

	}else if(document.querySelector('.sectionLeft').classList.contains('hideMenu')){

		document.querySelector('.sectionLeft').classList.remove("hideMenu");
		document.querySelector('.sectionLeft').classList.add('showMenu');

		document.querySelector('.sectionRight').style.width='80%'

	}else if(document.querySelector('.sectionLeft').classList.contains('showMenu')){

		document.querySelector('.sectionLeft').classList.remove('showMenu');
		document.querySelector('.sectionLeft').classList.add('hideMenu');

		document.querySelector('.sectionRight').style.width='100%'
	}else{

	}
}
