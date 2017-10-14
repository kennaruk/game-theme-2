let google = require('googleapis');
let authentication = require("../authentication");

const spreadsheetId = '18dfkQ1b8ecoKyBexoBVJY8NMJFgu598iRB4HUkDSFo4';
const range = 'Sheet1!A2:I';
const sheets = google.sheets('v4');

exports.getPayloadByKey = (key, callback) => {

    authentication.authenticate().then((auth) => {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A2:E', 
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        callback(err, null);
        return;
      }
      var rows = response.values;
    //   console.log('rows: ', rows);
      if (rows.length === 0) {
        console.log('No data found.');
      } else {
        for (var i = 0; rows.length; i++) {
          var row = rows[i];
          if(row === undefined)
              break;
          var payload = {
            key: row[0],
            question: row[1],
            answer: row[2],
            image: row[3],
            status: row[4],
            index : i
        }
          if(row[0] === key) {
            console.log("index server: "+payload.index);
            callback(false, payload);
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
     var updateRange = 'E'+(parseInt(index)+2);

  authentication.authenticate().then((auth) => {
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: updateRange, 
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [["TRUE"]]
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
    //Change Status to true
    callback(false);
};

