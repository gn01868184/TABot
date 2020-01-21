'use strict';
const dialogflow1 = require('dialogflow');
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
//const firebase = require('firebase');
//const http = require('http');
//const neo4j = require('neo4j-driver');
//const axios = require('axios');
//const intentsCreate = require('./intentsCreate.js');
const sheetsGet = require('./sheetsGet.js');
const sheetsUpdate = require('./sheetsUpdate.js');
const entitiesUpdate = require('./entitiesUpdate.js');

const app = dialogflow({
  debug: true,
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
  clientId: '48279450292-dqn0hajau3qlq98qncipo4g50rbderpj.apps.googleusercontent.com',
});

app.intent('新增Entities', (conv) => {
  entitiesUpdate(conv.body.queryResult.parameters.any);
  conv.json({ 'fulfillmentText': `更新好囉!` });
});

app.intent('試算表', (conv) => {
  return sheetsGet().then((sheets) => {
    //console.log(sheets[1][1].split(", "));
    let entityList = [];
    for(let i=1;i<sheets.length;i++){
      entityList.push({value: sheets[i][0], synonyms: sheets[i][1].split(", ")});
    }
    console.log(entityList);
    entitiesUpdate('Keywords', entityList);
    conv.json({ 'fulfillmentText': `試算表長度: ${sheets}` });
  });
});

app.intent('試算表2', (conv) => {
  sheetsUpdate(conv.body.queryResult.parameters.any);
  conv.json({ 'fulfillmentText': `助教正在審核內容中...` });
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
