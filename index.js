const { MongoClient } = require("mongodb");
const mongo = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { family: 4 });

const dbName = "test";

async function main() {
  await client.connect().then(console.log("Connected successfully to server"));

  const db = client.db(dbName);
  const todosCollection = db.collection("todos");

  client.close();
}

main();
