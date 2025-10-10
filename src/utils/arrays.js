import { hText } from "../h.js";

export function fillterNullNodes(vNodes){
    return vNodes.filter(vNode => vNode != null);
}
export function mapTextNodes(vNodes){
    return vNodes.map((vNode) => {
        if(typeof vNode == "string"){
            return hText(vNode);
        }
        return vNode;
    });
}
export function arraysDiff(oldArray, newArray){
    return {
        added: newArray.filter(item => !oldArray.include(item)),
        removed: oldArray.filter(item => !newArray.include(item))
    }
}
export const ARRAY_DIFF_OP = {
    REMOVE: "remove",
    ADD: "add",
    MOVE: "move",
    NOOP: "noop"
}
export function arraysDiffSequence(oldArray, newArray, equalFunc){
    const originalArray = [...oldArray];
    const sequence = [];
    for(let i = 0; i < newArray.length && i < 100;){
        if(i >= originalArray.length){
            sequence.push(createAddOp(newArray[i], i));
            originalArray.push(newArray[i]);
            i++;
            continue;
        }
        const isEqual = equalFunc(originalArray[i], newArray[i]);
        if(isEqual){
            sequence.push(createNoopOp(i));
            i++;
            continue;
        }
        const oldItemIndexInNewArray = itemIndexInArray(originalArray[i], newArray, equalFunc, i + 1);
        if(oldItemIndexInNewArray == -1){
            sequence.push(createRemoveOp(i));
            originalArray.splice(i, 1);
            continue;
        }
        const newItemIndexInOldArray = itemIndexInArray(newArray[i], originalArray, equalFunc, i + 1);
        if(newItemIndexInOldArray != -1){
            sequence.push(createMoveOp(newItemIndexInOldArray, i));
            const deleted = originalArray.splice(newItemIndexInOldArray, 1);
            originalArray.splice(i, 0, ...deleted);
            i++;
            continue;
        }
        else{
            sequence.push(createAddOp(newArray[i], i));
            originalArray.splice(i, 0, newArray[i]);
            i++;
            continue;
        }
    }
    return sequence;
}
function itemIndexInArray(item, array, equalFunc, start){
    for(let i = start; i < array.length; i++){
        if(equalFunc(item, array[i])) return i;
    }
    return -1;
}
function createAddOp(item, index){
    return {
        type: ARRAY_DIFF_OP.ADD,
        item,
        index
    }
}
function createRemoveOp(index){
    return {
        type: ARRAY_DIFF_OP.REMOVE,
        index
    }
}
function createMoveOp(from, to){
    return {
        type: ARRAY_DIFF_OP.MOVE,
        from,
        to 
    }
}
function createNoopOp(index){
    return {
        type: ARRAY_DIFF_OP.NOOP,
        index
    }
}
