var fs = require('fs');
var data = fs.readFileSync('words.json');
var afinndata = fs.readFileSync('afinn111.json');
var words = JSON.parse(data);

//console.log(words);
var afinn = JSON.parse(afinndata);

console.log("server started");

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var server = app.listen(3000);

app.use(express.static("hello"));


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.post('/analyze', analyzeThis);
function analyzeThis(request,response) {

var txt = request.body.text;
var wordst = txt.split(/\W+/);
var totalScore = 0;
var wordlist = [];

for (var i=0; i <wordst.length; i++) {
    var word = words[i];
    var score = 0;
    var found = false;
    if(words.hasOwnProperty(word)){
        score = Number(words[word]);
        found = true;
    }else if(afinn.hasOwnProperty()){
        score = Number(afinn[word]);
        found = true;
    }
    if(found){
        wordlist.push({
            word: word,
            score: score
        });
    }
    totalScore += score;
  }
    var comp = totalScore / wordst.length;

    var reply={
        score: totalScore,
        comparative: comp,
        words: wordlist
    }

            response.send(reply);
    
}


app.get('/add/:word/:score?', addWord);

function addWord(request,response) {
    var data = request.params;
    var word = data.word;
    var score = Number(data.score);
    if (!score) {
        var reply = {
            msg: "Score Require"
        }
        response.send(reply);
    }

    else {
        words[word] = score;

        var data = JSON.stringify(words, null, 2);
        fs.writeFile('words.json', data, finished);

        function finished(err) {
            console.log('all set');
        }

        var reply = {
            word: word,
            score: score,
            msg: "success"
        }
        response.send(reply);
    }


}
app.get('/all',sendAll);

function sendAll(request,response) {
    var data = {
        words : words,
        afinn: afinn
    }
    response.send(data);

}

app.get('/search/:word', searchWord);

function searchWord(request, response) {
    var word = request.params.word;
    var reply;
    if(words[word]){
        reply={
            status: "Found",
            word: word,
            score: words[word]
        }
    }
    else{
        reply={
            status: "Not Found",
            word: word
        }
    }
    response.send(reply);
}
