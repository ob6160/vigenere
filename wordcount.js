const debug = false;

let text = "XUXZLMGBRJGBGTCTGHIQXNMVKIAMFDXUXGPSOEVKMFHWNVVFRPCVFGMVGTEAIBGTCXUBJFEFUVCRQXTGHRWLNSAMYCHETNGRTLYMYYWVTSYOVQCFMVKEGBTYPYRUPEJBEEWOTJCHBGJGQVERPMAYFPQNMZMRFAFSPQEFMONEZIIITIWMAZFLPLBEPITTIBXBJLYPVMPYRQFRLRRKFDIKXTSXVHENVRVFLGRBMCHVWVYWNUFSXGAVYTCXRPEAVVMJNGFZNRVKQLBNCBRBMSCEYEFUIQMFGRSELCRPXKFIPHLPWRHWRLRWIYAVGXCBPXGREFTXSEEWREEVGJRXRVYLMPTCCVEHIQXUXVLHEXJSPGFRWXBLFKIRQKCRGUVYHVLTMZRKPMVNKVTIYTKGSABWYHETNGRTEFMOFPIMRTBKGWYBBCPLMYYXFHDCTBBERSEEZLIUTJZIRGDGWGTBCRSHIYRBMYCVNGURLRORPMBNJQXRIJREXXEQLBNCBFRKVRVNVVBYAMZJXUXTYYFXFDXUXKPSHUCCMFYFSRQCLBKRFVLXORVWIFAFSPQUVRLRVFLXEHCJMAZWYGGHI".toLowerCase()

let keySize = 5;

let frequencyTables = init2d(keySize, Array);
let partialCipherTexts = init2d(keySize, String);
for(let i = 0; i < text.length; i++) {
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

for(let freqTable in frequencyTables) {
  let guesses = []; 
  frequencyTables[freqTable] = frequencyTables[freqTable].sort((a, b) => {
		if(b[1] < a[1]) {
			return -1;
		} else {
			return +1;
		}
	});
}

let freqTableDistFrequencies = [];
for(let i = 0; i < frequencyTables.length; i++) {
  let curTable = frequencyTables[i];
	let distanceFrequency = [];
  for(let j = 0; j < 11; j++) {
		let subArr = curTable[j];
		if(subArr === undefined) continue;
		let freqChar = subArr[0];
  	for(let k = 0; k < freqDist.length; k++) {
	    let distChar = freqDist[k];
		  let distance = charDist(freqChar, distChar);
			let finalChar = fromCode(distance);
      if(debug) {
			  console.log(
					"Table: ",
				  i,
				  "Freq Char: ", freqChar,
				  "Dist Char: ", distChar,
				  "Distance: ", ("000" + distance).slice(-4), " - ",
				  fromCode(distance)
				);
			}
			distanceFrequency[distance] = distanceFrequency[distance] || [finalChar, 0];
			distanceFrequency[distance][1]++;
	  }
		if(debug) console.log("\n")
	}
  distanceFrequency = distanceFrequency.sort((a,b) => {
	  return b[1] - a[1];
	});
	freqTableDistFrequencies.push(distanceFrequency);
	
}

let guess = '';
for(let table in freqTableDistFrequencies) {
	let selTable = freqTableDistFrequencies[table];
	if(selTable[0]) guess += selTable[0][0];
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
	for(let i = 0; i < len; i++) {
	  initial.push(new fillerProto);
	}
  return initial;
}

function attempt(crackKey) {
  let out = ''
	let cols = init2d(keySize, Array);
  for(let i = 0; i < text.length; i++) {
	  let tick = i % keySize;
	  let curChar = crackKey[tick].charCodeAt(0);
	  let curTxtChar = text[i].charCodeAt(0);
		let guessChar =  String.fromCharCode((curTxtChar - curChar + 26) % 26 + 'a'.charCodeAt(0));
	  out += guessChar;
	}
  console.log(crackKey + "    ", out)
}
