jQuery(document).ready(function($) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let songId = params.song;
    $.ajax({
        url: ajaxurl,
        data: {
            'action': 'get_reporting_song',
            'song': songId,
        },
        success: function (data) {
            const json = JSON.parse(data);
            if (json.title) {
                $("span.title :input").attr("value", json.title);
            }
        }
    });
});