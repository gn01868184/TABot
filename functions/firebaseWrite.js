const firebase = require('firebase');
require('./firebaseinit.js');

const database = firebase.database();
//callfirebase
module.exports = function (senderID, studentID){
  database.ref(`/${senderID}`).set({
      studentID:studentID
  });
}
