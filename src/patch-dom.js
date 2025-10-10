import { patchClass, patchStyle, removeAttribute, setAttribute } from "./attributes.js";
import { destroyDOM } from "./destroy-dom.js";
import { patchEventListeners, removeEventListeners } from "./events.js";
import { DOM_TYPE } from "./h.js";
import { addPropsWithProps, mountDOMAt } from "./mount-dom.js";
import { areNodesEqual } from "./nodes-equal.js";
import { ARRAY_DIFF_OP, arraysDiffSequence } from "./utils/arrays.js";
import { objectsDiff } from "./utils/objects.js";

export function patchDOM(oldVdom, newVdom){
    if(areNodesEqual(oldVdom, newVdom)){
        const { type } = oldVdom;
        if(type == DOM_TYPE.TEXT) patchTextNode(oldVdom, newVdom);
        if(type == DOM_TYPE.FRAGMENT) patchFragmentNode(oldVdom, newVdom);
        if(type == DOM_TYPE.ELEMENT) patchElementNode(oldVdom, newVdom);
    }
    else{
        destroyDOM(oldVdom);
    }
}
function patchTextNode(oldNode, newNode){
    const el = oldNode.el;
    if(el.value != newNode.value){
        el.nodeValue = newNode.value;
    }
    newNode.el = el;
}
function patchFragmentNode(oldNode, newNode){
    const el = oldNode.el;
    patchChildren(oldNode.children, newNode.children, el);
    newNode.el = el;
}
function patchElementNode(oldNode, newNode){
    const el = oldNode.el;
    patchProps(oldNode, newNode, el);
    patchChildren(oldNode.children, newNode.children, el);
    newNode.el = el;
}
function patchChildren(oldChildren, newChildren, parentEl){
    const sequence = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);
    for(const op of sequence){
        if(op.type == ARRAY_DIFF_OP.REMOVE) removeChildElementAt(parentEl, op.index);
        if(op.type == ARRAY_DIFF_OP.ADD) mountDOMAt(op.item, parentEl, op.index);
        if(op.type == ARRAY_DIFF_OP.MOVE) moveChildElement(parentEl, op.from, op.to);
    }
}
function removeChildElementAt(parentEl, index){
    const child = parentEl.children[index];
    parentEl.removeChild(child);
}
function moveChildElement(parentEl, from, to){
    const fromChild = parentEl.children[from];
    const toChild = parentEl.children[to];
    parentEl.insertBefore(fromChild, toChild);
}
function patchProps(oldNode, newNode, elementNode){
    const { props: oldProps } = oldNode;
    const { props: newProps } = newNode;
    const diff = objectsDiff(oldProps, newProps);

    const addedProps = {};
    for(const key of diff.added){
        addedProps[key] = newProps[key];
    }
    addPropsWithProps(elementNode, newNode, addedProps);

    for(const key of diff.removed){
        if(key == "on") removeEventListeners(elementNode, oldNode.listeners);
        else removeAttribute(elementNode, key);
    }

    for(const key of diff.updated){
        if(key == "on"){
            const listeners = oldNode.listeners;
            patchEventListeners(elementNode, listeners, oldProps.on, newProps.on);
            newNode.listeners = listeners;
        }
        else if(key == "class") patchClass(elementNode, oldProps.class, newProps.class);
        else if(key == "style") patchStyle(elementNode, oldProps.style, newProps.style);
        else setAttribute(elementNode, key, newProps[key]);
    }
}
