function addOutsideSong() {
    const songUrl = document.getElementById("external-song-url").value
    if (/https:\/\/spiewnik\.wywrota\.pl\/.+/.test(songUrl)) {
        $.ajax({
            url: ajaxurl,
            data: {
                'action': 'add_external_song',
                'song-url': songUrl,
            },
            success: function (data) {
                const json = JSON.parse(data);
                setSongQueue(json);
            }
        });
    }
}