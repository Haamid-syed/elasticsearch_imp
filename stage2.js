// TF / IDF

let idx = {};
let docs = ["hello at how are you", "hello im doing fine hello how about you", "yea im doing fine too bro"];
let prepWords = new Set(['to', 'the', 'on', 'of', 'at', 'in', 'through', 'under', 'over', 'by', 'from', 'about', 'too']);
let docLengths = [];

function tokenize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0 && !prepWords.has(w))
}

for (let i = 0; i < docs.length; i++) {
    let words = tokenize(docs[i]);
    docLengths[i] = words.length
    for (let j = 0; j < words.length; j++) {
        if (!idx[words[j]]) {
            idx[words[j]] = new Map();
        }
        if(!idx[words[j]].has(i)) idx[words[j]].set(i, [])
        idx[words[j]].get(i).push(j)
    }
}

function searchAllWords(words){
    if(words.length === 0) return [];
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

function rank(arr, words){
    if(arr.length === 1) return [{docId: arr[0], sum: 1}];

    let rankings = [];

    for(let docId of arr){
        let sum = 0;
        for(let word of words){
            sum += (idx[word].get(docId).length) / docLengths[docId]
        }
        rankings.push({sum, docId})
    }

    rankings.sort((a, b) => b.sum - a.sum)
    return rankings
}

function searchRanked(str) {
    let words = tokenize(str);
    let candidates = searchAllWords(words); // pass words array in
    let rankedDocs = rank(candidates, words);
    return rankedDocs.map((elem) => elem.docId);
}

console.log(searchRanked("hello"))