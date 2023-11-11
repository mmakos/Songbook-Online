textSizeChanged();

function hideAuthor() {
    const hide = !document.getElementById('show-author').checked;
    document.getElementById('author').style.display = hide ? "none" : null;
}

function setPaddingRight() {
    const paddingRight = document.getElementById('tab-stops-offset').value;
    for (const span of document.getElementById('song').getElementsByTagName('td')) {
        span.style.paddingRight = paddingRight + "cm";
    }
}

function setFontFamily() {
    const familySelect = document.getElementById('font-family');
    const family = familySelect.options[familySelect.selectedIndex].style.fontFamily;
    familySelect.style.fontFamily = family;
    for (const span of document.getElementById('song').getElementsByTagName('span')) {
        span.style.fontFamily = family;
    }
}

function textSizeChanged() {
    const size = document.getElementById('font-size').value * 0.42 / 12;
    for (const span of document.getElementById('song').getElementsByTagName('span')) {
        span.style.fontSize = size + "cm";
    }
}

function textStyleBold() {
    const bold = document.getElementById('text-style-bold').checked;
    document.getElementById('song-text').style.fontWeight = bold ? "bold" : "normal";
}

function textStyleItalic() {
    const italic = document.getElementById('text-style-italic').checked;
    document.getElementById('song-text').style.fontStyle = italic ? "italic" : "normal";
}

function chordStyleBold() {
    const bold = document.getElementById('chord-style-bold').checked;
    for (const b of document.getElementsByClassName("chord")) {
        b.style.fontWeight = bold ? "bold" : "normal";
    }
}

function chordStyleItalic() {
    const italic = document.getElementById('chord-style-italic').checked;
    for (const b of document.getElementsByClassName("chord")) {
        b.style.fontStyle = italic ? "italic" : "normal";
    }
}

function repetitionStyleBold() {
    const bold = document.getElementById('repetition-style-bold').checked;
    document.getElementById('repetition').style.fontWeight = bold ? "bold" : "normal";
}

function repetitionStyleItalic() {
    const italic = document.getElementById('repetition-style-italic').checked;
    document.getElementById('repetition').style.fontStyle = italic ? "italic" : "normal";
}

function tonationStyleBold() {
    const bold = document.getElementById('tonation-style-bold').checked;
    for (const b of document.getElementById('tonation').getElementsByTagName("b")) {
        b.style.fontWeight = bold ? "bold" : "normal";
    }
}

function tonationStyleItalic() {
    const italic = document.getElementById('tonation-style-italic').checked;
    for (const b of document.getElementById('tonation').getElementsByTagName("b")) {
        b.style.fontStyle = italic ? "italic" : "normal";
    }
}
