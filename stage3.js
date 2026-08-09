// Levenshtein Distance
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

        if (prepWords.has(word)) continue;

        if (!idx[word]) {
            idx[word] = new Map();
        }

        if (!idx[word].has(i)) {
            idx[word].set(i, 0);
        }

        idx[word].set(
            i,
            idx[word].get(i) + 1
        );
    }
}

function searchAllWords(str){
    let words = tokenize(str).filter(w => !prepWords.has(w));
    if(words.length === 0) return [];
    for (let word of words) {
        if (!idx[word]) return [];
    }
    words.sort((a, b) => idx[a].size - idx[b].size);
    let arr = [...idx[words[0]].keys()];

    for (let k = 1; k < words.length; k++) {

        let i = 0;
        let j = 0;

        const curr = [...idx[words[k]].keys()];

        let temp = [];

        while (i < arr.length && j < curr.length) {

            if (arr[i] === curr[j]) {

                temp.push(arr[i]);

                i++;
                j++;

            } else if (arr[i] < curr[j]) {

                i++;

            } else {

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
    console.log(matches)
    return matches;
}


function searchFuzzyWords(str) {
    let words = tokenize(str)
        .filter(w => !prepWords.has(w));

    if (words.length === 0) {
        return new Map();
    }
    let candidateDocs = [];
    for (let word of words) {

        let similarTerms =
            findSimilarTerms(word);
        let docsForWord = new Map();

        for (let obj of similarTerms) {
            let term = obj.term;
            let distance = obj.distance;

            for (let docId of idx[term].keys()) {
                if (!docsForWord.has(docId)) {
                    docsForWord.set(docId, []);
                }
                docsForWord
                    .get(docId)
                    .push({
                        term,
                        distance
                    });
            }
        }
        if (docsForWord.size === 0) {
            return new Map();
        }
        candidateDocs.push(docsForWord);
    }

    candidateDocs.sort(
        (a, b) => a.size - b.size
    );

    let result = candidateDocs[0];

    for (let k = 1; k < candidateDocs.length; k++) {

        let curr = candidateDocs[k];
        let temp = new Map();
        for (let [docId, matches] of result) {
            if (curr.has(docId)) {
                temp.set(
                    docId,
                    [
                        ...matches,
                        ...curr.get(docId)
                    ]
                );
            }
        }
        result = temp;
        if (result.size === 0) {
            return new Map();
        }
    }
    return result;
}

console.log("INDEX:");
console.log(idx);

// console.log("\nEXACT SEARCH:");
// console.log(searchAllWords("hello cut"));

// console.log("\nFUZZY TERM:");
// console.log(findSimilarTerms("caat"));

console.log("\nFUZZY SEARCH:");
console.log(searchFuzzyWords("caat hello"))

console.log(searchFuzzyWords("caat hello"))

// console.log(levenshtein("cat", "cat"));   // 0
// console.log(levenshtein("cat", "cut"));   // 1

// console.log(findSimilarTerms("caat"));
// console.log(findSimilarTerms("ciiit"));
// console.log(findSimilarTerms("coot"));
// console.log(findSimilarTerms("helo"));
// console.log(findSimilarTerms("xyz"));

// console.log(idx)