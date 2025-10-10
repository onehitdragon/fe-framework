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
        added: newArray.filter(item => !oldArray.includes(item)),
        removed: oldArray.filter(item => !newArray.includes(item))
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
    let i = 0;
    while(i < newArray.length){
        if(i >= originalArray.length){
            sequence.push(createAddOp(newArray[i], i));
            originalArray.push(newArray[i]);
            i++;
            continue;
        }
        const isEqual = equalFunc(originalArray[i], newArray[i]);
        if(isEqual){
            sequence.push(createNoopOp(originalArray[i], newArray[i]));
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
            sequence.push(createMoveOp(
                newItemIndexInOldArray, i,
                originalArray[newItemIndexInOldArray], newArray[i]
            ));
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
    while(i < originalArray.length){
        sequence.push(createRemoveOp(i));
        originalArray.splice(i, 1);
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
function createMoveOp(from, to, oldItem, newItem){
    return {
        type: ARRAY_DIFF_OP.MOVE,
        from,
        to,
        oldItem,
        newItem
    }
}
function createNoopOp(oldItem, newItem){
    return {
        type: ARRAY_DIFF_OP.NOOP,
        oldItem,
        newItem
    }
}
