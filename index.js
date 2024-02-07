const { MongoClient } = require("mongodb");
const mongo = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { family: 4 });

const dbName = "test";

const addNewTodo = async (todosCollection, title) => {
  await todosCollection
    .insertOne({
      title,
      done: false,
    })
    .then((msg) => console.log("Udało się dodać do bazy", msg))
    .catch((err) => console.log("Błąd dodawania", err));
};

const doTheToDo = async (todosCollection) => {
  const [command, ...args] = process.argv.splice(2);
  switch (command) {
    case "add":
      await addNewTodo(todosCollection, args[0]);
      break;
  }
};

const handleRequest = () => {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const todosCollection = db.collection("todos");
  doTheToDo(todosCollection);
};

client.connect().then(handleRequest());
