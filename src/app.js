import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { mountDOM } from "./mount-dom.js";
import { patchDOM } from "./patch-dom.js";

export function createApp({ state, view, reducers = {} }){
    let parentEl = null;
    let vdom = null;

    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];
    Object.entries(reducers).forEach(([commandName, reducer]) => {
        const sub = dispatcher.subscribe(commandName, (payload) => {
            state = reducer(state, payload);
        });
        subscriptions.push(sub);
    });
    function dispatch(commandName, payload){
        dispatcher.dispatch(commandName, payload);
    }

    function renderApp(){
        const newVdom = view(state, dispatch);
        if(vdom == null){
            mountDOM(newVdom, parentEl);
        }
        else{
            patchDOM(vdom, newVdom);
        }
        vdom = newVdom;
    }

    return {
        mount(_parentEl){
            parentEl = _parentEl;
            renderApp();
        },
        unmount(){
            if(vdom != null){
                destroyDOM(vdom);
                vdom = null;
            }
            subscriptions.forEach(unsubcribe => unsubcribe());
        }
    };
}