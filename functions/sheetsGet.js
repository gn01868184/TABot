const {google} = require('googleapis');
const sheets = google.sheets('v4');

const API_KEY = 'AIzaSyDdZyWBklrrnpqzBtbSw6kCr_DVmPVO4To';

module.exports = function (SPREADSHEET_ID) {
  return new Promise((resolve) => {
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      key: API_KEY,
      range: '工作表1',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
        });
        resolve(rows);
      } else {
        console.log('No data found.');
      }
    });
  });
};
