let idx = {};
let docs = ["hello hello hello how are you", "hello im doing fine how about you", "yea im doing fine too bro"];

// 2 ptr approach =>

for (let i = 0; i < docs.length; i++) {
    let words = tokenize(docs[i]);
    for (const word of words) {
        if (!idx[word]) {
            idx[word] = [];
        }
        if(idx[word].length === 0 || idx[word][idx[word].length - 1] != i){
            idx[word].push(i)
        }
    }
}

function searchWords(str){
    let words = tokenize(str);
    if(words.length === 0) return [];
    for (let word of words) {
        if (!idx[word]) return [];
    }
    words.sort((a, b) => idx[a].length - idx[b].length);
    let arr = idx[words[0]];

    for(let k = 1; k < words.length; k++){
        let i = 0, j = 0;
        const curr = idx[words[k]];
        let temp = [];
        while(i < arr.length && j < curr.length){
            if(arr[i] === curr[j]){
                temp.push(arr[i]);
                i++, j++;
            }else if(arr[i] < curr[j]){
                i++;
            }else{
                j++;
            }
        }
        arr = temp;
        if (arr.length === 0)
            return [];
    }
    return arr;
}
// console.log(idx)
console.log(searchWords("im fine"));

function tokenize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0);
}


// Set approach =>
// for (let i = 0; i < arr.length; i++) {
//     let words = arr[i].split(" ");

//     for (let word of words) {
//         if (!idx[word]) {
//             idx[word] = new Set();
//         }
//         idx[word].add(i);
//     }
// }
// function searchWord(word) {
//     return idx[word] || new Set();;
// }

// console.log(searchWord("x"));

// function searchWords(str) {
//     let words = [...new Set(str.split(" "))];
//     for (let word of words) {
//     if (!idx[word]) return new Set();
// }

//     let result = sortLists(words);

//     for (let i = 1; i < words.length; i++){
//         for(let key of result){
//             if(!idx[words[i]].has(key)){
//                 result.delete(key)
//             }
//         }
//         if (result.size === 0)
//         return new Set();
//     }
//     return result
// }

// console.log(searchWords("xyz"))

// function sortLists(words){
//     words.sort((a, b) => idx[a].size - idx[b].size);
//     return new Set(idx[words[0]])
// }