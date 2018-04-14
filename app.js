var https = require("https");
var fs = require("fs");
var express = require("express");
var app = express();
//image amount corresponds to the amount of images you want
const imageAmount = 5;
//TODO: If for whatever reason you need to load less theres a reddit GET parameter
//that limits the amount of images you can load. Maybe useful if loading this on a pi.

//reddit URL used to retrive JSON containing image links.
var redditURL = "https://www.reddit.com/r/cats/top.json?t=day"

//Send GET request to reddit URL to retrieve JSON data.
https.get(redditURL, (res)=>{
	var redditJSON = ""
	res.on("data",(d)=>{
		redditJSON += d;
	});
	res.on("end",()=>{
		//convert object to string, then get links 
		redditObj = JSON.parse(redditJSON)
		console.log(redditObj)
		for(var i = 0;i<imageAmount;i++){
			linkToImage(redditObj.data.children[i].data.preview.images[0].source.url,i)
		}
	});

}).on("error",(e)=>{
	console.error(e);
	console.log("!!!!!!!!!!")
});

//convert image link, stores it way 
function linkToImage(link,imageIndex){
	var file = fs.createWriteStream(`./images/image${imageIndex}.jpg`);
	var request = https.get(link, function(response) {
	  response.pipe(file);
	});
}

function checkExtension(imageURL){
	var extension = imageURL.split(".").pop().split("?")[0];

	return extension
}


// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://i.redditmedia.com/c8MR2tLU3oBJ_IpUZj-3ghfZxOsYyPX3JS_0S2922Og.jpg?s=970766faa90b0f44256c2f757d86933a", function(response) {
//   response.pipe(file);
// });