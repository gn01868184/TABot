const dialogflow = require('dialogflow');
// Instantiates the Intent Client
const intentsClient = new dialogflow.IntentsClient();

// The path to identify the agent that owns the created intent.
const agentPath = intentsClient.projectAgentPath('test-pclcyl');

module.exports = function (intentName, trainingPhrases, messages) {
  class IntentNotFoundError extends Error {};
  intentsClient
  .listIntents({parent: agentPath})
  .then((responses) => {
  // The array of Intents is the 0th element of the response.
    const resources = responses[0];
    // Loop through and find the Intent we wish to update.
    for (let i = 0; i < resources.length; i++) {
      const intent = resources[i];
      if (intent.displayName === intentName) {
        return intent;
      }
    }
  })
  .then((resIntent) => {
    console.log('Found intent: ', JSON.stringify(resIntent));

    // Replace the Intent's existing Intents with our new list.
    resIntent.trainingPhrases = trainingPhrases;
    resIntent.messages = messages;

    const request = {
      intent: resIntent,
      intentView: 'INTENT_VIEW_FULL'
    };
    // Tell Dialogflow to update the Intent.
    return intentsClient.updateIntent(request);
  })
// Log the updated Intent.
  .then((responses) => {
    console.log('Updated intent type:', JSON.stringify(responses[0]));
  })
// Catch any errors.
  .catch((err) => {
  // If this is the error we throw earlier in the chain, log the
  // cause of the problem.
    if (err instanceof IntentNotFoundError) {
      console.error('Could not find the intent named keywords.');
      return;
    }
    console.error('Error updating intent type:', err);
  });

};
