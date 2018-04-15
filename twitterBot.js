var Twit  = require('twit');
var imageGrab = require('./imageGrab');
var fs = require("fs");
require('dotenv').config();
var constants = require("./constants")

const imageAmount = constants.imageAmount;
const subreddit = constants.subreddit;
const timePeriod = constants.timePeriod;
const timeInMillisDict = {"hour":3600000,"day":86400000,"week":604800000,"month":2419200000,"year":31556952000}
const timeInMillis = timeInMillisDict[timePeriod]

//Input credentials here
var T = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

//TODO, vary timings depending on constants

//Grab first set of images
imageGrab.getImages()
var imageCounter = 0


//Grab set of n images every time period.
var imageGrabbing = setInterval(()=>{
	imageGrab.getImages()
},timeInMillis);



//Drips in images over the course of the set time period.
var postImages = setInterval(()=>{
	var b64content = fs.readFileSync(__dirname + `/images/image${imageCounter%imageAmount}.jpg`, { encoding: 'base64' })
	imageCounter += 1
	// first we must post the media to Twitter
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		// now we can assign alt text to the media, for use by screen readers and
		// other text-based presentations and interpreters
		var mediaIdStr = data.media_id_string
		var altText = "Cat Photo"
		var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

		T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				// now we can reference the media and post a tweet (media will attach to the tweet)
				var params = { status: '', media_ids: [mediaIdStr] }

				T.post('statuses/update', params, function (err, data, response) {
					console.log(data)
				})
			}
		})
	})
},timeInMillis/imageAmount)
