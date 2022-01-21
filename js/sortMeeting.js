jQuery(document).ready(function($) {
    $("#meeting-queue").sortable({
        stop: function(event, ui) {
            changeOrder();
        }
    });
});

function changeOrder() {
    let list = document.getElementsByClassName("dropzone");
    let jsonList = new Array(list.length);
    for(let i = 0; i < list.length; i += 1) {
        jsonList[i] = list[i].id;
    }
    
    $.ajax({
        url: ajaxurl,
        data: {
            'action': 'order_meeting',
            'song-order': jsonList
        }
    });
}