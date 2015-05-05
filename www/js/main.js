var db = new PouchDB('remedy_db');
var currentUser;
var userData;
var updateEntry = false;
var currentEntry = 0;
var painEntryNum = 0;
var lineChartData;
var isFront = true;
var drawImg = "";
var allTriggers = ["Bending","Pushing","Reading","Coughing","Sitting","Sleeping","Driving","Sneezing","Getting Up","Standing","Lifting","Walking","Working"];
var dataColors = ['#F7464A', '#46BFBD' ,'#FDB45C', '#1975FF', '#8533FF', '#FF7519', '#8FB2B2'];
var dataHL = ['#46BFBD', '#5AD3D1', '#FFC870', '#145ECC', '#5D24B2' ,'#E66916' ,'#81A0A0'];

function registerUser() {
   var user = {
		_id:$("#reg-user").val(),
		pass:$("#reg-pass").val(),
		pains:[],
		newTrigs:["Bending","Pushing","Reading","Coughing","Sitting","Sleeping","Driving","Sneezing","Getting Up","Standing","Lifting","Walking","Working"],
		gender:$("#reg-gender").val(),
		name:$("#reg-name").val(),
		age:$("#reg-age").val(),
		weight:$("#reg-weight").val()
	};
	db.put(user, function callback(err, result) {
		if(!err){
			$("#invalidlogin").text("Registered Successfully!");
		}
	});
}

function addPain() {
	var tempCanvas = document.getElementById('myCanvas');
	tempDataURL = tempCanvas.toDataURL();    
	var allPains = [];
    var pain = {
		name:$("#text-18").val(),
		date:$("#pain-date").val(),
		update:new Date(),
		descr:$("#textarea-18").val(),
		type:drawImg,
		inten:$("#selColor").val(),
		data64URL: tempDataURL,    //CHANGE THIS FOR PHONES
		trigs:getPainTrigs()
	};
	if(updateEntry == false){
		console.log("new entry being made");
		db.get(currentUser).then(function(doc) {
		allPains.push(pain);
		var tempArr = doc.pains;
		tempArr.push(allPains);
		  return db.put({
			_id: currentUser,
			_rev: doc._rev,
			pass: doc.pass,
			gender: doc.gender,
			name: doc.name,
			age: doc.age,
			weight: doc.weight,
			newTrigs:allTriggers,
			pains: tempArr
		  });
		}).then(function(response) {
		  showPainEntries();
		  console.log(response);
		}).catch(function (err) {
		  console.log(err);
		});
	}else{
		db.get(currentUser).then(function(doc) {
		var tempArr = doc.pains;
		allPains = tempArr[currentEntry];
		allPains.push(pain);
		tempArr.splice(currentEntry, 1, allPains);
		  return db.put({
			_id: currentUser,
			_rev: doc._rev,
			pass: doc.pass,
			gender: doc.gender,
			name: doc.name,
			age: doc.age,
			weight: doc.weight,
			pains: tempArr,
			newTrigs:allTriggers
		  });
		}).then(function(response) {
		  showPainEntries();
		  console.log(response);
		}).catch(function (err) {
		  console.log(err);
		});
	}
}

function getPainTrigs() {
	tempTrigs = [];
	for(var i = 0; i < allTriggers.length; i++){
		if($("#triggers-"+i).is(':checked')){
			tempTrigs.push($(".trigLbl-"+i).text());
		}
	}
	return tempTrigs;
}

function updatePain(pain) {
	lineChartData = {
			labels : [],
			datasets : [
				{
					label: "Pain Data",
					fillColor : "rgba(49,12,61,0.4)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(206,80,98,0.9)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : []
				},
			]
	}
	$(".inner-scroller").empty();
	updateEntry = true;
	currentEntry = pain;
	var tempPain = userData.pains[pain];
	var lastIdx = tempPain.length-1;
	var container_width = 165 * tempPain.length;
	$(".inner-scroller").css("width", container_width);
	var painCounter = 0;
	
	tempPain.forEach(function(entry) {
		var tempImageHTML = "<img id='entry-"+painCounter+"' class='PIimg' src='"+entry.data64URL+"' width='150px' height='150px'/>"
		$(".inner-scroller").append(tempImageHTML);
	//function added to each image on click	
	$("#entry-"+painCounter).click(function() {
        $("#entry-" + painEntryNum).removeClass('selectedEntry');
		$(this).addClass('selectedEntry');
		painEntryNum = $(this).attr('id').slice(6);
		var tempPain = userData.pains[currentEntry];
		$("#PIdesc").text(tempPain[painEntryNum].descr);
		$("#PIdate").text("Entry Date: " + tempPain[painEntryNum].date.slice(0,10));
    })
		lineChartData.labels.push(tempPain[painCounter].date.slice(5,10));
		lineChartData.datasets[0].data.push(colorToNum(tempPain[painCounter].inten));
		painCounter++;
	});	
	$("#entry-0").addClass('selectedEntry');
    //Info Page Setup
	$(".painInfoName").text(tempPain[lastIdx].name);
	$("#PIdesc").text(tempPain[lastIdx].descr);
	$("#PIdate").text("Entry Date: " + tempPain[lastIdx].date.slice(0,10));
	//Update Page Setup
	$("#painNameField").hide();
	$("#pain-date").val(tempPain[lastIdx].date);
	$("#text-18").val(tempPain[lastIdx].name);
	$("#textarea-18").val(tempPain[lastIdx].descr);
	$(".updateLink").attr("href", "#drawpain");
	$(".updateLink2").attr("href", "#new-entry");
	drawImg = tempPain[lastIdx].type;
	$("#painArea").hide();
	//$("#selColor").val(tempPain[lastIdx].inten);
	$("#chartCanvas").empty();
	$("#chartCanvas").append("<canvas id='painChart'></canvas>");
	setTimeout(function() { var ctx = document.getElementById("painChart").getContext("2d");
	var myLine = new Chart(ctx).Line(lineChartData, {responsive: true}); }, 300);
	
	
}

function newPain() {
	updateEntry = false;
	$(".updateLink").attr("href", "#selectdrawpain");
	$(".updateLink2").attr("href", "#selectdrawpain");
	$("#painNameField").show();
	$("#text-18").val("");
	$("#pain-date").val("");
	$("#textarea-18").val("");
	$("#painArea").show();
}

function verifyUser() {
   var verify = db.get($("#textinput-user").val()).then(function (results) {
		if($("#textinput-pass").val() == results.pass){
			$("#invalidlogin").text("");
			$("#loginLink").click()
			currentUser = $("#textinput-user").val();
			allTriggers = results.newTrigs;
			showPainEntries();
			return true;
		}else{
			$("#invalidlogin").text("Invalid Login!");
			return false;
		}
	});
	$("#invalidlogin").text("No such user, please create an account");
}

function showPainEntries() {
	var verify = db.get(currentUser).then(function (results) {
		console.log(results);
		userData = results;
		$("#paingrid").empty();
		var addPainBarHTML = "<br> \
				<a href='#new-entry'  onclick='javascript:newPain();' data-transition='slide'><div class='ui-block-a entry'> \
				<div class='ui-bar ui-bar-a' id='newentrybar' style='height:60px'>ADD NEW ENTRY</div> \
				</div></a>   "
		$("#paingrid").prepend(addPainBarHTML);
		var painEntryCounter = -1;
			results.pains.forEach(function(entries) {
				var entry = entries[entries.length-1];
				painEntryCounter++;
				var tempPainBar = "<a href='#painInfo' onclick='javascript:updatePain("+painEntryCounter+");javascript:clearArea();'  data-transition='slide'> \
					<div class='ui-block-a entry'> \
						<div id='painentrybar' class='ui-bar ui-bar-a' style='height:90px; '> \
							<div style='float:left'> \
								<img src='"+entry.data64URL+"' height='90px' width='90px' /> \
							</div> \
							<div style='float:left; width:50%'> \
								<h1>"+entry.name+"</h1><br> \
								<h5 style='font-size:50%;'>Last Updated <br>"+ entry.update.slice(0,10) +"</h5> \
								<br><span class='inlinesparkline-"+painEntryCounter+"'>1,8,3</span> \
							</div> \
							<div id='painTxt' style='float:right; width:20%'> \
								<h1 style='font-size:250%;color:"+entry.inten+"'>"+colorToNum(entry.inten)+"</h1> \
							</div>\
						</div>\
					</div>\
					</a>"
					$("#paingrid").prepend(tempPainBar);
			});	
	});

}

function colorToNum(color) {
	var num = 0;
	switch(color) {
		case "#33FF33":
			num = 0
			break;
		case "#80FF00":
			num = 1
			break;
		case "#99FF33":
			num = 2
			break;
		case "#B2FF66":
			num = 3
			break;
		case "#FFFF66":
			num = 4
			break;
		case "#FFFF00":
			num = 5
			break;
		case "#FF9933":
			num = 6
			break;
		case "#FF8000":
			num = 7
			break;
		case "#FF6666":
			num = 8
			break;
		case "#FF0000":
			num = 9
			break;
	}
	return num;
}

$(document).ready(function() {	

	$("#remedy-title").css("margin-top", $(document).height()/4);
	$("#newentry").css("height", $(document).height() / 8);
	$("#newentry").css("padding-top", $(document).height() / 16);
	
	InitThis();
	
	$("#selColor").change(function (){
        var color = $('option:selected',this).css('background-color');
        $("#selColor-button").css('background-color',color);}).change();
	
	$("#painArea").change(function (){areaSwitch();}).change();
	
	$("#drawpain").bind('touchmove', function(e) { e.preventDefault();});
	$(".inner-scroller").bind('touchmove', function(e) { });
	
	var tempimgfunc = function() { 
		if($("#bodySelect").attr("src") == "images/bodySelectBack.png"){
			isFront = true;
			$("#bodySelect").attr("src", "images/bodySelectFront.png");
		}else{
			isFront = false;
			$("#bodySelect").attr("src", "images/bodySelectBack.png");
		}};
		
	$("#changeImgMap").on( "vclick", tempimgfunc);
	$("#changeImgMap2").on( "vclick", tempimgfunc);
	for(var i = 0; i < 9; i++){
		$("#parea-" + i).on( "vclick",function(e) { 
			if(isFront == true){
				drawImg = "images/" + $(this).attr("alt") + ".png";
			}else{
				drawImg = "images/" + $(this).attr("alt") + ".png";
			}	
			clearArea();
		});
	}
});

$(document).on('pageshow', '#triggers', function(){   
	$("#triggerList").empty(); 
	var currentIdx = 0;
	for(var i = 0; i < allTriggers.length; i++){
	var tempTriggerHTML = '<li class="liTriggers ui-li-static ui-body-inherit ui-first-child ui-last-child" data-filtertext="'+allTriggers[i]+'"><div class="ui-checkbox"><label id="smallertext" for="triggers-'+i+'" data-theme="c" class="trigLbl-'+i+' ui-btn ui-btn-c ui-btn-icon-left ui-checkbox-off">'+allTriggers[i]+'</label><input type="checkbox" name="triggers-'+i+'" id="triggers-'+i+'" data-theme="c"></div></li>';
		$("#triggerList").append(tempTriggerHTML);
		currentIdx = i;
	}
	$("[type=checkbox]").checkboxradio();
	
	$("#newTrigger").keyup(function (e) {
		if (e.keyCode == 13) {
			var tempTriggerHTML = '<li class="liTriggers ui-li-static ui-body-inherit ui-first-child ui-last-child" data-filtertext="'+$("#newTrigger").val()+'"><div class="ui-checkbox"><label id="smallertext" for="triggers-'+currentIdx+'" data-theme="c" class="ui-btn ui-btn-c ui-btn-icon-left ui-checkbox-off">'+$("#newTrigger").val()+'</label><input type="checkbox" name="triggers-'+currentIdx+'" id="triggers-'+currentIdx+'" data-theme="c"></div></li>';
			$("#triggerList").append(tempTriggerHTML);
			$("[type=checkbox]").checkboxradio();
			allTriggers.push($("#newTrigger").val());
		}
		currentIdx++;
	});
});

$(document).on('pageshow', '#userinfo', function(){       
	 $('#UIname').text("Name: "+userData.name);
	 $('#UIage').text("Age: "+userData.age);
	 $('#UIweight').text("Weight: "+userData.weight);
	 if(userData.gender == "M"){
		 $('#UIsex').text("Sex: Male");
	 }else{
		 $('#UIsex').text("Sex: Female");
	 }
	 $('#UIentries').text("# of Entries: "+userData.pains.length);
	 
});

$(document).on('pageshow', '#home', function(){  
	for(var i = 0; i < userData.pains.length; i++){
		var myvalues = [];
		var tempPainInfo = userData.pains[i];
		for(var j = 0; j < tempPainInfo.length; j++){
			myvalues.push(colorToNum(tempPainInfo[j].inten)); 
		}  
		if(myvalues.length > 5){
			myvalues = myvalues.slice(myvalues.length-5);
		}
		//myvalues.unshift(0);
		$('.inlinesparkline-'+i).sparkline(myvalues, {height:"45px",defaultPixelsPerValue:30,lineColor:"rgba(49,12,61,1.0)" , fillColor:"rgba(49,12,61,0.4)", disableInteraction:true, spotRadius:2.5, valueSpots:{':10':'red'}, spotColor:'red', minSpotColor:'red', maxSpotColor:'red'} );
	}
});

function getTypeData() {
	 var tempTypeData = [];
	 var countArray = [];
	 for(var i = 0; i < userData.pains.length; i++){
		var curPain = userData.pains[i];
		countArray.push(curPain[0].type);
	 }
	 var countResult = countData(countArray);
	 var uniRes = countResult[0];
	 var cntRes = countResult[1];
	 for(var i = 0; i < uniRes.length; i++){
		 var tempDataEntry = {
					value: cntRes[i],
					color:dataColors[i],
					highlight: dataHL[i],
					label: uniRes[i].slice(7, uniRes[i].length - 4)
				};
		 tempTypeData.push(tempDataEntry);
	 }
	 return tempTypeData
}

function getTrigData() {
	 var countArray = [];
	 for(var i = 0; i < userData.pains.length; i++){
		var curPain = userData.pains[i];
		 for(var j = 0; j < curPain[0].trigs.length; j++){
			countArray.push(curPain[0].trigs[j]);
		}
	 }
	 var countResult = countData(countArray);
	 var uniRes = countResult[0];
	 var cntRes = countResult[1];
	 var tempTrigData = {
		labels: uniRes,
		datasets: []
	 };
	 var tempDataEntry = {
				label: "Data",
				fillColor: "rgba(49,12,61,0.4)",
				strokeColor: "rgba(220,220,220,0.8)",
				highlightFill: "rgba(220,220,220,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data: cntRes
			};
	 tempTrigData.datasets.push(tempDataEntry);
	 return tempTrigData
}

function countData (arr) {
	var uni = [], cnt = [], prev;
		arr.sort();
		for ( var i = 0; i < arr.length; i++ ) {
			if ( arr[i] !== prev ) {
				uni.push(arr[i]);
				cnt.push(1);
			} else {
				cnt[cnt.length-1]++;
			}
			prev = arr[i];
		}
		return [uni, cnt];
}

$(document).on('pageshow', '#charts', function(){  
	var piedata = getTypeData();
	var bardata = getTrigData();

		setTimeout(function() { var ctx = document.getElementById("pieChart").getContext("2d");
	var myLine = new Chart(ctx).Pie(piedata, {responsive: true}); }, 700);
	
		setTimeout(function() { var ctx = document.getElementById("pieChart2").getContext("2d");
	var myLine = new Chart(ctx).Bar(bardata, {responsive: true}); }, 800);
	
});


		