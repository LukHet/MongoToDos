const { MongoClient, ObjectId } = require("mongodb");

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

const markTaskAsDone = async (todosCollection, id) => {
  let exit = false;
  await todosCollection
    .find({ _id: new ObjectId(id) })
    .toArray()
    .then((data) => {
      if (data.length !== 1) {
        console.log("Nie ma takiego zadania");
        exit = true;
        return;
      }
      if (data[0].done) {
        console.log("To zadanie już zostało zakończone");
        exit = true;
        return;
      }
    })
    .catch((err) => console.log("Błąd wyświetlania bazy", err));

  if (exit == true) {
    return;
  }

  await todosCollection
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          done: true,
        },
      }
    )
    .then((msg) =>
      console.log("Udało zmienić status zadania na zrobiony ", msg)
    )
    .catch((err) => console.log("Błąd zmieniania statusu ", err));
};

const deleteAllDoneTasks = async (todosCollection) => {
  await todosCollection
    .deleteMany({
      done: true,
    })
    .then((msg) => console.log("Wyczyszczono zrobione zadania ", msg))
    .catch((err) => console.log("Błąd podczas usuwania ", err));
};

const deleteTask = async (todosCollection, id) => {
  let exit = false;
  await todosCollection
    .find({ _id: new ObjectId(id) })
    .toArray()
    .then((data) => {
      if (data.length !== 1) {
        console.log("Nie ma takiego zadania");
        exit = true;
        return;
      }
    })
    .catch((err) => console.log("Błąd wyświetlania bazy", err));

  if (exit == true) {
    return;
  }

  await todosCollection
    .deleteOne({
      _id: new ObjectId(id),
    })
    .then((msg) => console.log("Zadanie usunięte ", msg))
    .catch((err) => console.log("Błąd podczas usuwania ", err));
};

const displayingTodos = (todosCollection) => {
  const todosToDo = todosCollection.filter((todo) => !todo.done);
  const todosDone = todosCollection.filter((todo) => todo.done);
  console.log(`# Lista zadań do zrobienia - ${todosToDo.length} zadań`);
  for (const todo of todosToDo) {
    console.log(
      `- id: ${todo._id} nazwa: ${todo.title} - ${
        todo.done ? "Zakończony" : "Do zrobienia"
      }`
    );
  }
  console.log(`# Lista zadań zrobionych - ${todosDone.length} zadań`);
  for (const todo of todosDone) {
    console.log(
      `- id: ${todo._id} nazwa: ${todo.title} - ${
        todo.done ? "Zakończony" : "Do zrobienia"
      }`
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
    case "list":
      await showAllTodos(todosCollection);
      break;
    case "done":
      await markTaskAsDone(todosCollection, args[0]);
      break;
    case "delete":
      await deleteTask(todosCollection, args[0]);
      break;
    case "cleanup":
      await deleteAllDoneTasks(todosCollection, args[0]);
      break;
    default:
      console.log("Niepoprawna komenda");
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
