const { MongoClient } = require("mongodb");

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

const displayingTodos = (todosCollection) => {
  const todosToDo = todosCollection.filter((todo) => !todo.done);
  const todosDone = todosCollection.filter((todo) => todo.done);
  console.log(`# Lista zadań do zrobienia - ${todosToDo.length} zadań`);
  for (const todo of todosToDo) {
    console.log(
      `- ${todo.title} - ${todo.done ? "Zakończony" : "Do zrobienia"}`
    );
  }
  console.log(`# Lista zadań zrobionych - ${todosDone.length} zadań`);
  for (const todo of todosDone) {
    console.log(
      `- ${todo.title} - ${todo.done ? "Zakończony" : "Do zrobienia"}`
    );
  }
};

const showAllTodos = async (todosCollection) => {
  const toDos = await todosCollection
    .find()
    .toArray()
    .then((data) => console.log(displayingTodos(data)))
    .catch((err) => console.log("Błąd wyświetlania bazy", err));
};

const doTheToDo = async (todosCollection) => {
  const [command, ...args] = process.argv.splice(2);
  switch (command) {
    case "add":
      await addNewTodo(todosCollection, args[0]);
      break;
  }
  switch (command) {
    case "list":
      await showAllTodos(todosCollection, args[0]);
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
