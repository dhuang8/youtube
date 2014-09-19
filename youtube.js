
		var ytplayer;

function loadXMLDoc(id,url){
	var xmlhttp;
	if (window.XMLHttpRequest)  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	  
	xmlhttp.onreadystatechange=function()  {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			document.getElementById(id).innerHTML=xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}

function change(id,url){
	element=document.getElementById(id);
	state=element.getAttribute('state');
	if (state==0){
		document.getElementById(id).innerHTML="<img src=\"loading.gif\"></img><br />";
	loadXMLDoc(id,url+id);
	element.setAttribute('state',1);
	}
	else if (state==1){
	element.setAttribute('style','display:none');
	element.setAttribute('state',2);
	}
	else if (state==2){
	element.setAttribute('style','display:inline');
	element.setAttribute('state',1);
	}
}

function loadconsole(console){
	divs=document.getElementsByClassName("console")
	for(var i=0; i<divs.length; i++) { 
	  divs[i].setAttribute('style','display:none');
	}
	element=document.getElementById(console);
	element.setAttribute('style','display:block');
}
function onPlayerStateChange(event) {
  
  if (event.data==YT.PlayerState.ENDED){
		var select = document.getElementById("songlist");
		var rand=Math.floor(Math.random()*select.length);
		select.selectedIndex=rand;
		updateHTML("song", rand+1 + ": " + 
		select.options[rand].text);
		event.target.loadVideoById(select.options[rand].value);
  }
}

function onPlayerStateChange2(newState) {	  
	if (newState==0){
		nextSong(2);
	}
}

function nextSong(id){
	if (id==1){
		var select = document.getElementById("songlist");
		var rand=Math.floor(Math.random()*select.length);
		select.selectedIndex=rand;
		ytplayer.loadVideoById(select.options[rand].value);
		updateHTML("song", select.selectedIndex+1 + ": " + 
				select.options[rand].text);  
	}
}
function keyUp(e) {
    if (e.keyCode == 39) {
    	if (curcol3==2)  {
    		nextSong(1);
    	}
    	else if(curcol3==3){
        nextSong(2);
 	   }
    }
}
function addToSelect(id,text,value){
	var select = document.getElementById(id);
	if (select.selectedIndex==null){
		select.add(new Option(text,value),null);
	}
	else {
		select.add(new Option(text,value),select.options[select.selectedIndex]);		
	}
}

function changeSong2(){
	var select = document.getElementById("songlist2");
	ytplayer2.loadVideoById(select.options[select.selectedIndex].value);
	updateHTML("song2", select.selectedIndex+1 + ": " + 
			select.options[select.selectedIndex].text);
}


function onYouTubeIframeAPIReady() {
	ytplayer = new YT.Player('player', {
    height: '390',
    width: '640',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function changeSong(){
	var select = document.getElementById("songlist");
	ytplayer.loadVideoById(select.options[select.selectedIndex].value);
	updateHTML("song", select.selectedIndex+1 + ": " + 
			select.options[select.selectedIndex].text);
}

function onPlayerReady(event) {
	var xmlhttp;
		if (window.XMLHttpRequest)   {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
	    else   {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	      
	    xmlhttp.onreadystatechange=function()  {
			if (xmlhttp.readyState==4 && xmlhttp.status==200)  {
		      	var str=xmlhttp.responseText;
		      	
				list=str.split("\r\n");
				for (eachsong in list){
				var song=list[eachsong].split(" : ");
				addToSelect("songlist",song[0],song[1]);
			}
		
			var rand=Math.floor(Math.random()*list.length);
			var select = document.getElementById("songlist");
			select.selectedIndex=rand;
			updateHTML("song", rand+1 + ": " + 
			select.options[rand].text);
			event.target.loadVideoById(select.options[rand].value);
			event.target.playVideo();
		}
	}
		 
	xmlhttp.open("GET","billboardsr.txt",true);
	xmlhttp.send();
}
function loadPLfromTxt(txt) {
	var xmlhttp;
	if (window.XMLHttpRequest)   {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else   {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	      
	xmlhttp.onreadystatechange=function()  {
		if (xmlhttp.readyState==4 && xmlhttp.status==200)  {
			loadList( xmlhttp.responseText);
		}
	}
		 
	xmlhttp.open("GET",txt,true);
	xmlhttp.send();
}

function addSong(){
	addToSelect("songlist",document.getElementById("title").value,document.getElementById("ytid").value);
}
function addSong(title,id){
	addToSelect("songlist",title,id);
}
function removeVideo(){
	//var select = document.getElementById("songlist");
	//select.remove(select.selectedIndex);
	$("#songlist option:selected").remove();
}
function playVideo(title,id){
	updateHTML("song", title);
	ytplayer.loadVideoById(id);
}
function expand(){
	if (document.getElementById("search").style.display=="none"){
		document.getElementById("search").style.display="block";
		window.scrollTo(0,window.innerHeight/2);
		document.getElementById("expandbutton").innerHTML="[-] Search for more videos";
		$("#searchterm").focus();
	}
	else {
		document.getElementById("search").style.display="none";
		document.getElementById("expandbutton").innerHTML="[+] Search for more videos";
	}
}

function escape(s){
	return s.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&pos;");
}

function search(term) {
	var term = $("#searchterm").val();
	$("#results").html("<img src='loading.gif'>");
  var API = "https://gdata.youtube.com/feeds/api/videos?callback=?";
  $.getJSON( API, {
    q: term,
    alt: "jsonc",
    "max-results":"10",
    v: "2"
  })
    .done(function( response ) {
    	$("#results").html("");
      $.each( response.data.items, function( i, item ) {
    	  var addbutton = $('<button/>',{text: "Add Video",click: function(){addSong(item.title,item.id); }});
    	  var playbutton = $('<button/>',{text: "Play Video",click: function(){playVideo(item.title,item.id); }});
        $("#results").append("<table id='entry'><tr><td><img src='http://i1.ytimg.com/vi/" + item.id + "/mqdefault.jpg'></td><td>" +  item.title
        		+ "<br></td></tr></table><br>").find("td:last").append(addbutton).append("<br>").append(playbutton);
      });
    });
}

function savePlaylist(){
	var select = document.getElementById("songlist");
	var cplaylist="";
	for (var i=0;i<select.length;i++){
		cplaylist=cplaylist + select.options[i].text.replace(":","::") + " : " + select.options[i].value.replace(":","::");
		if (i<select.length-1){
			cplaylist = cplaylist + "\r\n";
		}
	}
	$.cookie("playlist",cplaylist, { expires: 31 });
	alert("Playlist saved");
}

function songobj(title,id){
	this.title=title;
	this.id=id;
}

function loadPlaylist(){
	var select = document.getElementById("pllist");
	var val=select.options[select.selectedIndex].value;
	if (val==1){
		var playlistcookie=$.cookie("playlist");
		if (playlistcookie!=null){
			loadList(playlistcookie);
			$.cookie("playlist",playlistcookie, { expires: 31 });
		}
		else{
			alert("No saved playlist");
		}		
	}
	else if (val==2){
		loadPLfromTxt("billboards.txt");
	}
	else if (val==3){
		loadPLfromTxt("billboardsr.txt");
	}
}

function loadList(songstring){
	var list=songstring.split("\r\n");
	$('select#songlist option').remove();
	for (var i=0;i<list.length;i++){
		var song=list[i].split(" : ");
		song[0]=song[0].replace("::",":");
		song[1]=song[1].replace("::",":");
		addToSelect("songlist",song[0],song[1]);
	}
}