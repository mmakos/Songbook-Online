jQuery(document).ready(function($) {
    setInputMeetingListener();
    const meetingId = getCookie("meeting");
    setMeetingId(meetingId);
    setMeetingContent(meetingId !== null);
    setInputButton(meetingId !== null);
    setSongButtonsVisible(meetingId !== null, false);
    $("#meeting-error").hide();

    $(".song-in-meeting").click(function() {
        const songInMeeting = $(".meeting-star").hasClass("meeting-star-selected");
        $.ajax({
            url: ajaxurl,
            data: {
                'action':'song_in_meeting_action',
                'song-action': songInMeeting ? 'remove' : 'add'
            },
            success: function(data) {
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
    });

    $("#meeting-submit").click(function() {
        if (getCookie("meeting") !== null) {
            leaveMeeting();
        } else {
            joinMeeting();
        }
    });
});

function leaveMeeting() {
    eraseCookie("meeting");
    setMeetingContent(null, false);
    setInputButton(false);
    setSongButtonsVisible(false);
}

function joinMeeting() {
    let meetingId = document.getElementById("meeting-id-input").value

    $.ajax({
        url: ajaxurl,
        data: {
            'action': 'join_meeting',
            'meeting-id': meetingId
        },
        success: function(data) {
            let result = JSON.parse(data);
            if (result["status"] === 'success') {
                $("#meeting-error").hide(1000);
                setMeetingContent($, true);
                setInputButton(true);
                setSongButtonsVisible(true);
            } else {
                $("#meeting-error").show(1000);
            }
        }
    });
}

function setMeetingContent(isInMeeting) {
    if (isInMeeting) {
        $("#meeting-queue").show();
        $("#meeting-information").show();
        $("#meeting-id-input").hide();
    } else {
        $("#meeting-queue").hide();
        $("#meeting-information").hide();
        $("#meeting-id-input").show();
    }
    if (isInMeeting) {
        $.ajax({
            url: ajaxurl,
            data: {
                'action':'get_meeting_songs'
            },
            success: function(data) {
                const json = JSON.parse(data);
                setSongQueue(json);
                if (json["song-in-meeting"]) {
                    $(".meeting-star").addClass("meeting-star-selected");
                }
            }
        });
    }
}

function setInputButton(isInMeeting) {
    let buttonText = isInMeeting ? "Opuść" : "Dołącz";
    let button = document.getElementById("meeting-submit")
    if (button !== null) {
        button.innerHTML = buttonText;
    }
}

function setSongQueue(songQueue) {
    let queueLabel = document.getElementById("meeting-queue")
    queueLabel.innerHTML = songQueue["queue"] ? songQueue["queue"] : "";
    let infoLabel = document.getElementById("meeting-information")
    infoLabel.innerHTML = songQueue["info"] ? songQueue["info"] : "";
}

function setMeetingId(meetingId) {
    let meetingStr = "Spotkanie";
    if (meetingId !== null) {
        meetingStr += ": " + meetingId;
    }
    let meetingLabel = document.getElementById("meeting-id")
    if (meetingLabel !== null) {
        meetingLabel.innerHTML = meetingStr;
    }
}

function setSongButtonsVisible(visible, slide=true) {
    if (visible) {
        $(".song-queue").slideDown(slide ? 1000 : 0);
    } else {
        $(".song-queue").slideUp(slide ? 1000 : 0);
    }
}

function setInputMeetingListener() {
    $("#meeting-id-input").keyup(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#meeting-submit").click();
        }
    });
}