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