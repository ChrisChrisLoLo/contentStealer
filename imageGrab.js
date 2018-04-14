var https = require("https");
var fs = require("fs");
var express = require("express");
var app = express();
//image amount corresponds to the amount of images you want
//You can change the subreddit as well as the time period you want to search
//Code will break if you do not use a image based subreddit.
const imageAmount = 5;
const subreddit = "cats"
const timePeriod = "day"
//If for whatever reason you need to load less theres a reddit GET parameter
//that limits the amount of images you can load. Maybe useful if loading this on a pi.

//reddit URL used to retrive JSON containing image links.
var redditURL = `https://www.reddit.com/r/${subreddit}/top.json?t=${timePeriod}`
module.exports = {
	getImages: function getImages(){
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
					imagesGotten = 0
					i = 0
					while(imagesGotten < imageAmount){
						//Check if post is an image post
						if (redditObj.data.children[i].data.preview.images[0]){
							imagePost = redditObj.data.children[i].data.preview.images[0].source.url
							console.log(checkExtension(imagePost))
							//Check if post is a jpg post, and not a gifv or gif post. For now only jpgs are collected
							//Though this could probably be expanded in the future.
							if (checkExtension(imagePost) === "jpg"){
								linkToImage(redditObj.data.children[i].data.preview.images[0].source.url,imagesGotten,"jpg")
								imagesGotten += 1
							}
						}
						i++;
					}
				});
				}).on("error",(e)=>{
					console.error(e);
					console.log("!!!!!!!!!!")
			});
	}
}
//convert image link, stores it away 
function linkToImage(link,imageIndex,fileExtension){
	if (!fs.existsSync("./images")) {
    	fs.mkdirSync("./images");
	}
	var file = fs.createWriteStream(`./images/image${imageIndex}.${fileExtension}`);
	var request = https.get(link, function(response) {
	  response.pipe(file);
	});
}

function checkExtension(imageURL){
	var extension = imageURL.split(".").pop().split("?")[0];

	return extension
}

