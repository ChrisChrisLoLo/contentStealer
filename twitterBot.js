var Twit  = require('twit');
var ImageGrab = require('./imageGrab');
var fs = require("fs");

require('dotenv').config();

var T = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

//TODO, vary timings depending on constants

ImageGrab.getImages()

var imageGrabbing = setInterval(()=>{
	ImageGrab.getImages()
},86400000);

var imageCounter = 0

var postImages = setInterval((imageCounter)=>{

	var b64content = fs.readFileSync(__dirname + `/images/image${imageCounter%5}.jpg`, { encoding: 'base64' })
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
},300000)

// var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })

// // first we must post the media to Twitter
// T.post('media/upload', { media_data: b64content }, function (err, data, response) {
//   // now we can assign alt text to the media, for use by screen readers and
//   // other text-based presentations and interpreters
//   var mediaIdStr = data.media_id_string
//   var altText = "Small flowers in a planter on a sunny balcony, blossoming."
//   var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

//   T.post('media/metadata/create', meta_params, function (err, data, response) {
//     if (!err) {
//       // now we can reference the media and post a tweet (media will attach to the tweet)
//       var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

//       T.post('statuses/update', params, function (err, data, response) {
//         console.log(data)
//       })
//     }
//   })
// })