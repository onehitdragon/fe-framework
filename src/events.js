import { objectsDiff } from "./utils/objects.js";

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

export function patchEventListeners(elementNode, listeners, oldEvents, newEvents){
    const diff = objectsDiff(oldEvents, newEvents);
    for(const eventName of diff.added){
        listeners[eventName] = addEventListener(elementNode, eventName, newEvents[eventName]);
    }
    for(const eventName of diff.removed){
        removeEventListener(elementNode, eventName, listeners[eventName]);
        delete listeners[eventName];
    }
    for(const eventName of diff.updated){
        removeEventListener(elementNode, eventName, listeners[eventName]);
        listeners[eventName] = addEventListener(elementNode, eventName, newEvents[eventName]);
    }
}
