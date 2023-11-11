jQuery(document).ready(function($) {
    setInputMeetingListener();
    const meetingId = decodeURIComponent(getCookie("meeting"));
    setMeetingId(meetingId);
    setMeetingContent(meetingId !== null, true);
    setInputButton(meetingId !== null);
    setSongButtonsVisible(meetingId !== null, false);
    $("#meeting-error").hide();

    $(".song-in-meeting").click(function() {
        const songInMeeting = $(".meeting-star").hasClass("meeting-star-selected");
        $.ajax({
            url: ajaxurl,
            data: {
                'action':'song_in_meeting_action',
                'song-action': songInMeeting ? 'remove' : 'add',
                'flags': getChordOptions(),
                'transposition': getTransposition()
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
    setMeetingId(null);
    setMeetingContent(false);
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
                setMeetingContent(true);
                setInputButton(true);
                setSongButtonsVisible(true);
            } else {
                $("#meeting-error").show(1000);
            }
        }
    });
}

function setMeetingContent(isInMeeting, siteStart=false) {
    const slideTime = siteStart ? 0 : 400;
    if (isInMeeting) {
        $("#meeting-id-input").slideUp(slideTime);
        $.ajax({
            url: ajaxurl,
            data: {
                'action':'get_meeting_songs'
            },
            success: function(data) {
                const json = JSON.parse(data);
                setSongQueue(json);
                $("#meeting-queue").slideDown(slideTime);
                $("#meeting-information").slideDown(slideTime);
                if (json["song-in-meeting"]) {
                    $(".meeting-star").addClass("meeting-star-selected");
                }
            }
        });
    } else {
        $("#meeting-queue").slideUp(slideTime);
        $("#meeting-information").slideUp(slideTime);
        $("#meeting-id-input").slideDown(slideTime);
    }
}

function setInputButton(isInMeeting) {
    let buttonText = isInMeeting ? "Opuść" : "Dołącz";
    let button = document.getElementById("meeting-submit");
    if (button !== null) {
        button.innerHTML = buttonText;
    }
}

function setSongQueue(songQueue) {
    let queueLabel = document.getElementById("meeting-queue");
    queueLabel.innerHTML = songQueue.queue ? songQueue.queue : "";
    let infoLabel = document.getElementById("meeting-information");
    infoLabel.innerHTML = songQueue.info ? songQueue.info : "";
}

function setMeetingId(meetingId) {
    let meetingStr = "Śpiewanki";
    if (meetingId !== null) {
        meetingStr += ": " + meetingId;
    }
    let meetingLabel = document.getElementById("meeting-id");
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

function getTransposition() {
    let result = ((current_transposition % 12 + 12) % 12);
    if (last_direction < 0) {
        result -= 12;
    } else if (last_direction > 0 && result === 0) {
        result += 12;
    }
    return result;
}