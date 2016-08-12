'uses strict';

var AIMLInterpreter = require('./AIMLInterpreter');
var aiml = require('./aiml.js');

var aimlInterpreter = new AIMLInterpreter({name:'Jaques', age:'42'});
aimlInterpreter.loadAIMLFilesIntoArray(aiml.aiml);

process.stdin.resume();
process.stdin.setEncoding('utf8');

var callback = function(answer, wildCardArray, input){
    console.log(answer + ' | [' + wildCardArray + '] | ' + input);
    // console.log(answer);
};

process.stdin.on('data', function(text) {
	text = text.replace(/(\r\n|\n|\r)/gm,"");
	aimlInterpreter.findAnswerInLoadedAIMLFiles(text, callback);
});
