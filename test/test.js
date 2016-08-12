var assert = require('assert');

AIMLInterpreter = require('../AIMLInterpreter');

var aimlInterpreter = new AIMLInterpreter({name:'WireInterpreter', age:'42'});
aimlInterpreter.loadAIMLFilesIntoArray(['./test/test.aiml.xml']);

function checkCallAndResponse(input, expected, expectedArray) {
	aimlInterpreter.findAnswerInLoadedAIMLFiles(input, function(answer, wildCardArray, input) {
		assert.equal(answer, expected);
        if (wildCardArray && expectedArray) {
            assert.equal(wildCardArray.length, expectedArray.length);
            for (var i = 0; i < wildCardArray.length; i++) {
                assert.equal(wildCardArray[i], expectedArray[i]);
            }
        }		
	});
}

function callAndIgnoreResult(input, cb) {
    aimlInterpreter.findAnswerInLoadedAIMLFiles(input, function(answer, wildCardArray, input) {
        cb();
    });
}

describe('interpreter', function(){
	it('should handle bot attributes', function(){
		checkCallAndResponse('What is your name?', 'My name is WireInterpreter.');
    });

    it('should allow setting variable values', function(){
		checkCallAndResponse('My name is Ben.', 'Hey Ben.!');
    });

    it('should allow getting variable values', function(){
		checkCallAndResponse('What is my name?', 'Your name is Ben.');
    });

    it('should support the srai tag', function() {
    	checkCallAndResponse('Who are you?', 'My name is WireInterpreter.');
    });

    it('should support the sr tag', function() {
    	checkCallAndResponse('Test sr tag What is my name?', 'Your name is Ben.');
    });

    it('should support the sr tag in random', function() {
        aimlInterpreter.findAnswerInLoadedAIMLFiles('Test sr in random What is my name?', function(answer, wildCardArray, input) {
            // The result could be:
            // My name is WireInterpreter.
            // Your name is Ben.
            if (((answer === "My name is WireInterpreter.") || (answer === "Your name is Ben.")) == false) {
                console.log("Answer was: " + answer);
                console.log("Epected: 'My name is WireInterpreter.' or ''My name is Ben.");
                assert(false);
            }
        });
    });

    it('should support the star tag', function() {
    	checkCallAndResponse('Test the star tag repeat what I said', 'repeat what I said');
    });

    it('should support the that tag', function() {
    	checkCallAndResponse('Test the that tag', 'I start testing that.');
    });

    it('should support the that tag - match', function() {
    	checkCallAndResponse('Test that-tag. match', 'That matched quite well!');
    });

    it('should support the that tag - don\'t match', function() {
    	checkCallAndResponse('Test that-tag. dont match', undefined);
    });

	it('should support the condition tag 1', function() {
    	checkCallAndResponse('You feel crumpy', 'I feel crumpy!', [ "crumpy" ]);
    });
    
	it('should support the condition tag 2', function() {
    	checkCallAndResponse('You feel happy', 'I feel happy!', [ "happy" ]);
    });
    
	it('should support the condition tag 3', function() {
    	checkCallAndResponse('You feel sad', 'I feel sad!', [ "sad" ]);
    });

    it('should support the condition tag 4', function() {
        callAndIgnoreResult('You feel crumpy', function() {
            checkCallAndResponse('What is your feeling today?', 'I don\'t feel anything');
        });     
    });

    it('should support the condition tag 5', function() {
        callAndIgnoreResult('You feel crumpy', function() {
            checkCallAndResponse('How are you feeling today?', undefined);
        });         
    });

    it('should support the condition tag 6', function() {
        callAndIgnoreResult('You feel crumpy', function() {
            checkCallAndResponse('Tell me about your feelings', 'I kinda feel nothing My name is WireInterpreter.');
        });     
    });

    it('should support the condition tag 7', function() {
        callAndIgnoreResult('You feel happy', function() {
            checkCallAndResponse('What is your feeling today?', 'Feeling happy!');
        });     
    });

    it('should support the condition tag 8', function() {
        callAndIgnoreResult('You feel happy', function() {
            checkCallAndResponse('How are you feeling today?', "I am happy!");
        });         
    });

    it('should support the condition tag 9', function() {
        callAndIgnoreResult('You feel happy', function() {
            checkCallAndResponse('Tell me about your feelings', 'I am happy!');
        });     
    });

    it('should support the condition tag 10', function() {
        callAndIgnoreResult('You feel sad', function() {
            checkCallAndResponse('What is your feeling today?', 'Feeling sad today');
        });     
    });

    it('should support the condition tag 11', function() {
        callAndIgnoreResult('You feel sad', function() {
            checkCallAndResponse('How are you feeling today?', "I am sad!");
        });         
    });

    it('should support the condition tag 12', function() {
        callAndIgnoreResult('You feel sad', function() {
            checkCallAndResponse('Tell me about your feelings', 'I am sad!');
        });     
    });

    it('should support the think tag 1', function() {
    	checkCallAndResponse('Explain HANA', 'Sorry, I do not have a clue', [ "HANA" ]);
    });

    it('should support the think tag 2', function() {
        callAndIgnoreResult('I am 42', function() {
            checkCallAndResponse('How old am I?', 'You are 42');
        });    	
    });
    
    it('should support the think tag 3', function() {
        callAndIgnoreResult('I am 42', function() {
            checkCallAndResponse('What do you know about me?', 'Your name is Ben. and you are 42');
        });
    });
    
 	it('should support the condition and srai tags 1', function() {
        callAndIgnoreResult('I am 42', function() {
            callAndIgnoreResult('You feel crumpy', function() {
                checkCallAndResponse('Test condition and srai', 'I don\'t feel anything You are 42');
            }); 
        });     	
    });

    it('should support the condition and srai tags 2', function() {
        callAndIgnoreResult('I am 42', function() {
            callAndIgnoreResult('You feel happy', function() {
                checkCallAndResponse('Test condition and srai', 'Feeling happy! My name is WireInterpreter.');
            }); 
        });         
    });

    it('should support the condition and srai tags 3', function() {
        callAndIgnoreResult('I am 42', function() {
            callAndIgnoreResult('You feel sad', function() {
                checkCallAndResponse('Test condition and srai', 'Feeling sad today Your name is Ben.');
            }); 
        });         
    });
    
    it('should support the finding nothing', function() {
    	checkCallAndResponse('Test the wildcard pattern!', 'I found nothing.');
    });

	it('should support case insensitive testing 1', function() {
    	checkCallAndResponse('You feel BAD', 'I feel BAD!', [ "BAD" ]);
    });

	it('should support case insensitive testing 2', function() {
    	checkCallAndResponse('You feel good', 'I feel good!', [ "good" ]);
    });

	it('should support case insensitive testing 3', function() {
    	checkCallAndResponse('You feel hAPPy', 'I feel hAPPy!', [ "hAPPy" ]);
		aimlInterpreter.findAnswerInLoadedAIMLFiles('You feel hAPPy', function(answer, wildCardArray, input) {
			assert.notEqual(answer, 'I feel HAPPy!');
		});
    });

	it('should support case insensitive testing 4', function() {
    	checkCallAndResponse('You feel FINEeeeee', 'I feel FINEeeeee!', [ "FINEeeeee" ]);
		aimlInterpreter.findAnswerInLoadedAIMLFiles('You feel FINEeeeee', function(answer, wildCardArray, input) {
			assert.notEqual(answer, 'I feel FINEEEEEE!');
		});
    });

	it('should support the random tag', function() {
		aimlInterpreter.findAnswerInLoadedAIMLFiles('Give me a letter.', function(answer, wildCardArray, input) {
			assert.equal(answer.length, 1);
		});
    });

    it('should support srai in the random tag', function() {
        aimlInterpreter.findAnswerInLoadedAIMLFiles('Test srai in random.', function(answer, wildCardArray, input) {
            // The result could be:
            // My name is WireInterpreter.
            // Your name is Ben.
            if (((answer === "My name is WireInterpreter.") || (answer === "Your name is Ben.")) == false) {
                console.log("Answer was: " + answer);
                console.log("Epected: 'My name is WireInterpreter.' or ''My name is Ben.");
                assert(false);
            }
        });
    });

    it('should support wildcards random tag', function() {
		checkCallAndResponse("Test wildcard What is my name?", "Thanks for testing!", [ "What is my name" ]);
    });

    it('should support multiple wildcards random tag', function() {
		checkCallAndResponse("Test multiple beautiful wildcards you are", "you are beautiful", [ "beautiful", "you are" ]);
    });
})


