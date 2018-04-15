//image amount corresponds to the amount of images you want
//You can change the subreddit as well as the time period you want to search
//Code will break if you do not use a image based subreddit.
module.exports = {
	//Selects the amount of images to post over the course of a time period
	//Can set the range from about 1-10, depending on how many JPEGS are in the subreddit
	//Note that bot can only get about 20 posts, and then will probably crash
	imageAmount : 5,
	//Selects a given subreddit.
	subreddit : "cats",
	//Time period can be "hour","day","week","month", or "year"
	//Time period will collect the top images within the period, and will post to twitter
	//every (timeperiod/imageAmount) time units.
	timePeriod : "hour"
};