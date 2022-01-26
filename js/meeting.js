jQuery(document).ready(function($) {
    setInputMeetingListener();
    const meetingId = getCookie("meeting");
    setMeetingId(meetingId);
    setMeetingContent(meetingId !== null);
    setInputButton(meetingId !== null);
    setSongButtonsVisible(meetingId !== null, false);
    $("#meeting-error").hide();

    // $(".add-to-meeting").click(function() {
    //     $.ajax({
    //         url: ajaxurl,
    //         data: {
    //             'action':'song_in_meeting_action',
    //             'song-action': 'add'
    //         },
    //         success: function(data) {
    //             setSongQueue(JSON.parse(data));
    //         }
    //     });
    // });
    //
    // $(".remove-from-meeting").click(function() {
    //     $.ajax({
    //         url: ajaxurl,
    //         data: {
    //             'action':'song_in_meeting_action',
    //             'song-action': 'remove'
    //         },
    //         success: function(data) {
    //             setSongQueue(JSON.parse(data))
    //         }
    //     });
    // });

    $(".song-in-meeting").click(function() {
        const songInMeeting = $(this).children(".meeting-star").hasClass("meeting-star-selected");
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
                        $(this).children(".meeting-star").addClass("meeting-star-selected");
                    } else {
                        $(this).children(".meeting-star").removeClass("meeting-star-selected");
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
                setSongQueue(JSON.parse(data));
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

// COOKIES
function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}