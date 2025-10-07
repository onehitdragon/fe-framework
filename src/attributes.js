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
function setStyle(elementNode, styleName, value){
    elementNode.style[styleName] = value;
}
function removeStyle(elementNode, styleName){
    elementNode.style[styleName] = null;
}
function setAttribute(elementNode, attrName, value){
    if(value == null){
        removeAttribute(elementNode, attrName);
    }
    else if(attrName.startsWith('data-')){
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
