import { arraysDiff } from "./utils/arrays.js";
import { objectsDiff } from "./utils/objects.js";

export function setAttributes(elementNode, attrs){
    const { class: className, style, ...otherAttrs } = attrs;
    if(className) setClass(elementNode, className);
    if(style){
        Object.entries(style).forEach(([styleName, value]) => {
            setStyle(elementNode, styleName, value);
        });
    }
    Object.entries(otherAttrs).forEach(([attrName, value]) => {
        setAttribute(elementNode, attrName, value);
    });
}
// className is string or array of strings
function setClass(elementNode, className){
    elementNode.className = "";
    if(typeof className == "string"){
        elementNode.className = className;
    }
    if(Array.isArray(className)){
        elementNode.classList.add(...className);
    }
}
export function patchClass(elementNode, oldClassName, newClassName){
    if(typeof oldClassName != typeof newClassName) setClass(elementNode, newClassName);
    else if(typeof newClassName == "string") elementNode.className = newClassName;
    else {
        const diff = arraysDiff(oldClassName, newClassName);
        elementNode.classList.add(...diff.added);
        elementNode.classList.remove(...diff.removed);
    }
}
function setStyle(elementNode, styleName, value){
    elementNode.style[styleName] = value;
}
function removeStyle(elementNode, styleName){
    elementNode.style[styleName] = null;
}
export function patchStyle(elementNode, oldStyle, newStyle){
    const diff = objectsDiff(oldStyle, newStyle);
    for(const styleName of diff.added) setStyle(elementNode, styleName, newStyle[styleName]);
    for(const styleName of diff.removed) removeStyle(elementNode, styleName);
    for(const styleName of diff.updated) setStyle(elementNode, styleName, newStyle[styleName]);
}
export function setAttribute(elementNode, attrName, value){
    if(value == null){
        removeAttribute(elementNode, attrName);
    }
    else if(attrName.startsWith('data-')){
        elementNode.setAttribute(attrName, value);
    }
    else if(attrName == "for"){
        elementNode.setAttribute(attrName, value);
    }
    else{
        elementNode[attrName] = value;
    }
}
export function removeAttribute(elementNode, attrName) {
    elementNode[attrName] = null
    elementNode.removeAttribute(attrName);
}
