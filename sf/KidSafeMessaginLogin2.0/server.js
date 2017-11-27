var express = require('express');
var env = process.env.EPAAS_ENV || 'dev';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app = express();
app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);
console.log('Enviroment: ' + env);