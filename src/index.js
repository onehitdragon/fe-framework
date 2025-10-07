import { hElement, hFragment } from "./h.js";
import { mountDOM } from "./mount-dom.js";

const appState = {
    todos: [],
    editingIdxs: []
}

function App(state){
    return hFragment([
        hElement("h1", {}, ["My TODOs"]),
        CreateTodo(state),
        TodoList(state)
    ])
}

function CreateTodo(state){
    return hFragment([
        hElement("h5", {}, ["New TODO"]),
        hElement("input", { type: "text", label: "todo" }),
        hElement("button", { on: { click: () => state.todos.push("some thing") } }, ["Add"])
    ]);
}

function TodoList(state){
    return hElement("ul", {}, 
        state.todos.map((todo, i) => TodoItem(todo, i, state.editingIdxs))
    );
}

function TodoItem(todo, idxInList, editingIdxs){
    const isEditing = editingIdxs.has(idxInList);
    return hElement("li", {}, [
        isEditing ? TodoInEditMode(todo, idxInList) : TodoInReadMode(todo, idxInList)
    ]);
}

function TodoInReadMode(todo, idxInList){
    return hFragment([
        "-",
        hElement("span", {}, [todo]),
        hElement("button", {}, ["Done"])
    ]);
}

function TodoInEditMode(todo, idxInList){
    return hFragment([
        "-",
        hElement("input", { type: "text", label: "todo", value: todo }),
        hElement("button", {}, ["Save"]),
        hElement("button", {}, ["Cancel"])
    ]);
}

const vDom = App(appState);
console.log(vDom);
mountDOM(vDom, document.body);
