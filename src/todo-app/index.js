import { createApp } from "../app.js";
import { hElement, hFragment } from "../h.js";

const initState = {
    todos: ["Walk the dog", "Water the plants"],
    currentTodo: "",
    edit: {
        idx: null,
        original: null,
        edited: null,
    }
};
const reducers = {
    "update-current-todo": (state, currentTodo) => {
        return { ...state, currentTodo };
    },
    "add-todo": (state) => {
        return {
            ...state,
            currentTodo: "",
            todos: [...state.todos, state.currentTodo]
        }
    },
    "start-editing-todo": (state, idx) => {
        return {
            ...state,
            edit: {
                idx,
                original: state.todos[idx],
                edited: state.todos[idx]
            }
        }
    },
    "edit-todo": (state, edited) => {
        return {
            ...state,
            edit: {
                ...state.edit,
                edited
            }
        }
    },
    "save-edited-todo": (state) => {
        const newTodos = [...state.todos];
        newTodos[state.edit.idx] = state.edit.edited;
        return {
            ...state,
            todos: newTodos,
            edit: { idx: null, original: null, edited: null }
        }
    },
    "cancel-editing-todo": (state) => {
        return {
            ...state,
            edit: { idx: null, original: null, edited: null }
        };
    },
    "remove-todo": (state, idx) => {
        return {
            ...state,
            todos: state.todos.filter((_, i) => i != idx)
        }
    }
};
const app = createApp({ state: initState, view: App, reducers });
app.mount(document.body);

function App(state, dispatch){
    return hFragment([
        hElement("h1", {}, ["My TODOs"]),
        CreateTodo(state, dispatch),
        TodoList(state, dispatch)
    ])
}

function CreateTodo(state, dispatch){
    return hElement("div", {}, [
        hElement("label", { for: "todo-input", class: ["blue", "red"] }, ["New TODOs"]),
        hElement("input", {
            id: "todo-input",
            type: "text",
            value: state.currentTodo,
            on: {
                input: ({target}) => {
                    dispatch("update-current-todo", target.value);
                },
                keydown: ({key}) => {
                    if(key == "Enter" && state.currentTodo.length >= 3){
                        dispatch("add-todo");
                    }
                }
            }
        }),
        hElement(
            "button",
            {
                disabled: state.currentTodo.length < 3,
                on: {
                    click: () => dispatch("add-todo")
                }
            },
            [ "Add" ]
        )
    ]);
}

function TodoList(state, dispatch){
    return hElement("ul", {},
        state.todos.map((todo, i) => TodoItem(state, dispatch, todo, i))
    );
}

function TodoItem(state, dispatch, todo, idx){
    const isEditing = state.edit.idx === idx;
    return hElement("li", {}, [
        !isEditing ? TodoInReadMode(state, dispatch, todo, idx) : TodoInEditMode(state, dispatch)
    ]);
}

function TodoInReadMode(state, dispatch, todo, idx){
    return hFragment([
        hElement(
            "span",
            {
                on: {
                    dblclick: () => {
                        dispatch("start-editing-todo", idx);
                    }
                }
            },
            [todo]
        ),
        hElement(
            "button",
            {
                on: {
                    click: () => dispatch("remove-todo", idx)
                }
            },
            ["Done"]
        )
    ]);
}

function TodoInEditMode(state, dispatch){
    return hFragment([
        hElement(
            "input",
            {
                type: "text",
                value: state. edit.edited,
                on: {
                    input: ({ target }) => dispatch("edit-todo", target.value)
                }
            }
        ),
        hElement(
            "button",
            {
                on: {
                    click: () => dispatch("save-edited-todo")
                }
            },
            ["Save"]
        ),
        hElement(
            "button",
            {
                on: {
                    click: () => dispatch("cancel-editing-todo")
                }
            },
            ["Cancel"]
        )
    ]);
}
