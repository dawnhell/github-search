'use strict';

$(document).ready(function(){
	var timer;
	$(".loading").hide();
	$("#repo-search-action").on('submit', function(event){
		stopTimer();

		event.preventDefault();
		$(".pre-loading").hide();
		$(".loading").show();
		$(".loaded-info").remove();
		addNewDiv();

		var repository = $("#search-keyword").val();
		var language   = $("#search-language").val();
		if(language == "Choose language"){
			language = "whatever";
		}

		repoSearch(language, repository);
		timer = setTimeout(function run(){
			$(".loaded-info").remove();
			addNewDiv();
			repoSearch(language, repository);
			timer = setTimeout(run, 30000);
		}, 30000);
	});

	$("#user-search-action").on('submit', function(event){
		stopTimer();

		event.preventDefault();
		$(".pre-loading").hide();
		$(".loading").show();
		$(".loaded-info").remove();
		addNewDiv();

		var userName = $("#search-user").val();
		userSearch(userName);
	});

	function stopTimer(){
		if(timer){
			clearTimeout(timer);
			timer = null;
		}
	}
});

function addNewDiv(){
    var newDiv = document.createElement("div");
    	newDiv.className = "container-fluid loaded-info";
        newDiv.innerHTML = "";

    var beforeDiv = document.getElementById("loading");
    document.body.insertBefore(newDiv, beforeDiv);
}

function repoSearch(language, repository){
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.github.com/search/repositories?q=' + repository + '+language:' + language + '&sort=stars&order=desc', true);
		xhr.onload = function(){
			$(".loading").hide();
			if(this.status == 422){
				console.log("422 Unprocessable Entity");
			}
			if(this.status == 400){
				console.log("400 Bad Request");
			}
			if(this.status == 200){
				var responseData = JSON.parse(xhr.responseText);
				console.log(responseData);

				var source = $("#repos-entry-template").html();
				var template = Handlebars.compile(source);
				$('.loaded-info').append(template({objects:responseData.items}));
			}
		}
		xhr.onerror = function(){
			console.log("BAD: " + this.status);
		}
		xhr.send();
};

function userSearch(userName){
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.github.com/search/users?q=' + userName + '&sort=followers&order=desc', true);     //Possible to sort by score, stars itc.
		xhr.onload = function(){
			$(".loading").hide();
			if(this.status == 422){
				console.log("422 Unprocessable Entity");
			}
			if(this.status == 400){
				console.log("400 Bad Request");
			}
			if(this.status == 200){
				var responseData = JSON.parse(xhr.responseText);
				console.log(responseData);

				var source = $("#users-entry-template").html();
				var template = Handlebars.compile(source);
				$('.loaded-info').append(template({objects:responseData.items}));
			}
		}
		xhr.onerror = function(){
			console.log("BAD: " + this.status);
		}
		xhr.send();
};