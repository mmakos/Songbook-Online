jQuery(document).ready(function($) {
    const username = getCookie("username");
    if (username) {
        $("span.user-name :input").attr("value", username);
    }

    $(".wpcf7 :input[type='submit']").click(function() {
        const username = $("span.user-name :input").val();
        if (username && username.length > 0) {
            setCookie("username", username, 1, true);
        }
    });
});