let google = require('googleapis');
let authentication = require("../authentication");

const spreadsheetId = '1I9BvHPQlxsIAVxBZWXqAry0Fdu0tePcttAiJ2gR8FRY';
const sheet = 'Testing!';
const range = sheet+'A2:M';
const sheets = google.sheets('v4');

exports.getPayloadByKey = (key, callback) => {

    authentication.authenticate().then((auth) => {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: range, 
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        callback(err, null);
        return;
      }
      var rows = response.values;
      if (rows.length === 0) {
        console.log('No data found.');
      } else {
        for (var i = 0; i<rows.length; i++) {
          var row = rows[i];
          if(row === undefined)
              break;
          if(row[6] === key) {
            row.push(i);
            callback(false, row);
            return;   
          }
        }
        callback('not found', null);
        return;
      }
    });
  });
   
};

//  var payload = {
//         key: 'xp2y',
//         question: 'สไปเดอร์แมนคีบแขนทศกัณฑ์',
//         answer: '8220',
//         image: './mockupimg.jpg',
//         status: false
//     }
//     callback(false, payload);


exports.updateStatusByKey = (index, callback) => {
  var updateRange = sheet+'M'+(parseInt(index)+2);
  console.log('updateRange: ', updateRange);
  authentication.authenticate().then((auth) => {
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: updateRange, 
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [["ถูก"]]
      } 
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        callback(err);
        return;
      } else {
        console.log('Update!! TRUE');
        callback(false);
      }
    });
  });
};

