let obj = {};
let arr = ["hello how are you", "hello im doing fine how about you", "yea im doing fine too bro"];

for (let i = 0; i < arr.length; i++) {
    let words = arr[i].split(" ");

    for (let word of words) {
        if (!obj[word]) {
            obj[word] = new Set();
        }
        obj[word].add(i);
    }
}

// Convert Sets to arrays

// for (let key in obj) {
//     obj[key] = [...obj[key]];
// }

function searchWord(word) {
    let docs = obj[word] || new Set();
    return [...docs].map(index => arr[index]);
}

// console.log(searchWord("im"));

function searchWords(str) {
    let words = str.split(" ");
    let result = !obj[words[0]] ? new Set : new Set(obj[words[0]]);
    for (let word of words){
        if(!obj[word]) return new Set;
        for(let key of result){
            if(!obj[word].has(key)){
                result.delete(key)
            }
        }
    }
    return result
}

console.log(searchWords("fine hello"))