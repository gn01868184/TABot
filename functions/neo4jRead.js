const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://140.121.197.131:7687", neo4j.auth.basic("neo4j", "gn199745"));
const session = driver.session();

//neo4jAPI
module.exports = function (CQL, name){
  return new Promise((resolve) => {
    let resultPromise = session.run(
      CQL,
      {name: `${name}`}
    );

    resultPromise.then(result => {
      console.log(result);
      resolve(result);
    });
  });
}
