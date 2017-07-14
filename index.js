var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, res) {
  //response.send("Hello World!")
  var response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working;

res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
