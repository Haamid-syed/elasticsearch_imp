// TF / IDF and BM25

let idx = {};
// let docs = ["hello at how are you", "hello im doing fine hello how about you", "yea im doing fine too bro"];
let docs = [
    "the cat sat on the mat",
    "the dog barked at the the man",
    "cat chased cat the the dog"
];

let prepWords = new Set([
    'to', 'the', 'on', 'of', 'at', 'in',
    'through', 'under', 'over', 'by',
    'from', 'about', 'too'
]);

let docLengths = [];

const k1 = 1.2;
const b = 0.75;

function tokenize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0 && !prepWords.has(w));
}

for (let i = 0; i < docs.length; i++) {

    let words = tokenize(docs[i]);
    docLengths[i] = words.length;

    for (let j = 0; j < words.length; j++) {
        let word = words[j];
        if (!idx[word]) {
            idx[word] = new Map();
        }
        if (!idx[word].has(i)) {
            idx[word].set(i, []);
        }
        idx[word].get(i).push(j);
    }
}

// AVERAGE DOCUMENT LENGTH
let totalLength = 0;

for (let len of docLengths) {
    totalLength += len;
}

let avgdl = totalLength / docs.length;
// BM25 IDF
let idf = {};

for (let word in idx) {
    let df = idx[word].size;
    idf[word] = Math.log(
        1 + (docs.length - df + 0.5) / (df + 0.5)
    );
}

function searchAllWords(words) {

    if (words.length === 0) return [];
    for (let word of words) {
        if (!idx[word]) return [];
    }

    words.sort((a, b) => idx[a].size - idx[b].size);
    let arr = [...idx[words[0]].keys()];

    for (let k = 1; k < words.length; k++) {

        let i = 0;
        let j = 0;
        const currKeys = [...idx[words[k]].keys()];
        let temp = [];

        while (i < arr.length && j < currKeys.length) {
            if (arr[i] === currKeys[j]) {
                temp.push(arr[i]);
                i++;
                j++;
            } else if (arr[i] < currKeys[j]) {
                i++;
            } else {
                j++;
            }
        }
        arr = temp;
        if (arr.length === 0) return [];
    }
    return arr;
}
// BM25 RANKING
function rank(arr, words) {

    let rankings = [];

    for (let docId of arr) {

        let score = 0;
        let docLength = docLengths[docId];
        for (let word of words) {

            let termFrequency = idx[word]
                .get(docId)
                .length;

            let lengthNormalization =
                1 - b + b * (docLength / avgdl);

            let tfComponent = (termFrequency * (k1 + 1)) / (termFrequency + k1 * lengthNormalization);

            score += idf[word] * tfComponent;
        }

        rankings.push({
            docId,
            score
        });
    }

    rankings.sort((a, b) => b.score - a.score);

    return rankings;
}
// SEARCH
function searchRanked(str) {

    let words = tokenize(str);
    let candidates = searchAllWords(words);
    let rankedDocs = rank(candidates, words);
    return rankedDocs;
}

console.log(searchRanked("cat dog"));