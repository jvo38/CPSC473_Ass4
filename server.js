jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true;

// Jimmy Vo
// CPSC 473 - Assignment 4

// Packages we need
var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	app = express();

var	mongoose = require('mongoose'); // import the mongoose library
mongoose.Promise = global.Promise;
var redis = require('redis');
redisClient = redis.createClient();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

http.createServer(app).listen(3000);
console.log("Listening on port 3000");

mongoose.connect('mongodb://localhost/assn4DB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("We're connected to the DB!");
});


// This is our mongoose schema/model for questions
var QuestionsSchema = mongoose.Schema(
{
	"question" : String,
	"answer" : String,
	"answerId" : Number
}); 

var UseQuesSchema = mongoose.model("Question", QuestionsSchema);

var availableId = 0, //store question id #, default at 0, 
	chosenQuestion = '',	//store chosen(random) question/id
	chosenId = 0;

//set default scores for right/wrong to 0
var outcomeScore = function()
{
	redisClient.set('right', '0');
	redisClient.set('wrong', '0');
};

// direct to page to enter new question/answer
app.get('/',function(req,res)
{
  res.sendfile('index');
});

// post new question/answer to DB with current ID index
app.post('/question', function(req, res)
{
	var addQuestion = req.body.newQuestion;
	var addAnswer = req.body.newAnswer
	var newQuestion = new UseQuesSchema(
		{
			"question" : addQuestion, 
			"answer" : addAnswer, 
			"answerId" : availableId	//assign availableId to answerId in DB for question
		}
	);
	
	// save this question to our data store
	newQuestion.save(function (err) 
	{
		if (err !== null) 
		{
			// object was not saved!
			console.log(err);
		} 
		else 
		{
			console.log("the object was saved!");
		}
	});
	availableId = availableId + 1;	//increment for next question to save to available index
});

// get/ask question from DB 
app.get('/question', function (req, res) 
{
		// count how many question in DB and get random question out
		UseQuesSchema.count().exec(function(err, count)
		{
			var random = Math.floor(Math.random() * count);
			UseQuesSchema.findOne().skip(random).exec(function(err, result)
			{
				chosenQuestion = result.question;	// store random question/Id to know which question was asked
				chosenId = result.answerId;
				/*var html = '<form action="/answer" method="post">' +
               	'Question:' + result.question +
               	'<p></p>' + 'Answer: ' + '<input type="text" name="qAnswer"><p></p>' +
               	'<button type="submit">Submit</button>' +
            	'</form>';
  				res.send(html);*/
			});
		});
});

//check if answer is corrent and increment our redis count
app.post('/answer', function(req, res)
{
	var checkAnswer = req.body.qAnswer;
	UseQuesSchema.find({answerId:chosenId}, function (err, check)
	{
		if (checkAnswer	!= check.answer)
		{
			redisClient.incr('wrong')
			/*var html = '<form>' + 'Answer: incorrect' + '</form>';
  			res.send(html);*/
		}
		else
		{
			redisClient.incr('right')
			/*var html = '<form>' + 'Answer: correct' + '</form>';
  			res.send(html);*/
		}
	});
});

app.get('/score', function (req, res)
{
	redisClient.mget(['right', 'wrong']);
});





