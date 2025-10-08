function addEventListener(elementNode, eventName, eventHandler){
    elementNode.addEventListener(eventName, eventHandler);
    return eventHandler;
}
export function addEventListeners(elementNode, events = {}){
    const added = {};
    Object.entries(events).forEach(([eventName, eventHandler]) => {
        added[eventName] = addEventListener(elementNode, eventName, eventHandler);
    });
    return added;
}

function removeEventListener(elementNode, eventName, eventHandler){
    elementNode.removeEventListener(eventName, eventHandler);
}
export function removeEventListeners(elementNode, listeners = {}){
    Object.entries(listeners).forEach(([eventName, eventHandler]) => {
        removeEventListener(elementNode, eventName, eventHandler)
    });
}
