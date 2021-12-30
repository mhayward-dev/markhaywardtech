document.addEventListener('DOMContentLoaded', function () {
    getNowPlaying();
});

function getToken() {
    const TOKEN_URL = 'https://europe-west2-markhaywardtech.cloudfunctions.net/getSpotifyToken';

    return axios({
        method: 'get',
        url: TOKEN_URL,
    })
        .then(function (response) {
            return response.data.access_token;
        });
}

function showNowPlaying(song) {
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
    songLinkEl.style.display = 'block';
    songLinkEl.href = song.songUrl;
}

async function getNowPlaying() {
    const SPOTIFY_CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
    const token = await getToken();

    return axios({
        method: 'get',
        url: SPOTIFY_CURRENTLY_PLAYING_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(function (response) {
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