var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const querystring = require('querystring');
const watson = require('watson-developer-cloud'); // watson sdk
var retrieve_and_rank = watson.retrieve_and_rank({
  username: 'f52ce40c-c4b3-4bce-bef1-18d45b7cb6c2',
  password: 'XKnBPpXiXu3s',
  version: 'v1'
});
var params = {
  cluster_id: 'scd125453e_b4d5_4c3d_aa20_ccf8e6e5560b',
  collection_name: 'PolicyQuery',
  wt: 'json'
};


app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  //response.send("Hello World!")
  var response = 'This is a sample response from your webhook!' //Default response from the webhook to show it's working;
  solrClient = retrieve_and_rank.createSolrClient(params);
  var query = solrClient.createQuery();
  var result;
  query.q(req.body.result.parameters['question']);
  console.log('log request', req.body.result.parameters['question']);
  
  solrClient.search(query, function(err, searchResponse) {
  if(err) {
    console.log('Error searching for documents: ' + err);
    res.send(err);
  }
    else {
      console.log('Found ' + searchResponse.response.numFound + ' documents.');
     console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
      //result = JSON.parse(JSON.stringify(searchResponse.response.docs[0].body, null, '\t'));//.replace(/\n/g,'\n');
       result = JSON.parse(searchResponse.response.docs[0].body);//.replace(/\n/g,'\n');
      console.log('Response content: ' + result);
      //response = querystring.escape(result);
      response=result;
      if ( result.includes('endorse'))
      {
        console.log('No append needed for endorse');
      }
      else
      {
        response = response + '\n\n Is there anything else I can assist you with?';
      }
//      resp = {'output': {'text': searchResponse.response.docs[0].contentHtml ,'type':'rankret'}};
//      res.send(JSON.stringify(resp));
        //res.send(searchResponse.response.docs[0]);
      console.log('Final content: ' + response.toString());
      
      res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response ,"data": {"skype": {"text":JSON.parse(JSON.stringify(searchResponse.response.docs[0].contentHtml, null, 2))}}}));
  //    res.send(JSON.stringify({ "speech": response, "displayText": response }));
    }
});
    
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
