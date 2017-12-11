import operator

text = "XUXZLMGBRJGBGTCTGHIQXNMVKIAMFDXUXGPSOEVKMFHWNVVFRPCVFGMVGTEAIBGTCXUBJFEFUVCRQXTGHRWLNSAMYCHETNGRTLYMYYWVTSYOVQCFMVKEGBTYPYRUPEJBEEWOTJCHBGJGQVERPMAYFPQNMZMRFAFSPQEFMONEZIIITIWMAZFLPLBEPITTIBXBJLYPVMPYRQFRLRRKFDIKXTSXVHENVRVFLGRBMCHVWVYWNUFSXGAVYTCXRPEAVVMJNGFZNRVKQLBNCBRBMSCEYEFUIQMFGRSELCRPXKFIPHLPWRHWRLRWIYAVGXCBPXGREFTXSEEWREEVGJRXRVYLMPTCCVEHIQXUXVLHEXJSPGFRWXBLFKIRQKCRGUVYHVLTMZRKPMVNKVTIYTKGSABWYHETNGRTEFMOFPIMRTBKGWYBBCPLMYYXFHDCTBBERSEEZLIUTJZIRGDGWGTBCRSHIYRBMYCVNGURLRORPMBNJQXRIJREXXEQLBNCBFRKVRVNVVBYAMZJXUXTYYFXFDXUXKPSHUCCMFYFSRQCLBKRFVLXORVWIFAFSPQUVRLRVFLXEHCJMAZWYGGHI"
keyLength = 5
letterFrequency = "EARIOTNSLCUDPMHGBFYWKVXZJQ"
alphabeticalLetterFreq = [()]*26
for ltr in range(len(letterFrequency)):
    letter = letterFrequency[ltr]
    realPos = ord(letter) - ord('A')
    alphabeticalLetterFreq[realPos] = (ltr/(26*26), letter);

keyTally = [{}, {}, {}, {}, {}]

def calcDiff(tally):
    diff = 0;
    for i, entry in enumerate(tally):
        dist = abs(entry[1] - alphabeticalLetterFreq[i][0])
        diff += dist

    return diff

def rotate(l, n):
    return l[n:] + l[:n]

totals = [0]*5
for i in range(len(text)):
    keyChar = i % 5
    for j in range(26):
        charTest = chr(j + 65)
        keyTally[keyChar].setdefault(charTest, 0)
    # If this character hasn't been encountered yet default count to 0.
    # keyTally[keyChar].setdefault(text[i], 0)
    # Increment count by one.
    keyTally[keyChar][text[i]] += 1
    totals[keyChar] += 1

for i, tally in enumerate(keyTally):
    for j in range(26):
        charTest = chr(j + 65)
        keyTally[i][charTest] = tally[charTest] / totals[i]

for i, tally in enumerate(keyTally):
    tally = keyTally[i] = sorted(tally.items(), key=lambda x:x[0])
    
    minDist = (100000000000000, 'A')
    for j in range(26):
        tally = rotate(tally, 1)
        diff = calcDiff(tally)
        print(diff, chr(j+65))
        if(diff < minDist[0]):
            minDist = (diff, chr(j + 65))
    
    print(keyTally[i])
    print(minDist)
    print("\n")
#print(alphabeticalLetterFreq)

