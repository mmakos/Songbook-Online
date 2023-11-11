if (getCookie("meeting") !== null) {
    jQuery(document).ready(function($) {
        $.ajax({
            url: 'pobierz-spiewnik',
            data: {
                'action':'song_in_meeting_action',
                'song-action': songInMeeting ? 'remove' : 'add',
                'flags': getChordOptions(),
                'transposition': getTransposition()
            },
            success: function(response, status, request) {
                download(response, "spiewnik_" + getCookie("meeting") + ".docx", "application/")
                const json = JSON.parse(data);
                setSongQueue(json);
                if (json.status === 'success') {
                    if (songInMeeting) {
                        $(".meeting-star").removeClass("meeting-star-selected");
                    } else {
                        $(".meeting-star").addClass("meeting-star-selected");
                    }
                }
            }
        });
    }
    document.getElementById("unable-to-convert").style.display = null;
} else {
    document.getElementById("convert-songbook-info").style.display = null;
}
