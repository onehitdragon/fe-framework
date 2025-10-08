import { createApp } from "./app.js";
import { hElement } from "./h.js";

const initState = { count: 0 };
function CountingApp(state, dispatch){
    return hElement(
        "button",
        { on: { click: () => { dispatch("increase") } } },
        [`counting: ${state.count}`]
    );
}
const reducers = {
    increase: (state, payload) => {
        return { count: state.count + 1 };
    }
};

const app = createApp({ state: initState, view: CountingApp, reducers });
app.mount(document.body);
