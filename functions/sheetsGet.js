const {google} = require('googleapis');
const sheets = google.sheets('v4');

const SPREADSHEET_ID = '1UIEQekmLryJJSolpJNc15qar1fp4q-txiQgw1X-leLk';
const API_KEY = 'AIzaSyDdZyWBklrrnpqzBtbSw6kCr_DVmPVO4To';

module.exports = function () {
  return new Promise((resolve) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      key: API_KEY,
      range: 'Sheet1',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}`);
        });
        resolve(rows);
      } else {
        console.log('No data found.');
      }
    });
  });
};
