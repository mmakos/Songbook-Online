jQuery(document).ready(function($) {
    const id = getID();
    if (id > 0) {
        let fav = getCookie("favourites");
        if (fav === null) {
            fav = "";
        }
        const heart = $(".favourite-heart");
        const favourites = fav.split("$");
        if (favourites.includes(id)) {
            heart.addClass("favourite-heart-selected");
        }
        setFavouritesHTML();
        $(".favourite-song").click(function() {
            let fav = getCookie("favourites");
            if (fav === null) {
                fav = "";
            }
            if (heart.hasClass("favourite-heart-selected")) {
                setCookie("favourites", fav.replaceAll(id + "$", ""), 1, true);
                heart.removeClass("favourite-heart-selected");
                setFavouritesHTML();
            } else {
                setCookie("favourites", fav + id + "$", 1, true);
                heart.addClass("favourite-heart-selected");
                setFavouritesHTML();
            }
        });
    }
});

function setFavouritesHTML() {
    let favCookie = getCookie("favourites");
    if (favCookie === null) {
        favCookie = "";
    }
    const favourites = favCookie.split("$");
    favourites.sort();
    $.ajax({
        url: ajaxurl,
        data: {
            'action': 'get_songs_with_ids',
            'song-ids': favourites.join(",")
        },
        success: function(data) {
            console.log(data);
            const html = JSON.parse(data)["favourites"];
            if (html.length > 0) {
                $("#favourites-list").html(html);
                $("#favourites-id").slideDown();
            } else {
                $("#favourites-id").slideUp();
                $("#favourites-list").html("");
            }
        }
    });

}

function getID() {
    const articles = document.querySelectorAll('article');
    if (articles.length > 0) {
        const idSplit = articles[0].id.split("-");
        if (idSplit.length === 2) {
            return idSplit[1];
        }
    }
    return -1;
}