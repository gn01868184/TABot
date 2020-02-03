const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://140.121.197.131:11005", neo4j.auth.basic("neo4j", "gn199745"));
const session = driver.session();
const resultPromise = session.run(
  'MATCH (a:Chapter {name: $name}) RETURN a',
  {name: "HTML 5"}
);
//neo4jAPI
module.exports = function (){
  return new Promise((resolve) => {
    resultPromise.then(result => {
      session.close();

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log(node.properties.name + " URL: " + node.properties.URL);
      // on application exit:
      driver.close();
      resolve(node.properties.URL);
    });
  });
}
