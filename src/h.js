import { fillterNullNodes, mapTextNodes } from "./utils/arrays.js";

export const DOM_TYPE = {
    TEXT: "text",
    ELEMENT: "element",
    FRAGMENT: "fragment"
}

// use to create virtual element node
export function hElement(tag, props = {}, children = []){
    return {
        type: DOM_TYPE.ELEMENT,
        tag,
        props,
        children: mapTextNodes(fillterNullNodes(children))
    };
}

//use to create virtual text node
export function hText(str){
    return {
        type: DOM_TYPE.TEXT,
        value: str
    };
}

// use to create virtual fragment node
export function hFragment(children = []){
    return {
        type: DOM_TYPE.FRAGMENT,
        children: mapTextNodes(fillterNullNodes(children))
    };
}
