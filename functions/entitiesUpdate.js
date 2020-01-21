const dialogflow1 = require('dialogflow');

//EntityTypesClient設定
const entitiesClient = new dialogflow1.EntityTypesClient();
// Create a path string for our agent based
// on its project ID (from first tab of Settings).
const projectId = 'test-pclcyl';
const agentPath = entitiesClient.projectAgentPath(projectId);

module.exports = function (displayName, entityList) {
  class EntityNotFoundError extends Error {};

  entitiesClient
  // Tell client library to call Dialogflow with a request to
  // list all EntityTypes.
      .listEntityTypes({parent: agentPath})
  // Go through all EntityTypes and find the one we wish to update
  // (in this case, the EntityType named 'keywords').
      .then((responses) => {
      // The array of EntityTypes is the 0th element of the response.
        const resources = responses[0];
        // Loop through and find the EntityType we wish to update.
        for (let i = 0; i < resources.length; i++) {
          const entity = resources[i];
          if (entity.displayName === displayName) {
            return entity;
          }
        }
        // If we couldn't find the expected entity, throw a custom error.
        throw new EntityNotFoundError();
      })
  // Update the keywords EntityType with a new list of Entities.
      .then((test) => {
        console.log('Found entity: ', JSON.stringify(test));

        // Replace the EntityType's existing Entities with our new list.
        test.entities = entityList;

        const request = {
          entityType: test,
          // Tell the API to only modify the 'entities' field, not any other
          // fields of the EntityType.
          updateMask: {
            paths: ['entities'],
          },
        };
        // Tell Dialogflow to update the EntityType.
        return entitiesClient.updateEntityType(request);
      })
  // Log the updated EntityType.
      .then((responses) => {
        console.log('Updated entity type:', JSON.stringify(responses[0]));
      })
  // Catch any errors.
      .catch((err) => {
      // If this is the error we throw earlier in the chain, log the
      // cause of the problem.
        if (err instanceof EntityNotFoundError) {
          console.error('Could not find the entity named keywords.');
          return;
        }
        console.error('Error updating entity type:', err);
      });
};
