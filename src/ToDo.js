import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ToDo({ todo, toggleComplete, deleteTodo, editTodo }) {
  return (
    <li>
      <div>
        {/* Checkbox to toggle the completion status of the todo */}
        <input
          onChange={() => toggleComplete(todo)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
        />

        <p onClick={() => toggleComplete(todo)}>{todo.text}</p>
      </div>

      {/* Button to delete the todo */}
      <button onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
      {/* Button to edit the todo */}
      <button onClick={() => editTodo(todo)}>{<MdEdit />}</button>
    </li>
  );
}
