var mysql = require('mysql');
var dbConfig = require('./dbConfig');

var connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

var queryString = '';

queryString += 'CREATE TABLE IF NOT EXISTS pet (';
queryString += 'id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT , ';
queryString += 'name VARCHAR(20), ';
queryString += 'owner VARCHAR(20), ';
queryString += 'species VARCHAR(20), ';
queryString += 'sex CHAR(1), ';
queryString += 'birth DATE, ';
queryString += 'death DATE, ';
queryString += 'PRIMARY KEY (id)';
queryString += ');';

connection.query(queryString, function(err, results, fields) {
  if (err) throw err;

  console.log('Results:', results);
});

// var names = ["John", "Jacob", "Jingleheimer", "Schmidt"];

var names = [ "Lorem", 
              "ipsum", 
              "Ut", 
              "Duis", 
              "sunt", 
              "aute", 
              "quis", 
              "in", 
              "eiusmod", 
              "est", 
              "proident", 
              "eiusmod", 
              "sit", 
              "nisi", 
              "elit", 
              "labore" ];

for (var i = 0; i < names.length; i++) {
  var insertString = '';

  insertString += 'INSERT INTO pet ( name )';
  insertString += 'VALUES';
  insertString += '( "' + names[i] + '" );';

  connection.query(insertString, function(err, results, fields) {
    if (err) throw err;

    console.log('Results:', results);
  });
}


connection.end();

