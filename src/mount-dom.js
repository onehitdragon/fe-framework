import { setAttributes } from "./attributes.js";
import { addEventListeners } from "./events.js";
import { DOM_TYPE } from "./h.js";

export function mountDOM(vdom, parentEl){
    if(vdom.type == DOM_TYPE.TEXT){
        createTextNode(vdom, parentEl);
    }
    else if(vdom.type == DOM_TYPE.ELEMENT){
        createElementNode(vdom, parentEl);
    }
    else if(vdom.type == DOM_TYPE.FRAGMENT){
        createFragmentNodes(vdom, parentEl);
    }
    else{
        throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
}

function createTextNode(vdom, parentEl){
    const textNode = document.createTextNode(vdom.value);
    vdom.el = textNode;
    parentEl.append(textNode);
}
function createElementNode(vdom, parentEl){
    const elementNode = document.createElement(vdom.tag);
    addProps(elementNode, vdom);
    parentEl.append(elementNode);
    vdom.el = elementNode;
    vdom.children.forEach(vchild => mountDOM(vchild, elementNode));
}
function createFragmentNodes(vdom, parentEl){
    vdom.children.forEach(vchild => mountDOM(vchild, parentEl));
    vdom.el = parentEl;
}

function addProps(elementNode, vdom){
    const { props } = vdom;
    const { on: events, ...attrs } = props;
    vdom.listeners = addEventListeners(elementNode, events);
    setAttributes(elementNode, attrs);
}
