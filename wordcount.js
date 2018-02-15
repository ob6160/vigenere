var fs = require('fs');

const debug = 0;

//const text = "XUXZLMGBRJGBGTCTGHIQXNMVKIAMFDXUXGPSOEVKMFHWNVVFRPCVFGMVGTEAIBGTCXUBJFEFUVCRQXTGHRWLNSAMYCHETNGRTLYMYYWVTSYOVQCFMVKEGBTYPYRUPEJBEEWOTJCHBGJGQVERPMAYFPQNMZMRFAFSPQEFMONEZIIITIWMAZFLPLBEPITTIBXBJLYPVMPYRQFRLRRKFDIKXTSXVHENVRVFLGRBMCHVWVYWNUFSXGAVYTCXRPEAVVMJNGFZNRVKQLBNCBRBMSCEYEFUIQMFGRSELCRPXKFIPHLPWRHWRLRWIYAVGXCBPXGREFTXSEEWREEVGJRXRVYLMPTCCVEHIQXUXVLHEXJSPGFRWXBLFKIRQKCRGUVYHVLTMZRKPMVNKVTIYTKGSABWYHETNGRTEFMOFPIMRTBKGWYBBCPLMYYXFHDCTBBERSEEZLIUTJZIRGDGWGTBCRSHIYRBMYCVNGURLRORPMBNJQXRIJREXXEQLBNCBFRKVRVNVVBYAMZJXUXTYYFXFDXUXKPSHUCCMFYFSRQCLBKRFVLXORVWIFAFSPQUVRLRVFLXEHCJMAZWYGGHI".toLowerCase()

const text = "ETGURLXRGAJGMOMTGECGXANUJCCMXBTFKTHRNFZNAHQNVZABBWFKFLXMANUYCGXXUCKFTUIPCDCPVUHCZLIXHJKKFIAIJTZRXGKFQWYAUIEVZRGBXUGDGJLEAFGMGMENPUFXLMAVVPTLXVPTPNIXBIIYEACJCJGVGMGGUDDKQNPPWTTVFEIWEMSTTRNWRANUEMIAMAIDMGXXUCEYIHSYVYYIAIYRVBWBQUKJBXIPBORRXVABTBZJMEGVYCPZIBHKFXKXLPZLTOMTGECGXHREZBTWXUCKFTAEQCDYHLIQGEMJZLZQECNMSOGRZAXXBCSYCWSAJZQRTVRGIYCWGBPTCCMVNVVMCTPVHVMULXHFPGIPEFQEJNMLRPKFPMLRDVEPGVRUVYGVLVPKMPGIJEZNWXV".toLowerCase();

// Find all repeated patterns from length 3 up to length 5.
let patterns = {};
for (let repeatLength = 3; repeatLength < 6; repeatLength++) {
    for (let charIndex = 0; charIndex < text.length; charIndex++) {
        let characterIndex = text[charIndex];
        let pattern = text.substring(charIndex, charIndex + repeatLength);

        if (patterns[pattern] === undefined) {
            patterns[pattern] = {
                count: 0,
                distances: [],
                lastMatchPos: null
            };
        }

        patterns[pattern]['count'] = patterns[pattern]['count'] + 1
        if (patterns[pattern]['lastMatchPos']) {
            let distance = charIndex - patterns[pattern]['lastMatchPos'];
            patterns[pattern]['distances'].push(distance);
        }
        patterns[pattern]['lastMatchPos'] = charIndex;
    }
}

let patternEntries = Object.entries(patterns);
const filteredEntries = patternEntries.filter(entry => entry[1]['count'] > 1 && entry[0].length > 1);
let multipleFrequency = {};
filteredEntries.forEach(entry => {
    let distances = entry[1]['distances'];
    for (let i = 0; i < distances.length; i++) {
        let distance = distances[i];
        for (let j = 2; j <= 20; j++) {
            if (distance % j === 0) {
                multipleFrequency[j] = multipleFrequency[j] + 1 || 0;
            }
        }
    }
});

let last = 0;
const keyCandidates = Object.entries(multipleFrequency).sort((a, b) => {
    return b[1] - a[1] + b[1] * 2
});

const keySize = keyCandidates[0][0];
console.log(keyCandidates);

let frequencyTables = init2d(keySize, Array);
let partialCipherTexts = init2d(keySize, String);
for (let i = 0; i < text.length; i++) {
    let ticker = i % keySize;
    let currentChar = text[i]
    let curCode = (currentChar.charCodeAt(0) + 26) % 26 + 'a'.charCodeAt(0)
    let index = 'z'.charCodeAt(0) - curCode;
    frequencyTables[ticker][index] = frequencyTables[ticker][index] || [currentChar, 0]
    frequencyTables[ticker][index][1]++
        partialCipherTexts[ticker] += currentChar;
}

let freqDist = 'etaoinsrhld';
let freqTableGuesses = [];

for (let freqTable in frequencyTables) {
    let guesses = [];
    frequencyTables[freqTable] = frequencyTables[freqTable].sort((a, b) => {
        if (b[1] < a[1]) {
            return -1;
        } else {
            return +1;
        }
    });
}

let freqTableDistFrequencies = [];
for (let i = 0; i < frequencyTables.length; i++) {
    let curTable = frequencyTables[i];
    let distanceFrequency = [];
    for (let j = 0; j < 9; j++) {
        let subArr = curTable[j];
        if (subArr === undefined) continue;
        let freqChar = subArr[0];
        for (let k = 0; k < freqDist.length; k++) {
            let distChar = freqDist[k];
            let distance = charDist(freqChar, distChar);
            let finalChar = fromCode(distance);
            if (debug) {
                console.log(
                    "Table: ",
                    i,
                    "Freq Char: ", freqChar,
                    "Dist Char: ", distChar,
                    "Distance: ", ("000" + distance).slice(-4), " - ",
                    fromCode(distance)
                );
            }
            distanceFrequency[distance] = distanceFrequency[distance] || [finalChar, 0, distance];
            distanceFrequency[distance][1]++;
        }
        if (debug) console.log("\n")
    }
    distanceFrequency = distanceFrequency.sort((a, b) => {
        return b[1] - a[1];
    });
    freqTableDistFrequencies.push(distanceFrequency);

}

if(debug) console.log(freqTableDistFrequencies);

let guess = '';
for (let table in freqTableDistFrequencies) {
    let selTable = freqTableDistFrequencies[table];
    if (selTable[0]) guess += selTable[0][0];
}

attempt(guess);

function fromCode(code) {
    return String.fromCharCode(code);
}

function charDist(a, b) {
    let charCodeA = a.charCodeAt(0);
    let charCodeB = b.charCodeAt(0);

    return ((charCodeA - charCodeB) + 26) % 26 + 'a'.charCodeAt(0);
}

function init2d(len, fillerProto) {
    let initial = [];
    for (let i = 0; i < len; i++) {
        initial.push(new fillerProto);
    }
    return initial;
}

function attempt(crackKey) {
    let out = ''
    let cols = init2d(keySize, Array);
    for (let i = 0; i < text.length; i++) {
        let tick = i % keySize;
        let curChar = crackKey[tick].charCodeAt(0);
        let curTxtChar = text[i].charCodeAt(0);
        let guessChar = String.fromCharCode((curTxtChar - curChar + 26) % 26 + 'a'.charCodeAt(0));
        out += guessChar;
    }
    console.log(crackKey + "    ", out)
}
