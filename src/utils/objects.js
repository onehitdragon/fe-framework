export function objectsDiff(oldObj = {}, newObj = {}){
    const diff = {
        added: [],
        removed: [],
        updated: []
    };
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);
    diff.removed = oldKeys.filter(oldKey => !(oldKey in newObj));
    for(const newKey of newKeys){
        if(!(newKey in oldObj)) diff.added.push(newKey);
        else if(oldObj[newKey] !== newObj[newKey]) diff.updated.push(newKey);
    }
    return diff;
}