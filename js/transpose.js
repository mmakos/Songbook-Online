const upTranspositionDict = {
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
	'fisis': 'gis',
    'g': 'gis',
    'as': 'a',
    'gis': 'a',
    'a': 'b',
    'b': 'h',
    'ais': 'h',
    'h': 'c',
	'ces': 'c',
	'his': 'cis'
}

const downTranspositionDict = {
	'c': 'h',
	'his': 'h',
	'h': 'b',
	'ces': 'b',
	'b': 'a',
	'ais': 'a',
	'a': 'as',
	'as': 'g',
	'gis': 'g',
	'g': 'ges',
	'fisis': 'fis',
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

let current_transposition = 0;

function transpose(interval) {
	current_transposition += interval;
	const currentChords = document.getElementsByClassName("chord");
	for (const cc in currentChords) {
		const currentChordsHTML = currentChords[cc].innerHTML;
		if (currentChordsHTML === null || currentChordsHTML === undefined) continue;
		const chords = currentChordsHTML.split(/([ -@\[-`{-~])/gi);
		for (const c in chords) {
			const transpositionDict = interval > 0 ? upTranspositionDict : downTranspositionDict;
			if (chords[c].toLowerCase() in transpositionDict){
				const isDur = chords[c].length > 0 && /[A-H]/.test(chords[c].charAt(0));
				chords[c] = transpositionDict[chords[c].toLowerCase()];
				if (isDur) {
					chords[c] = chords[c].charAt(0).toUpperCase() + chords[c].slice(1);
				}
			}
        }
    	currentChords[cc].innerHTML = chords.join('')
    }
	const current_trans = document.getElementById("current-trans");
	let current_trans_string = '';
	if (current_transposition < 0) {
		current_trans_string = current_transposition;
	} else if (current_transposition > 0) {
		current_trans_string = "+" + current_transposition;
	}
	current_trans.innerHTML = current_trans_string;
}