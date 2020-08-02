// ==UserScript==
// @name         OppaiTime - Game Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autofill Game info from dlsite eng
// @author       NO_ob
// @match        *://oppaiti.me/upload.php
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
	var inputBtn = document.createElement("input");
	inputBtn.setAttribute("type","button");
	inputBtn.setAttribute("autofill","game");
	inputBtn.setAttribute("value","Autofill");
	inputBtn.setAttribute("id","gameBtn");
	document.getElementById("dlsite_tr").children[1].appendChild(inputBtn);
	document.getElementById("gameBtn").addEventListener("click", getShit);
})();


function getDataFromHTML(htmlData){
    var newDiv = document.createElement("div");
    newDiv.style.visibility="hidden"
    newDiv.setAttribute("id","dlsiteShit");
    newDiv.innerHTML = htmlData;
    document.getElementById("upload").appendChild(newDiv);
    document.getElementById("title").value = document.getElementById("work_name").children[0].text;
    document.getElementById("year").value = document.getElementById("work_outline").children[0].children[0].children[1].children[0].text.split("/")[2];
    document.getElementById("idols_0").value = document.getElementsByClassName("maker_name")[0].children[0].text;
    var langIcons = document.getElementsByClassName("work_genre")[3].getElementsByTagName("a");
    if (langIcons.length > 1){
    	document.getElementById("lang_tr").children[1].children[0].options[3].selected = true
    	var languages = new Array();
    	for (var i=0; i < langIcons.length ; i++){
    		languages[i] = langIcons[i].children[0].title;
    	}
    	document.getElementById("release_desc").value = "Languages: " + languages;

    } else {
    	if (langIcons[0].children[0].title == "English"){
    		document.getElementById("lang_tr").children[1].children[0].options[1].selected = true;
    	} else if (langIcons[0].children[0].title == "Japanese") {
    		document.getElementById("lang_tr").children[1].children[0].options[2].selected = true;
    	} else {
    		document.getElementById("lang_tr").children[1].children[0].options[4].selected = true;
    	}
    }
    document.getElementById("image").value = "https:" + document.getElementsByClassName("slider_item active")[0].children[0].getAttribute("src");
    document.getElementById("album_desc").value = document.getElementsByClassName("work_parts type_text")[0].textContent;
    document.getElementById("upload").removeChild(newDiv);

}

function getShit(){
	var dlsiteID = document.getElementById("dlsiteid").value;
	var URL = "https://www.dlsite.com/ecchi-eng/work/=/product_id/" + dlsiteID + ".html";

	GM_xmlhttpRequest ( {
	    method:         "GET",
	    url:            URL,
	    responseType:   "html",
	    onload:         function(response) {getDataFromHTML(response.responseText);}
	});

}