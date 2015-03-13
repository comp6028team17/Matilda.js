var fs = require('fs');
var Matilda = require('../src/Matilda.js');

var mM = new Matilda.Model();
mM.setNumberOfTopics(3);

//sync
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

fs.readFile('internet.linux.computers.pretty.json', 'utf8', function(err, data){
    if(err) throw err;

    var documents = JSON.parse(data);

    documents.forEach(function(doc, docIndex){
        var wordlist = [];

        if(docIndex > 500) return false;

        //convert keys of dict to words placed as many time as seen
        for( var prop in doc.wordcounts){
            if( doc.wordcounts.hasOwnProperty(prop) ){
                for(var i = 0; i < doc.wordcounts[prop]; ++i){
                    wordlist.push(prop);
                }
            }
        }
        mM.addDocument(wordlist);
    });

    mM.train(50, function(modelData){
    process.stdout.write('.');
        // console.log(modelData.vocab);
        // console.log(modelData.topics);
        // console.log(modelData.documents);
    });

    // console.log( mM.topicCorrelations() );
    // console.log( mM.getTopics() );
    // console.log( mM.getWordsByTopics() );
    // console.log( mM.getVocabulary() );


    mM.getWordsByTopics().forEach(function(topic, topicIndex){
        //pick first N values and print them out
        var N = 10;
        var top10 = [];
        for(var i = 0; i < N; ++i){
            top10[i] = topic[i];
        }
        console.log('Topic: ', topicIndex);
        console.log(top10);
    });

});


