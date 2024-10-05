import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ToDo({ todo, toggleComplete, deleteTodo, editTodo }) {
  return (
    <li class="todoItem">
      <div className="todoText">
        {/* Checkbox to toggle the completion status of the todo */}
        <input
          onChange={() => toggleComplete(todo)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
        />
        <p
          className={todo.completed ? "toDoCompleted" : ""}
          onClick={() => toggleComplete(todo)}
        >
          {todo.text}
        </p>
        {/* <p className={todo.completed ? "toDoCompleted"} onClick={() => toggleComplete(todo)}>{todo.text}</p> */}
      </div>

      <div className="todoButtons">
        {/* Button to delete the todo */}
        <button className="todoButton" onClick={() => deleteTodo(todo.id)}>
          {<FaRegTrashAlt size={17} />}
        </button>
        {/* Button to edit the todo */}
        <button className="todoButton" onClick={() => editTodo(todo)}>
          {<MdEdit size={17} />}
        </button>
      </div>
    </li>
  );
}
