var fs = require('fs');
var Matilda = require('../src/Matilda.js');



var topics = 5; // number of topics
var docs = -1; //limit to reading number of docs in corpus
var iterations = 100; //number of iterations of lda


var mM = new Matilda.Model();
mM.setNumberOfTopics(topics);


var stop_words_txt = fs.readFileSync('stop_words.json', 'utf8');
var stop_words = JSON.parse(stop_words_txt);
// fs.writeFileSync("stop_words.v.json", stop_words_txt.replace(/'/g, "\""));


// fs.readFile('internet.linux.computers.pretty.json', 'utf8', function(err, data){
fs.readFile('sports.arts.computers.buisness.management.home.society.science.json', 'utf8', function(err, data){
    if(err) throw err;

    var documents = JSON.parse(data);

    documents.forEach(function(doc, docIndex){
        var wordlist = [];

        if(docs > 0 && docIndex > docs) return false;

        //convert keys of dict to words placed as many time as seen
        for( var prop in doc.wordcounts){
            if(stop_words.indexOf(prop) == -1) //if not is stop words
            if(!prop.match(/\s/g)) //if not contain whitespace
            if(!prop.match(/\d/g)) //if not contains digits
            if( doc.wordcounts.hasOwnProperty(prop) ){
                // console.log(prop);
                for(var i = 0; i < doc.wordcounts[prop]; ++i){
                    wordlist.push(prop);
                }
            }
        }
        // console.log('Wordlist size: ', wordlist.length);
        mM.addDocument(wordlist);
    });

    mM.train(iterations, function(modelData){
    process.stdout.write('.');
        // console.log(modelData.vocab);
        // console.log(modelData.topics);
        // console.log(modelData.documents);
    });
    process.stdout.write('\nFinished taining.\n');

    // console.log( mM.topicCorrelations() );
    // console.log( mM.getTopics() );
    // console.log( mM.getWordsByTopics() );
    // console.log( mM.getVocabulary() );


    var topics = mM.getTopics();
    topics.forEach(function(topic, topicIndex){
        //find and print highest 10 wordcounts
        var highest = [];
        for(var prop in topic.withWord){
            if(topic.withWord.hasOwnProperty(prop)){
                if(highest.length < 10){
                    highest.push( [ prop, topic.withWord[prop] ] );
                    // console.log("Pushing word ", prop, " with wordcount ", topic.withWord[prop]);
                    continue;
                }

                //get min wordcount from highest arr
                var min = Math.min.apply(null, highest.map(function(x){ return x[1]}) );
                var minInd = highest.map(function(x){ return x[1]}).indexOf(min);
                if(minInd == -1){
                    console.error("No index for highest with wordcount: ", min);
                    return;
                }

                if(topic.withWord[prop] > min){
                    //add prop to highest
                    highest[minInd] = [ prop, topic.withWord[prop] ];
                }
            }
        }
        console.log("Topic: ", topic.id);
        console.log(highest.sort(function(a, b){
            return a[1] < b[1];
        }));
    });


    // mM.getWordsByTopics().forEach(function(topic, topicIndex){
    //     //pick first N values and print them out
    //     var N = 10;
    //     var top10 = [];
    //     for(var i = 0; i < N; ++i){
    //         top10[i] = topic[i];
    //     }
    //     console.log('Topic: ', topicIndex);
    //     console.log(top10);
    // });

});


