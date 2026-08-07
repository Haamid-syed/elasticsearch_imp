let idx = {};
let docs = ["hello hello hello how are you", "hello how im doing fine how about you fine are doing", "yea im doing fine too bro doing"];

function tokenize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0)
}

for (let i = 0; i < docs.length; i++) {
    let words = tokenize(docs[i]);
    for (let j = 0; j < words.length; j++) {
        if (!idx[words[j]]) {
            idx[words[j]] = new Map();
        }
        if(!idx[words[j]].has(i)) idx[words[j]].set(i, [])
        idx[words[j]].get(i).push(j)
    }
}
console.log(idx)

function searchPhrase(str){
    let docIds = searchAllWords(str)
    if(docIds.length === 0) return [];
    let words = tokenize(str);
    if(words.length === 1) return docIds;
    let results = []
    for(const id of docIds){
        // for each starting position of words[0] in doc `id`
        for (let startPos of idx[words[0]].get(id)) {
            let valid = true;
            for (let i = 1; i < words.length; i++) {
                const posSet = new Set(idx[words[i]].get(id));
                if (!posSet.has(startPos + i)) { valid = false; break; }
            }
            if (valid) {
                results.push(id);
                break; 
            }
        }
    }
    return results
}

function searchAllWords(str){
    let words = tokenize(str);
    if(words.length === 0) return [];
    for (let word of words) {
        if (!idx[word]) return [];
    }
    words.sort((a, b) => idx[a].size - idx[b].size);
    let arr = [...idx[words[0]].keys()];

    for(let k = 1; k < words.length; k++){
        let i = 0, j = 0;
        const currKeys = [...idx[words[k]].keys()];
        let temp = [];
        while(i < arr.length && j < currKeys.length){
            if(arr[i] === currKeys[j]){
                temp.push(arr[i]);
                i++; j++;
            }else if(arr[i] < currKeys[j]){
                i++;
            }else{
                j++;
            }
        }
        arr = temp;
        if (arr.length === 0) return [];
    }
    return arr;
}
console.log(searchPhrase("hello how are"))