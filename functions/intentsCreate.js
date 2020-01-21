const dialogflow = require('dialogflow');

module.exports = function () {
  // Instantiates the Intent Client
  const intentsClient = new dialogflow.IntentsClient();

  // The path to identify the agent that owns the created intent.
  const agentPath = intentsClient.projectAgentPath('test-pclcyl');
  intentsClient
  .listIntents({parent: agentPath})
  .then((responses) => {
  // The array of Intents is the 0th element of the response.
    const resources = responses[0];
    // Loop through and find the Intent we wish to update.
    for (let i = 0; i < resources.length; i++) {
      console.log(resources[i]);
    }
  });
  const intent =   {
      "displayName": "常見問題",
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
        },
        {
          "type": "EXAMPLE",
          "parts": [
            {
              "text": "測試測試"
            }
          ]
        }
      ],
      "action": "",//Action and parameters
      "messages": [
        {
          "text": {
            "text": [
              "成功囉，這裡是機器人回覆", "失敗囉，這裡是機器人回覆"
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
