import { DOM_TYPE } from "./h.js";

export function areNodesEqual(nodeOne, nodeTwo){
    if(nodeOne.type != nodeTwo.type) return false;
    if(nodeOne.type == DOM_TYPE.ELEMENT) return nodeOne.tag == nodeTwo.tag;
    return true;
}