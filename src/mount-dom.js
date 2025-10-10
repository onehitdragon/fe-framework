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
    vdom.el = elementNode;
    vdom.children.forEach(vchild => mountDOM(vchild, elementNode));
    parentEl.append(elementNode);
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
export function addPropsWithProps(elementNode, vdom, props){
    const { on: events, ...attrs } = props;
    vdom.listeners = addEventListeners(elementNode, events);
    setAttributes(elementNode, attrs);
}

export function mountDOMAt(vdom, parentEl, index){
    if(vdom.type == DOM_TYPE.TEXT){
        createTextNodeAt(vdom, parentEl, index);
    }
    else if(vdom.type == DOM_TYPE.ELEMENT){
        createElementNodeAt(vdom, parentEl, index);
    }
    else if(vdom.type == DOM_TYPE.FRAGMENT){
        createFragmentNodesAt(vdom, parentEl, index);
    }
    else{
        throw new Error(`Can't mount DOM of type: ${vdom.type} at ${index}`);
    }
}
function insertAt(parentEl, insertedNode, index){
    if(index >= parentEl.children.length){
        parentEl.append(insertedNode);
    }
    else{
        parentEl.insertBefore(insertedNode, parentEl.children[index]);
    }
}
function createTextNodeAt(vdom, parentEl, index){
    const textNode = document.createTextNode(vdom.value);
    vdom.el = textNode;
    insertAt(parentEl, textNode, index);
}
function createElementNodeAt(vdom, parentEl, index){
    const elementNode = document.createElement(vdom.tag);
    addProps(elementNode, vdom);
    vdom.el = elementNode;
    vdom.children.forEach(vchild => mountDOM(vchild, elementNode));
    insertAt(parentEl, elementNode, index);
}
function createFragmentNodesAt(vdom, parentEl, index){
    vdom.children.forEach(vchild => mountDOMAt(vchild, parentEl, index++));
    vdom.el = parentEl;
}
