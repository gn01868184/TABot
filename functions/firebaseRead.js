const firebase = require('firebase');
require('./firebaseinit.js');

const database = firebase.database();
//callfirebase
module.exports = function (senderID){
  return new Promise((resolve, reject) => {
    database.ref(`/${senderID}`).once('value',e=>{
      let facebookID = e.val();
      let studentID = facebookID["studentID"];
      console.log('studentID:' + studentID);
      resolve(studentID);
    });
  });
}
