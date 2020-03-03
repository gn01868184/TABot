'use strict';
const dialogflow1 = require('dialogflow');
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const intentsUpdate = require('./intentsUpdate.js');
const sheetsGet = require('./sheetsGet.js');
const sheetsUpdate = require('./sheetsUpdate.js');
const entitiesUpdate = require('./entitiesUpdate.js');
const firebaseRead = require('./firebaseRead.js');
const firebaseWrite = require('./firebaseWrite.js');
const neo4jRead = require('./neo4jRead.js');
const app = dialogflow({
  debug: true,
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
  clientId: '48279450292-dqn0hajau3qlq98qncipo4g50rbderpj.apps.googleusercontent.com',
});

app.intent('課程知識地圖2', (conv) => {
  const CQL = 'MATCH (a:Section{name: $name})-[rel:Item]-(b) RETURN a,b';
  return neo4jRead(CQL, conv.body.queryResult.parameters.Keywords).then((req) => {
    let singleRecord = req.records[0];
    let node = singleRecord.get(0);
    let node2 = singleRecord.get(1);
    let facebookMessages =
    [
        {
          "quickReplies": {
          "title": `你想了解的${node.properties.name}在${node.properties.URL}\n了解相關課程↓`,
          "quickReplies": [
            node2.properties.name
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
    ];
    conv.json({ 'fulfillmentMessages': facebookMessages });
  });
});

app.intent('擴增知識2', (conv) => {
  sheetsUpdate(conv.body.queryResult.parameters.any);
  conv.json({ 'fulfillmentText': `助教正在審核內容中...` });
});

app.intent('個人化考題', (conv) => {
  const SPREADSHEET_ID = '1Bezl1MdNN2X06O57Prm1GeetZddC5ttwxh20N2PtyV4';
  const CQL = 'MATCH (a:Student{name: $name})-[rel]-(b) RETURN b';
  let number = JSON.parse(conv.body.originalDetectIntentRequest.payload.data.sender.id);
  return firebaseRead(number).then((ID) => {
    return neo4jRead(CQL, ID).then((req) => {
      let reqLength = req.records.length;
      console.log('常錯的問題有' + reqLength);
      let singleRecord = req.records[Math.floor(Math.random()*reqLength)];
      let node = singleRecord.get(0);
      console.log('題號' + node.properties.name);
      return sheetsGet(SPREADSHEET_ID).then((sheets) => {
        //答案Context
        const session = conv.body.session.split("/");
        console.log(session[4]);
        const client = new dialogflow1.ContextsClient();
        const formattedParent = client.sessionPath('test-pclcyl', session[4]);
        const context = {
          name: client.contextPath('test-pclcyl', session[4], sheets[node.properties.name][6]),
          lifespanCount: 1
        };
        const request = {
          parent: formattedParent,
          context: context,
        };
        client.createContext(request)
          .then(responses => {
            const response = responses[0];
            console.log(response);
          })
          .catch(err => {
            console.error(err);
          });
        //回覆
        let resText =
        [
            {
              "quickReplies": {
              "title": `${sheets[node.properties.name][1]}\nA:${sheets[node.properties.name][2]}\nB:${sheets[node.properties.name][3]}\nC:${sheets[node.properties.name][4]}\nD:${sheets[node.properties.name][5]}`,
              "quickReplies": [
                'A','B','C','D'
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
        ];
        conv.json({ 'fulfillmentMessages': resText });
      });
    });
  });
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
  const session = conv.body.session.split("/");
  console.log(session[4]);
  const client = new dialogflow1.ContextsClient();
  const formattedParent = client.sessionPath('test-pclcyl', session[4]);
  const context = {
    name: client.contextPath('test-pclcyl', session[4], "A"),
    lifespanCount: 2
  };
  const request = {
    parent: formattedParent,
    context: context,
  };
  client.createContext(request)
    .then(responses => {
      const response = responses[0];
      console.log(response);
      // doThingsWith(response)

    })
    .catch(err => {
      console.error(err);
    });
  conv.json({ 'fulfillmentText': `完成` });
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
