// ==UserScript==
// @name         Oppaitime - Game Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autofill Game info from dlsite eng
// @author       NO_ob
// @icon         https://oppaiti.me/favicon.ico
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
    newDiv.innerHTML = htmlData;
    document.getElementById("title").value = newDiv.querySelector("#work_name").children[0].text;
    document.getElementById("year").value = getTableData(newDiv.querySelectorAll("table#work_outline > tbody > tr"),"Release").textContent.split("/")[2];
    document.getElementById("idols_0").value = newDiv.querySelector("#work_maker > tbody > tr >td > span.maker_name").textContent;
    language(getTableData(newDiv.querySelectorAll("table#work_outline > tbody > tr"),"Language"));
    document.getElementById("image").value = "https:" + newDiv.getElementsByClassName("slider_item active")[0].children[0].getAttribute("src");
    document.getElementById("album_desc").value = newDiv.getElementsByClassName("work_parts type_text")[0].textContent;
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

function language(languageData){
    if(languageData != null){
       var langSpans = languageData.querySelectorAll("div.work_genre > a > span");
        if (langSpans.length > 1){
            document.querySelector("select[name=lang] > option[value='Dual Language']").selected = true;
            var languages = new Array();
            for (var i=0; i < langSpans.length ; i++){
                languages[i] = langSpans[i].textContent;
            }
            console.log(languages);
            document.querySelector("#release_desc").value = "Languages: " + languages;
        } else {
            if (langSpans[0].textContent == "English"){
                document.querySelector("select[name=lang] > option[value=English]").selected = true;
            } else if (langSpans[0].textContent == "Japanese") {
                document.querySelector("select[name=lang] > option[value=Japanese]").selected = true;
            } else {
                document.querySelector("select[name=lang] > option[value=None]").selected = true;
            }
        }
    }
}

function getTableData(nodes, search){
    for (var i = 0; i < nodes.length; i++){
        if(nodes[i].children[0].textContent == search){
        return nodes[i].children[1];
        }
    }
    return null;
}
