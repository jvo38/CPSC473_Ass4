// $HOME/redis/src/redis-server
// $HOME/mongodb/bin/mongod --dbpath=$HOME/mongodb/data

// Packages we need
var express = require('express');
var app = express();
var http = require('http');
http.createServer(app).listen(3000); // listen on port 3000
console.log('Listening on port 3000');
var mongoose = require('mongoose'); // import the mongoose library
//var redis = require('redis');
//var redisClient = redis.createClient();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//http.createServer(app).listen(3000); // listen on port 3000
//console.log('Listening on port 3000');

mongoose.connect('mongodb://localhost/assn4DB');
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("We're connected to the DB!");
});


// This is our mongoose schema/model for questions
var QuestionssSchema = mongoose.Schema(
{
	"question" : String,
	"answer" : String,
	"answerId" : Number
}); 

var UseQuesSchema = mongoose.model("Question", QuestionsSchema);

//Return the number of questions in the DB
dbQuestionCount = function()
{
	UseQuesSchema.count({},function(err, count)
	{
		availableId = count;
		return availableId;
	})
}

createQuestion = function(question, answer)
{
	var newQuestion = new UseQuesSchema({question:question, answer:answer, answerId:availableId});
	availableId += 1;	//to make next index available for new question later
}

queryQuestion = function

/*
var qnOne = new Question({"question":"Who was the first computer programmer?", "answerId":"1"})


//save question into our data store
qnOne.save(function (err) {
	if (err !== null) {
		// object was not saved!
		console.log(err);
	} else {
		console.log("the object was saved!");
	}
});


app.get('/question', function (req, res) {
	Question.find({}, function (err, questions) {
		if (err !== null) {
			console.log("ERROR: " + err);
			// return from the function
			return;
		}

		// if we get here, there was no error
		questions.forEach(function (question) {
			// this will print all of the cards in the database
			console.log (question.question);
			res.json(questions);
		});
		res.json(questions);
	});
});
*/






