// And, OR search, tokenisation
let idx = {};
let docs = ["hello hello hello at how cut are you", "hello im doing fine coot how about you", "yea cat cut ciiit im doing fine too bro"];
let prepWords = new Set(['to', 'the', 'on', 'of', 'at', 'in', 'through', 'under', 'over', 'by', 'from', 'about', 'too']);

// 2 ptr approach =>

function tokenize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0)
}

for (let i = 0; i < docs.length; i++) {
    let words = tokenize(docs[i]);
    for (const word of words) {
        if(prepWords.has(word)) continue;
        if (!idx[word]) {
            idx[word] = [];
        }
        if(( idx[word].length === 0 || idx[word][idx[word].length - 1] != i)){
            idx[word].push(i)
        }
    }
}

function searchAllWords(str){
    let words = tokenize(str).filter(w => !prepWords.has(w));
    if(words.length === 0) return [];
    for (let word of words) {
        if (!idx[word]) return [];
    }
    words.sort((a, b) => idx[a].length - idx[b].length);
    let arr = [...idx[words[0]]]; // direct assignment points to object array reference

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

function levenshtein(word1, word2) {
    let m = word1.length;
    let n = word2.length;

    let dp = Array.from(
        { length: n + 1 },
        () => Array(m + 1).fill(0)
    );
    // word2 -> empty string
    for (let i = 0; i <= n; i++) {
        dp[i][0] = i;
    }
    // empty string -> word1
    for (let i = 0; i <= m; i++) {
        dp[0][i] = i;
    }

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (word1[j - 1] === word2[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] =
                    Math.min(
                        dp[i - 1][j - 1],
                        dp[i - 1][j],
                        dp[i][j - 1]
                    ) + 1;
            }
        }
    }
    return dp[n][m];
}

function findSimilarTerms(word, maxDistance = 2) {

    let matches = [];

    for (let term of Object.keys(idx)) {
        let distance = levenshtein(word, term);
        if (distance <= maxDistance) {
            matches.push({
                term,
                distance
            });
        }
    }
    return matches;
}

// console.log(levenshtein("cat", "cat"));   // 0
// console.log(levenshtein("cat", "cut"));   // 1

console.log(findSimilarTerms("caat"));

console.log(findSimilarTerms("ciiit"));
console.log(findSimilarTerms("coot"));
console.log(findSimilarTerms("helo"));
console.log(findSimilarTerms("xyz"));