let text = "XUXZLMGBRJGBGTCTGHIQXNMVKIAMFDXUXGPSOEVKMFHWNVVFRPCVFGMVGTEAIBGTCXUBJFEFUVCRQXTGHRWLNSAMYCHETNGRTLYMYYWVTSYOVQCFMVKEGBTYPYRUPEJBEEWOTJCHBGJGQVERPMAYFPQNMZMRFAFSPQEFMONEZIIITIWMAZFLPLBEPITTIBXBJLYPVMPYRQFRLRRKFDIKXTSXVHENVRVFLGRBMCHVWVYWNUFSXGAVYTCXRPEAVVMJNGFZNRVKQLBNCBRBMSCEYEFUIQMFGRSELCRPXKFIPHLPWRHWRLRWIYAVGXCBPXGREFTXSEEWREEVGJRXRVYLMPTCCVEHIQXUXVLHEXJSPGFRWXBLFKIRQKCRGUVYHVLTMZRKPMVNKVTIYTKGSABWYHETNGRTEFMOFPIMRTBKGWYBBCPLMYYXFHDCTBBERSEEZLIUTJZIRGDGWGTBCRSHIYRBMYCVNGURLRORPMBNJQXRIJREXXEQLBNCBFRKVRVNVVBYAMZJXUXTYYFXFDXUXKPSHUCCMFYFSRQCLBKRFVLXORVWIFAFSPQUVRLRVFLXEHCJMAZWYGGHI".toLowerCase()

let keySize = 5;

let frequencyTables = [[],[],[],[],[]];
let partialCipherTexts = ["","","","",""];
for(let i = 0; i < text.length; i++) {
	let ticker = i % 5;
	let currentChar = text[i]
	let curCode = (currentChar.charCodeAt(0) + 26) % 26 + 'a'.charCodeAt(0)
	let index = 'z'.charCodeAt(0) - curCode;
	frequencyTables[ticker][index] = frequencyTables[ticker][index] || [currentChar, 0]
	frequencyTables[ticker][index][1]++
	partialCipherTexts[ticker] += currentChar;
}

let freqDist = 'etaio'
let freqTableGuesses = [];
let guess = '';

for(let freqTable in frequencyTables) {
  let guesses = []; 
  frequencyTables[freqTable] = frequencyTables[freqTable].sort(function (a, b) {
		if(b[1] < a[1]) {
			return -1;
		} else {
			return +1;
		}
	});
}


for(let i = 0; i < frequencyTables.length; i++) {
  let curTable = frequencyTables[i];
  for(let j = 0; j < curTable.length; j++) {
		let subArr = curTable[j];
		if(subArr === undefined) continue;
		let freqChar = subArr[0];
  	for(let k = 0; k < freqDist.length; k++) {
	    let distChar = freqDist[k];
		  let distance = charDist(freqChar, distChar);
      console.log("Table: ", i, "Freq Char: ", freqChar, "Dist Char: ", distChar, " - ", fromCode(distance));
	  }
		console.log("\n")
	}
}

function fromCode(code) {
  return String.fromCharCode(code);
}

function charDist(a, b) {
  let charCodeA = a.charCodeAt(0);
	let charCodeB = b.charCodeAt(0);

	return ((charCodeA - charCodeB) + 26) % 26 + 'a'.charCodeAt(0);
}

function attempt(crackKey) {
  let out = ''
	let cols = [[],[],[],[],[]]
  for(let i = 0; i < text.length; i++) {
	  let tick = i % 5;
	  let curChar = crackKey[tick].charCodeAt(0);
	  let curTxtChar = text[i].charCodeAt(0);
		let guessChar =  String.fromCharCode((curTxtChar - curChar + 26) % 26 + 'a'.charCodeAt(0));
		cols[tick].push(guessChar);
	  out += guessChar;
	}
//	console.log(cols);
  console.log(crackKey + "    ", out)
  console.log("\n")
}
