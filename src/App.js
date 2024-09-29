import "./App.css";
import Timer from "./Timer";
import React, { useState, useEffect } from "react";
import ToDo from "./ToDo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  // Function to create a new todo item
  const createTodo = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (input === "") {
      alert("Please enter a valid todo.");
      return;
    }
    // Add new todo to Firestore database with completed set to false by default
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput(""); // Clear input after submitting
  };

  // useEffect to read todos from Firebase in real-time
  useEffect(() => {
    const q = query(collection(db, "todos")); // Create a Firestore query
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = []; // Temporary array to hold the todos from Firestore
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id }); // Add each todo document to the array
      });
      setTodos(todosArr);
    });
    return () => unsubscribe(); // Clean up the subscription when the component unmounts
  }, []);

  // Function to toggle the completed status of a todo in Firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // Function to handle editing a todo item
  const editTodo = (todo) => {
    setInput(todo.text); // Set the current todo's text in the input field for editing
    setEditingTodo(todo); // Store the todo being edited in state
  };

  // Function to save the edited todo to Firestore
  const saveEditedTodo = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page on submit
    if (input === "") {
      alert("Please enter a valid todo.");
      return;
    }

    // Update the text of the current todo in Firestore
    await updateDoc(doc(db, "todos", editingTodo.id), {
      text: input, // Use the input value as the updated text
    });

    setInput("");
    setEditingTodo(null); // Clear the editing state (indicating no todo is being edited)
  };

  // Function to delete a todo from Firebase
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className="App pomodoroBackground" id="app">
      {/* Timer component for Pomodoro functionality */}
      <Timer />

      {/* Form to add a new todo */}
      <form onSubmit={editingTodo ? saveEditedTodo : createTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input value as user types
          type="text"
          placeholder="Add Todo"
        />
        <button>{editingTodo ? "Save" : "Add"}</button>
      </form>

      {/* List of todos */}
      <ul>
        {todos.map((todo, index) => (
          <ToDo
            key={index}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ))}
      </ul>

      {todos.length < 1 ? null : <p>You have {todos.length} todos.</p>}
    </div>
  );
}

export default App;
