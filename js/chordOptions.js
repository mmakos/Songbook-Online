let hideUncommonAddedIntervalFlag = false;
let augAndDimGuitarModeFlag = false;
let divideDelaysFlag = false;
let hideIncompleteChordsFlag = false;
let simplifyMultiplyFlag = false;
let simplifyAugToGuitarFlag = false;
let hideBaseFlag = false;
let hideAlternativeKeyFlag = false;
let hideKeyMarkFlag = false;

let originChords = [].slice.call(document.getElementsByClassName("chords")).map(function (el) {
    return el.innerHTML;
});

jQuery(document).ready(function ($) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let chordOptions = parseInt(params.flags);
    if (!isNaN(chordOptions)) {
        setPresetRadio(chordOptions);
        setChordOptions(chordOptions);
    } else {
        chordOptions = parseInt(getCookie("globalChordFlags"));
        if (!isNaN(chordOptions)) {
            setPresetRadio(chordOptions);
            setChordOptions(chordOptions);
        } else {
            setPresetRadio(0b0);
        }
    }
});

function updateGlobalFlags() {
    setCookie("globalChordFlags", getChordOptions(), 0, true);
}

function getChordOptions() {
    return hideUncommonAddedIntervalFlag |
        augAndDimGuitarModeFlag << 1 |
        divideDelaysFlag << 2 |
        hideIncompleteChordsFlag << 3 |
        simplifyMultiplyFlag << 4 |
        simplifyAugToGuitarFlag << 5 |
        hideBaseFlag << 6 |
        hideAlternativeKeyFlag << 7 |
        hideKeyMarkFlag << 8;
}

function setChordOptions(options) {
    hideUncommonAddedIntervalFlag = (options & 1) > 0;
    augAndDimGuitarModeFlag = (options & (1 << 1)) > 0;
    divideDelaysFlag = (options & (1 << 2)) > 0;
    hideIncompleteChordsFlag = (options & (1 << 3)) > 0;
    simplifyMultiplyFlag = (options & (1 << 4)) > 0;
    simplifyAugToGuitarFlag = (options & (1 << 5)) > 0;
    hideBaseFlag = (options & (1 << 6)) > 0;
    hideAlternativeKeyFlag = (options & (1 << 7)) > 0;
    hideKeyMarkFlag = (options & (1 << 8)) > 0;

    document.getElementById('hide-uncommon-added-interval').checked = hideUncommonAddedIntervalFlag;
    document.getElementById('aug-and-dim-guitar-mode').checked = augAndDimGuitarModeFlag;
    document.getElementById('divide-delays').checked = divideDelaysFlag;
    document.getElementById('hide-incomplete-chords').checked = hideIncompleteChordsFlag;
    document.getElementById('simplify-multiply').checked = simplifyMultiplyFlag;
    document.getElementById('simplify-aug-to-guitar').checked = simplifyAugToGuitarFlag;
    document.getElementById('hide-base').checked = hideBaseFlag;
    document.getElementById('hide-alternative-key-flag').checked = hideAlternativeKeyFlag;
    document.getElementById('hide-key-mark-flag').checked = hideKeyMarkFlag;

    processAllOptions();
}

function resetChords() {
    const chords = document.getElementsByClassName("chords");
    for (let i = 0; i < chords.length; i++) {
        chords[i].innerHTML = originChords[i];
    }
    const temp_transposition = current_transposition;
    current_transposition = 0;
    transpose(temp_transposition);
}

function processAllOptions() {
    if (hideUncommonAddedIntervalFlag) {
        hideUncommonAddedInterval();
    }
    if (augAndDimGuitarModeFlag) {
        augAndDimGuitarMode();
    }
    if (divideDelaysFlag) {
        divideDelays();
    }
    if (hideIncompleteChordsFlag) {
        hideIncompleteChords();
    }
    if (simplifyMultiplyFlag) {
        simplifyMultiply();
    }
    if (simplifyAugToGuitarFlag) {
        simplifyAugToGuitar();
    }
    if (hideBaseFlag) {
        hideBase();
    }
    if (hideAlternativeKeyFlag) {
        hideAlternativeKey();
    }
    if (hideKeyMarkFlag) {
        hideKeyMark();
    }
}

function showChordOptions() {
    const optionsDiv = document.getElementById("chord-options");
    const optionsButton = document.getElementById("chord-options-button");
    if (optionsDiv.style.display === "none") {
        $("#chord-options").slideDown();
        optionsButton.innerHTML = "Mniej";
    } else {
        $("#chord-options").slideUp();
        optionsButton.innerHTML = "Więcej";
    }
}

function hideUncommonAddedInterval() {
    hideUncommonAddedIntervalFlag = document.getElementById('hide-uncommon-added-interval').checked;

    const chords = document.getElementsByClassName("chords");
    if (hideUncommonAddedIntervalFlag) {
        for (const chord of chords) {
            for (const sup of chord.getElementsByTagName('sup')) {
                const bs = sup.getElementsByTagName('b');
                for (const b in bs) {
                    if (bs[b].innerText) {
                        bs[b].innerText = bs[b].innerText.split(" ").filter(function (el) {
                            return !el.match(/9|9>|2>|7<|6>|4</);
                        }).join(" ");
                    }
                }
            }
        }
    } else {
        resetChords();
        processAllOptions();
    }
}

function augAndDimGuitarMode() {
    augAndDimGuitarModeFlag = document.getElementById('aug-and-dim-guitar-mode').checked;

    for (const chord of document.getElementsByClassName("chords")) {
        for (const sup of chord.getElementsByTagName('sup')) {
            if (augAndDimGuitarModeFlag) {
                sup.innerHTML = sup.innerHTML.replace(/&gt;/g, "-");
                sup.innerHTML = sup.innerHTML.replace(/&lt;/g, "+");
            } else {
                sup.innerHTML = sup.innerHTML.replace(/-(?![0-9])/g, "&gt;");
                sup.innerHTML = sup.innerHTML.replace(/\+/g, "&lt;");
            }
        }
    }
}

function divideDelays() {
    divideDelaysFlag = document.getElementById('divide-delays').checked;


    if (divideDelaysFlag) {
        for (const chord of document.getElementsByClassName("chords")) {
            for (const sup of chord.getElementsByTagName('sup')) {
                for (const b of sup.getElementsByTagName('b')) {
                    b.innerHTML = b.innerHTML.replace(/-[0-9][^)]*/g, "");
                }
            }
        }
    } else {
        resetChords();
        processAllOptions();
    }
}

function hideIncompleteChords() {
    hideIncompleteChordsFlag = document.getElementById('hide-incomplete-chords').checked;

    for (const chord of document.getElementsByClassName("chords")) {
        for (const sup of chord.getElementsByTagName('sup')) {
            if (sup.innerText === "1" || sup.innerText === "5") {
                if (hideIncompleteChordsFlag) {
                    sup.style.display = "none";
                } else {
                    sup.style.display = null;
                }
            }
        }
    }
}

function simplifyMultiply() {
    simplifyMultiplyFlag = document.getElementById('simplify-multiply').checked;

    if (simplifyMultiplyFlag) {
        for (const chord of document.getElementsByClassName("chords")) {
            for (const sup of chord.getElementsByTagName('sup')) {
                const b = sup.getElementsByTagName('b');
                const splitHTML = b[b.length - 1].innerHTML.split(/( |(?<=[0-9](?=[0-9])))/);
                b[b.length - 1].innerHTML = splitHTML[splitHTML.length - 1];
                sup.innerHTML = b[b.length - 1].outerHTML;
            }
        }
    } else {
        resetChords();
        processAllOptions();
    }
}

function simplifyAugToGuitar() {
    simplifyAugToGuitarFlag = document.getElementById('simplify-aug-to-guitar').checked;

    const chords = document.getElementsByClassName("chords");
    if (simplifyAugToGuitarFlag) {
        for (const chord of chords) {
            let html = chord.innerHTML;
            html = html.replace(/(?<=[a-zA-Z])&lt;/g, "");
            html = html.replace(/(?<=[a-zA-Z])&gt;/g, "<sup>0</sup>");
            html = html.replace(/(?<=[a-zA-Z])\*/g, "");
            chord.innerHTML = html;
        }
    } else {
        resetChords();
        processAllOptions();
    }
}

function hideBase() {
    hideBaseFlag = document.getElementById('hide-base').checked;

    for (const chord of document.getElementsByClassName("chords")) {
        for (const sub of chord.getElementsByTagName('sub')) {
            if (sub.getElementsByTagName('s').length <= 0) {
                if (hideBaseFlag) {
                    sub.style.display = "none";
                } else {
                    sub.style.display = null;
                }
            }
        }
    }
}

function hideAlternativeKey() {
    hideAlternativeKeyFlag = document.getElementById('hide-alternative-key-flag').checked;

    const chordColumns = document.getElementsByClassName("chords");

    if (chordColumns.length > 1) {
        const columnSpansCount = [].slice.call(chordColumns)
            .map(function (column) {
                return [].slice.call(column.getElementsByTagName("span"))
                    .filter(function (span) {
                        console.log(span.innerText);
                        return span.innerText.trim().length > 0;
                    }).length;
            });
        console.log(columnSpansCount);

        for (let i = 1; i < columnSpansCount.length; i++) {
            if (columnSpansCount[i] > 0.9 * columnSpansCount[0]) {
                if (hideAlternativeKeyFlag) {
                    chordColumns[i].style.display = "none";
                } else {
                    chordColumns[i].style.display = null;
                }
            }
        }
    }
}

function hideKeyMark() {
    hideKeyMarkFlag = document.getElementById('hide-key-mark-flag').checked;

    for (const chord of document.getElementsByClassName("chords")) {
        const first_span = chord.getElementsByTagName("span")[0];
        for (const b of first_span.getElementsByTagName("b")) {
            if (b.className !== "chord") {
                if (hideKeyMarkFlag) {
                    b.style.display = "none"
                } else {
                    b.style.display = null;
                }
            }
        }
    }
}

function presetBeginner() {
    resetChords();
    setChordOptions(0b111111111);
}

function presetIntermediate() {
    resetChords();
    setChordOptions(0b111100010);
}

function presetAdvanced() {
    resetChords();
    setChordOptions(0b0);
}

function setPresetRadio(options) {
    if (options === 0b111111111) {
        document.getElementById('preset-beginner').checked = true;
    }
    else if (options === 0b111100010) {
        document.getElementById('preset-intermediate').checked = true;
    }
    else if (options === 0b0) {
        document.getElementById('preset-advanced').checked = true;
    }
}