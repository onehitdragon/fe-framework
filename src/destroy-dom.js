import { removeEventListeners } from "./events.js";
import { DOM_TYPE } from "./h.js";

export function destroyDOM(vdom){
    if(vdom.type == DOM_TYPE.TEXT){
        removeTextNode(vdom);
    }
    else if(vdom.type == DOM_TYPE.ELEMENT){
        removeElementNode(vdom);
    }
    else if(vdom.type == DOM_TYPE.FRAGMENT){
        removeFragmentNodes(vdom);
    }
    else{
        throw new Error(`Can't destroy DOM of type: ${vdom.type}`);
    }
}

function removeTextNode(vdom){
    vdom.el.remove();
}
function removeElementNode(vdom){
    vdom.el.remove();
    vdom.children.forEach(vchild => destroyDOM(vchild));
    removeEventListeners(vdom.el, vdom.listeners);
    delete vdom.listeners;
}
function removeFragmentNodes(vdom){
    vdom.children.forEach(vchild => destroyDOM(vchild));
}
