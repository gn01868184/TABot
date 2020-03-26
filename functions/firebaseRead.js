const firebase = require('firebase');
require('./firebaseinit.js');

const database = firebase.database();
//callfirebase
module.exports = function (firebaseRef){
  return new Promise((resolve, reject) => {
    database.ref(`${firebaseRef}`).once('value',e=>{
      let refValue = e.val();
      console.log(refValue);
      resolve(refValue);
    });
  });
}
