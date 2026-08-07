let idx = {};
let arr = ["hello how are you", "hello im doing fine how about you", "yea im doing fine too bro"];

for (let i = 0; i < arr.length; i++) {
    let words = arr[i].split(" ");

    for (let word of words) {
        if (!idx[word]) {
            idx[word] = new Set();
        }
        idx[word].add(i);
    }
}

function searchWord(word) {
    return idx[word] || new Set();;
}

console.log(searchWord("x"));

function searchWords(str) {
    let words = [...new Set(str.split(" "))];
    for (let word of words) {
    if (!idx[word]) return new Set();
}

    let result = sortLists(words);

    for (let i = 1; i < words.length; i++){
        for(let key of result){
            if(!idx[words[i]].has(key)){
                result.delete(key)
            }
        }
        if (result.size === 0)
        return new Set();
    }
    return result
}

console.log(searchWords("xyz"))

function sortLists(words){
    words.sort((a, b) => idx[a].size - idx[b].size);
    return new Set(idx[words[0]])
}