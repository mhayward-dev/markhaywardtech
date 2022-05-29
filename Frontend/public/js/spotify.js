document.addEventListener('DOMContentLoaded', function () {
    setupNowPlaying();
});

async function setupNowPlaying() {
    const token = await getToken();

    fetchNowPlaying(token);
    fetchRecentlyPlayed(token);
}

function getToken() {
    // get spotify token from server where our spotify account secrets can be hidden
    const TOKEN_URL = 'https://europe-west2-markhaywardtech.cloudfunctions.net/getSpotifyToken';

    return axios({
        method: 'get',
        url: TOKEN_URL,
    })
        .then(function (response) {
            return response.data.access_token;
        });
}

function fetchNowPlaying(token) {
    getSpotifyRequest(token, 'https://api.spotify.com/v1/me/player/currently-playing', function (response) {
        if (response.status === 204 || response.status > 400) {
            // song is not playing or there is an issue
            console.log("not playing");
            return;
        }

        const song = response.data;

        showNowPlaying({
            isPlaying: song.is_playing,
            title: song.item.name,
            artist: song.item.artists.map((_artist) => _artist.name).join(', '),
            album: song.item.album.name,
            albumImageUrl: song.item.album.images[0].url,
            songUrl: song.item.external_urls.spotify
        });
    });
}

function fetchRecentlyPlayed(token) {
    getSpotifyRequest(token, 'https://api.spotify.com/v1/me/player/recently-played', function (response) {
        console.log(response.data.items);
        const playedItems = filterRecentlyPlayed(response.data.items).slice(0,6);

        playedItems.forEach(function (item) {
            const song = item.track;
            const artist = song.artists.map((_artist) => _artist.name).join(', ');
            const album = song.album.name

            const songEl = `<div class="song col s12 m12 l6 xl4">
                <img class="song-artwork" src='${song.album.images[0].url}'>
                <div class="song-details">
                    <div class="song-title">${song.name}</div>
                    <div class="song-artist-album">${artist} \u2014 ${album}</div>
                </div>
            </div>`;

            const container = document.querySelector('.recently-played-songs');
            container.innerHTML += songEl;
        });
    });
}

function getSpotifyRequest(token, url, callback) {
    return axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(callback)
}

function filterRecentlyPlayed(items) {
    const filteredItems = [];

    items.forEach(function (item) {
        const key = `${item.track.name}:${item.track.album.name}`;

        // Filter out duplicate plays of tracks
        if (!filteredItems.some(i => `${i.track.name}:${i.track.album.name}` === key)) {
            filteredItems.push(item);
        }
    });

    return filteredItems;
}

function showNowPlaying(song) {
    document.querySelector('.currently-playing').style.display = 'block';

    const nowPlayingGif = document.querySelector('.now-playing-gif');
    nowPlayingGif.style.display = 'block';

    const artworkEl = document.querySelector('.song-artwork');
    artworkEl.style.display = 'block';
    artworkEl.src = song.albumImageUrl;

    const titleEl = document.querySelector('.song-title');
    titleEl.textContent = song.title;

    const artistEl = document.querySelector('.song-artist-album');
    artistEl.textContent = song.artist + ' \u2014 ' + song.album;

    const songLinkEl = document.querySelector('.song-link');
    songLinkEl.parentElement.style.display = 'block';
    songLinkEl.href = song.songUrl;
}