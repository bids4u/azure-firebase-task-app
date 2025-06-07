const { MongoClient } = require("mongodb");

const uri = process.env.MongoDbConnection;
const dbName = process.env.MongoDbDatabaseName;

const client = new MongoClient(uri);
let db = null;


async function connectToDatabase() {

  if (!db) {
    try {
      await client.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = client.db(dbName);
    } catch (e) {
      console.log(e);
    }
  }
 
  return  {db} ;
}

module.exports = connectToDatabase;
