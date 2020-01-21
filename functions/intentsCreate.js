const dialogflow = require('dialogflow');

module.exports = function () {
  // Instantiates the Intent Client
  const intentsClient = new dialogflow.IntentsClient();

  // The path to identify the agent that owns the created intent.
  const agentPath = intentsClient.projectAgentPath('test-pclcyl');

  const intent =   {
      "displayName": "新的Intents",
      "priority": 500000,
      "webhookState": "WEBHOOK_STATE_ENABLED",
      "trainingPhrases": [
        {
          "type": "EXAMPLE",
          "parts": [
            {
              "text": "這邊是訓練語句"
            }
          ]
        }
      ],
      "action": "",//Action and parameters
      "messages": [
        {
          "text": {
            "text": [
              "成功囉，這裡是機器人回覆"
            ]
          }
        }
      ]
    };

  const createIntentRequest = {
    parent: agentPath,
    intent: intent,
  };

  // Create the intent
  intentsClient.createIntent(createIntentRequest);
  //console.log(`Intent ${responses[0].name} created`);
  console.log(createIntentRequest);
};
//https://dialogflow.googleapis.com/v2/projects/test-pclcyl/agent/intents
