const firebase = require('firebase');
require('./firebaseinit.js');

const database = firebase.database();
//callfirebase
module.exports = function (senderID, studentID, online){
  database.ref(`/facebookID/${senderID}`).set({
      studentID: studentID,
      online: online
  });
}
