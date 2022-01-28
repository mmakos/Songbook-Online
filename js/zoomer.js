// Annchor zawiera piosenkę, należy przeskalować song i zmienić wysokość anchor
const anchor = document.getElementById('song-outer');
const song = document.getElementById('song');
const maxHeight = anchor.clientHeight;
const maxWidth = anchor.clientWidth;

jQuery(document).ready(function($) {
    $('.zoom-song').click(function () {
        const lupe = $('.zoom-lupe');
        if (!lupe.hasClass("zoom-lupe-in")) {
            zoomOut();
            setLoopVlineStroke("inherit");
            lupe.addClass("zoom-lupe-in");
        } else {
            song.style.transform = 'scale(1)';
            anchor.style.height = maxHeight + "px";
            anchor.style.overflow = 'auto';
            setLoopVlineStroke("none");
            lupe.removeClass("zoom-lupe-in")
        }
    });
});



function zoomOut() {
    const scale = maxWidth / song.clientWidth;

    if (scale < 1) {
        song.style.transform = 'scale(' + scale + ')';
        anchor.style.height = maxHeight * scale + "px";
        anchor.style.overflow = 'hidden';
    }
}

function setLoopVlineStroke(attr) {
    const lines = document.getElementsByClassName('zoom-in-plus-vline');
    for (let line of lines) {
        line.setAttribute("stroke", attr);
    }
}