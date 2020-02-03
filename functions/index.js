'use strict';
const dialogflow1 = require('dialogflow');
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
//const http = require('http');
//const neo4j = require('neo4j-driver');
//const axios = require('axios');
const intentsUpdate = require('./intentsUpdate.js');
const sheetsGet = require('./sheetsGet.js');
const sheetsUpdate = require('./sheetsUpdate.js');
const entitiesUpdate = require('./entitiesUpdate.js');
const firebaseRead = require('./firebaseRead.js');
const firebaseWrite = require('./firebaseWrite.js');

const app = dialogflow({
  debug: true,
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
  clientId: '48279450292-dqn0hajau3qlq98qncipo4g50rbderpj.apps.googleusercontent.com',
});

app.intent('更新關鍵字實體', (conv) => {
  const SPREADSHEET_ID = '1UIEQekmLryJJSolpJNc15qar1fp4q-txiQgw1X-leLk';
  return sheetsGet(SPREADSHEET_ID).then((sheets) => {
    let entityList = [];
    for(let i=1;i<sheets.length;i++){
      entityList.push({value: sheets[i][0], synonyms: sheets[i][1].split(", ")});
    }
    console.log(entityList);
    entitiesUpdate('Keywords', entityList);
    conv.json({ 'fulfillmentText': `Entity更新完成` });
  });
});

app.intent('擴增知識2', (conv) => {
  sheetsUpdate(conv.body.queryResult.parameters.any);
  conv.json({ 'fulfillmentText': `助教正在審核內容中...` });
});

app.intent('讀取學號', (conv) => {
  let number = JSON.parse(conv.body.originalDetectIntentRequest.payload.data.sender.id);
  return firebaseRead(number).then((ID) => {
    conv.json({ 'fulfillmentText': `你的學號是${ID}` });
  });
});

app.intent('設定學號2', (conv) => {
  let senderID = JSON.parse(conv.body.originalDetectIntentRequest.payload.data.sender.id);
  let studentID = JSON.parse(conv.body.queryResult.queryText);
  firebaseWrite(senderID, studentID);
  conv.json({ 'fulfillmentText': `設定好囉` });
});

app.intent('更新意圖', (conv) => {
  const SPREADSHEET_ID = '1XFD6g__B-IkfG03wHr7H8QHQWORjZ326MviM3TcsC2Q';
  return sheetsGet(SPREADSHEET_ID).then((sheets) => {
    for(let i=1;i<sheets.length;i++){
      let trainingPhrases = [];
      let messages = [];
      let question = sheets[i][1].split(", ");
      for(let j=0;j<question.length;j++){
        let keyword = question[j].split("\"");
        if(keyword.length>1){
          trainingPhrases.push({
            "type": "EXAMPLE",
            "parts": [
              {
                "text": keyword[0]
              },
              {
                "text": keyword[1],
                "alias": "Key",
                "entityType": "@Keywords",
                "userDefined": true
              },
              {
                "text": keyword[2]
              }
            ]
          });
        }
        else{
          trainingPhrases.push({
            "type": "EXAMPLE",
            "parts": [
              {
                "text": keyword[0]
              }
            ]
          });
        }
      }
      messages.push({
        "text": {
          "text": [sheets[i][2]]
        }
      });
      intentsUpdate(sheets[i][0], trainingPhrases, messages);
    }
    conv.json({ 'fulfillmentText': `Intents更新完成` });
  });
});

app.intent('選項功能', (conv) => {
  let input =[
      {
        "quickReplies": {
          "title": "你有什麼問題呢",
          "quickReplies": [
            "FAQ",
            "課程知識地圖",
            "個人化功能",
            "真人回覆"
          ]
        },
        "platform": "FACEBOOK"
      },
      {
        "text": {
          "text": [
            ""
          ]
        }
      }
    ]

    conv.json({ 'fulfillmentMessages': input });
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
