const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

let search = window.location.search;
if (search.length > 0) {
    search = search.substring(1);
}

if (getCookie("meeting") !== null) {
    document.getElementById("convert-songbook-info").style.display = null;
    jQuery(document).ready(function ($) {
        $.ajax({
            url: '/pobierz-spiewnik',
            type: 'GET',
            data: window.location.search,
            xhrFields: {
                responseType: 'arraybuffer'
            },
            success: function (buffer, status, xhr) {
                document.getElementById("convert-songbook-info").style.display = "none";
                if (xhr.getResponseHeader('Content-Type') === DOCX_TYPE) {
                    document.getElementById("songbook-converted").style.display = null;
                    downloadOnSuccess(new Blob([buffer], {type: DOCX_TYPE}), status, xhr);
                } else if (xhr.getResponseHeader('Content-Type') === "text/html") {
                    showHTMLError(new TextDecoder("utf-8").decode(buffer));
                } else {
                    showPlainError(new TextDecoder("utf-8").decode(buffer));
                }
            }
        });
    });
} else {
    showPlainError("not-in-meeting");
}


function downloadOnSuccess(buffer, status, xhr) {
    // check for a filename
    let filename = "";
    const disposition = xhr.getResponseHeader('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches !== null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(buffer, filename);
    } else {
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(buffer);

        if (filename) {
            const a = document.createElement("a");
            if (typeof a.download === 'undefined') {
                window.location.href = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.location.href = downloadUrl;
        }

        setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
        }, 100);
    }
}

function showPlainError(message) {
    if (message === "not-in-meeting") {
        document.getElementById("not-in-meeting-error").style.display = null;
    } else {
        showHTMLError(message);
    }
}

function showHTMLError(message) {
    document.getElementById("server-error").style.display = null;
    document.getElementById("error-stacktrace").innerHTML = message;
}
