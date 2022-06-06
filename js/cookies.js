function allowsCookies() {
    return getCookie("cookie_notice_accepted") === 'true';
}

function setCookie(name, value, hours, never=false) {
    if (allowsCookies()) {
        let expires = "";
        if (hours) {
            if (!never) {
                const date = new Date();
                date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            } else {
                expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            }
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
        return true;
    }
    return false;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    if (allowsCookies()) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
