// Global vars to cache event state
const evCache = [];
let prevDiff = -1;

const el = document.getElementById("song");
el.onpointerdown = pointerdown_handler;
el.onpointermove = pointermove_handler;

// Use same handler for pointer{up,cancel,out,leave} events since
// the semantics for these events - in this app - are the same.
el.onpointerup = pointerup_handler;
el.onpointercancel = pointerup_handler;
el.onpointerout = pointerup_handler;
el.onpointerleave = pointerup_handler;

function pointerdown_handler(ev) {
    evCache.push(ev);
}

function pointermove_handler(ev) {
    for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId === evCache[i].pointerId) {
            evCache[i] = ev;
            break;
        }
    }

    if (evCache.length === 2) {
        const curDiff = Math.hypot(evCache[0].clientX - evCache[1].clientX, evCache[0].clientY - evCache[1].clientY);

        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                log("Pinch moving OUT -> Zoom in", ev);
                zX += 0.1;
                el.style.transform = 'scale(' + zX + ')';
            }
            if (curDiff < prevDiff) {
                zX -= 0.1;
                log("Pinch moving IN -> Zoom out",ev);
                el.style.transform = 'scale(' + zX + ')';
            }
        }
        prevDiff = curDiff;
    }
}

function pointerup_handler(ev) {
    remove_event(ev);

    if (evCache.length < 2) {
        prevDiff = -1;
    }
}

function remove_event(ev) {
    for (let i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId === ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}

function log(prefix, ev) {
    const o = document.getElementById('song');
    const s = prefix + ": pointerID = " + ev.pointerId +
        " ; pointerType = " + ev.pointerType +
        " ; isPrimary = " + ev.isPrimary;
    o.innerHTML += s + "";
}