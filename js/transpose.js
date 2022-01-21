var upTranspositionDict = {
    'C': 'Cis',
    'Cis': 'D',
    'Des': 'D',
    'D': 'Dis',
    'Es': 'E',
    'Dis': 'E',
    'E': 'F',
    'Fes': 'F',
    'F': 'Fis',
    'Eis': 'Fis',
    'Fis': 'G',
    'Ges': 'G',
    'G': 'Gis',
    'As': 'A',
    'Gis': 'A',
    'A': 'B',
    'B': 'H',
    'Ais': 'H',
    'H': 'C',
    'Ces': 'C',
    'c': 'cis',
    'cis': 'd',
    'des': 'd',
    'd': 'dis',
    'es': 'e',
    'dis': 'e',
    'e': 'f',
    'fes': 'f',
    'f': 'fis',
    'eis': 'fis',
    'fis': 'g',
    'ges': 'g',
    'g': 'gis',
    'as': 'a',
    'gis': 'a',
    'a': 'b',
    'b': 'h',
    'ais': 'h',
    'h': 'c',
    'ces': 'c'
}

var downTranspositionDict = {
	'C': 'H',
	'H': 'B',
	'Ces': 'B',
	'B': 'A',
	'Ais': 'A',
	'A': 'As',
	'As': 'G',
	'Gis': 'G',
	'G': 'Ges',
	'Fis': 'F',
	'Ges': 'F',
	'F': 'E',
	'Eis': 'E',
	'E': 'Es',
	'Fes': 'Es',
	'Es': 'D',
	'Dis': 'D',
	'D': 'Des',
	'Des': 'C',
	'Cis': 'C',
	'c': 'h',
	'h': 'b',
	'ces': 'b',
	'b': 'a',
	'ais': 'a',
	'a': 'as',
	'as': 'g',
	'gis': 'g',
	'g': 'ges',
	'fis': 'f',
	'ges': 'f',
	'f': 'e',
	'eis': 'e',
	'e': 'es',
	'fes': 'es',
	'es': 'd',
	'dis': 'd',
	'd': 'des',
	'des': 'c',
	'cis': 'c'
}

var current_transposition = 0;

function transpose(interval) {
	current_transposition += interval;
    var currentChords = document.getElementsByClassName("chord");
    for (var cc in currentChords) {
		var currentChordsHTML = currentChords[cc].innerHTML
		if (currentChordsHTML === null) continue; 
    	var chords = currentChordsHTML.split(/([ -@\[-`{-~])/gi);
        for (var c in chords) {
			var transpositionDict = interval > 0 ? upTranspositionDict : downTranspositionDict;
			if (chords[c] in transpositionDict){
				chords[c] = transpositionDict[chords[c]];
			}
        }
        currentChords[cc].innerHTML = chords.join('')
    }
	var current_trans = document.getElementById("current-trans");
	var current_trans_string = '';
	if (current_transposition < 0) {
		current_trans_string = current_transposition;
	} else if (current_transposition > 0) {
		current_trans_string = "+" + current_transposition;
	}
	current_trans.innerHTML = current_trans_string;
}