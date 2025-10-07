import { hElement } from "./h.js";
import { mountDOM } from "./mount-dom.js";

function login(){
    console.log("login");
}
const vdom = hElement('form', { class: 'login-form', action: 'login' }, [
    hElement('input', { type: 'text', name: 'user' }),
    hElement('input', { type: 'password', name: 'pass' }),
    hElement('button', { style: { color: "red", "font-size": "30px" },
        on: { click: login } }, ['Login'])
]);

mountDOM(vdom, document.body);
