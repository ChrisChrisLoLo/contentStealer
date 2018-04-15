var https = require("https");
var fs = require("fs");
var constants = require("./constants")

const imageAmount = constants.imageAmount;
const subreddit = constants.subreddit;
const timePeriod = constants.timePeriod;
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
						try{
							//TODO: need to find conditional that doesnt crash if preview is not defined.
							if (redditObj.data.children[i].data.preview){
								//filter out NSFW materials
								if (redditObj.data.children[i].data.over_18 === false){
									imagePost = redditObj.data.children[i].data.preview.images[0].source.url;
									console.log(checkExtension(imagePost));
									//Check if post is a jpg post, and not a gifv or gif post.
									if (checkExtension(imagePost) === "jpg"){
										linkToImage(redditObj.data.children[i].data.preview.images[0].source.url,imagesGotten,"jpg");
										imagesGotten += 1;
									}
								}
							}
						}
						catch(e){
							console.error(e);
						}
						finally{
							i++;
						}

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

