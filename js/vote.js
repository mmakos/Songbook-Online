const MAX_VOTES = 3;
const MAX_SONGS = 3;

jQuery(document).ready(function($) {
	$("#vote-login").submit(function(e) {
		e.preventDefault();
	});
	$("#vote-new-song").submit(function(e) {
		e.preventDefault();
	});
	const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
	const token = params.token;
	if (token !== null) {
		voteLoginWithToken(token);
	} else {
		const voterId = getCookie("voterId");
		if (voterId !== null) {
			$("#vote-login").hide();
			$("#vote-logout").show();
			$("#vote-new-song-section").show();
			updateAddedSongsCount();
			getVoteSongs();
		}
	}
});

function voteNewSong() {
	const songTitle = document.getElementById("vote-song-title").value;
	const songURL = document.getElementById("vote-song-url").value;
	$.ajax({
		url: ajaxurl,
		data: {
			'action': 'vote_new_song',
			'songTitle': songTitle,
			'songUrl': songURL
		},
		success: function(data) {
			const json = JSON.parse(data);
			document.getElementById("vote-new-song-info").innerHTML = json.result ? '<span style="color:green">Pomyślnie dodano nową piosenkę</span>' : '<span style="color:red">Nie udało się dodać nowej piosenki.</span>';
			getVoteSongs();
			updateAddedSongsCount();
		}
	});
}

function voteLogin() {
	const voterId = document.getElementById("voter-id").value;
	voteLoginWithToken(voterId);
}

function voteLoginWithToken(voterToken) {
	$.ajax({
		url: ajaxurl,
		data: {
			'action':'authorize_voter',
			'voterId': voterToken
		},
		success: function(data) {
			const json = JSON.parse(data);
			if (json.result) {
				setCookie("voterId", voterToken, 1, true);
				$("#vote-login-error").hide();
				$("#vote-login").hide();
				$("#vote-logout").show();
				$("#vote-new-song-section").show();
				getVoteSongs();
				updateAddedSongsCount();
			} else {
				$("#vote-login-error").show();
			}
		}
	});
}

function voteLogout() {
	eraseCookie("voterId");
	location.href = location.href.split('?')[0];
}

function getVoteSongs() {
	$.ajax({
		url: ajaxurl,
		data: {
			'action':'get_vote_songs'
		},
		success: function(data) {
			const json = JSON.parse(data);
			setVoteSongs(json);
			votesChanged(false);
		}
	});
}

function setVoteSongs(voteSongs) {
	voteSongs.sort(function(a, b) {return b.votes - a.votes});
	let songs = "";
	for (const song of voteSongs) {
		songs += songToHtml(song);
	}
	document.getElementById("vote-songs").innerHTML = songs;
}

function songToHtml(song) {
	return '<div><input class="vote-checkbox" id="voteSong' + song.id + '" type="checkbox" onclick="votesChanged()"' + (song.userVote ? ' checked' : '') + '>&emsp;<span style="color:black"><a href="' + song.url + '" target="_blank" rel="noopener">' + song.title + '</a></span>&emsp;(' + song.votes + ")</div>";
}

function votesChanged(showSubmitButton=true) {
	const checkboxes = document.getElementsByClassName("vote-checkbox");
	let selected = 0;
	for (const cb of checkboxes) {
		if (cb.checked) {
			++selected;
		}
	}
	for (const cb of checkboxes) {
		if (!cb.checked) {
			cb.disabled = selected >= MAX_VOTES;
		}
	}
	if (showSubmitButton) {
		$("#vote-button").show();
	}
}

function vote() {
	const checkboxes = document.getElementsByClassName("vote-checkbox");
	let selected = [];
	for (const cb of checkboxes) {
		if (cb.checked) {
			selected.push(parseInt(cb.id.substr(8)));
		}
	}
	$.ajax({
		url: ajaxurl,
		data: {
			'action':'vote_songs',
			'songs': JSON.stringify(selected)
		},
		success: function(data) {
			const json = JSON.parse(data);
			document.getElementById("vote-result").innerHTML = json.result ? '<span style="color:green">Pomyślnie zapisano głosy</span>' : '<span style="color:red">Nie udało się zapisać głosów</span>';
			getVoteSongs();
		}
	});
}

function updateAddedSongsCount() {
	$.ajax({
		url: ajaxurl,
		data: {
			'action':'get_added_songs_count'
		},
		success: function(data) {
			const json = JSON.parse(data);
			document.getElementById("added-to-vote-songs").innerHTML = json.songs;
			if (json.songs >= MAX_SONGS) {
				$("#vote-new-song").hide();
			} else {
				$("#vote-new-song").show();
			}
		}
	});
}