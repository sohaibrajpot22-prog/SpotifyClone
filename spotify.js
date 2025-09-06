console.log("Spotify script is running...");

let songs = [
    { songName: "Pasoori", artist: "Ali Sethi", filePath: "songs/1.mp3", coverPath: "images/pasoori.jpg" },
    { songName: "O Mahi O Mahi", artist: "Arijit Singh", filePath: "songs/2.mp3", coverPath: "images/mahi.jpg" },
    { songName: "Tu Aake Dekhle", artist: "King", filePath: "songs/3.mp3", coverPath: "images/tu-aake.jpg" },
    { songName: "Maan Meri Jaan", artist: "King", filePath: "songs/4.mp3", coverPath: "images/maan.jpg" },
    { songName: "Kahani Suno 2.0", artist: "Kaifi Khalil", filePath: "songs/5.mp3", coverPath: "images/kahani.jpg" }
];

let currentSongIndex = 0;
let audioElement = new Audio(songs[currentSongIndex].filePath);
let playPauseBtn = document.getElementById('playPause');
let seekbar = document.querySelector('.seekbar');
let circle = document.querySelector('.circle');
let currentTimeEl = document.getElementById('currentTime');
let totalDurationEl = document.getElementById('totalDuration');
let progressFill = document.querySelector('.progress-fill');

// Function to play a song
function playSong() {
    audioElement.play();
    playPauseBtn.src = "icons/pause.svg";
}

// Function to pause a song
function pauseSong() {
    audioElement.pause();
    playPauseBtn.src = "icons/play.svg";
}

// Function to update song info in the play bar
function updateSongInfo(songIndex) {
    document.getElementById('currentSongCover').src = songs[songIndex].coverPath;
    document.getElementById('currentSongName').innerText = songs[songIndex].songName;
    document.getElementById('currentSongArtist').innerText = songs[songIndex].artist;
}

// Load and play a specific song
function loadSong(songIndex) {
    currentSongIndex = songIndex;
    audioElement.src = songs[currentSongIndex].filePath;
    updateSongInfo(currentSongIndex);

    // Wait for metadata to load to show initial duration
    audioElement.addEventListener('loadedmetadata', () => {
        totalDurationEl.innerText = formatTime(audioElement.duration);
        playSong();
    });
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


// Event Listeners

// 1. Play/Pause button in the play bar
playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong();
    } else {
        pauseSong();
    }
});

// 2. Time update event to move seekbar and progress fill
audioElement.addEventListener('timeupdate', () => {
    // Update seekbar and progress fill
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    circle.style.left = progress + "%";
    progressFill.style.width = progress + "%";

    // Update current time
    currentTimeEl.innerText = formatTime(audioElement.currentTime);
});

// 3. Seekbar click to change song time
seekbar.addEventListener('click', (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width);
    audioElement.currentTime = percent * audioElement.duration;
});

// 4. Next button
document.getElementById('next').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
});

// 5. Previous button
document.getElementById('previous').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
});

// 6. Play buttons on song cards
Array.from(document.querySelectorAll('.card .play-btn')).forEach((button, index) => {
    button.addEventListener('click', (e) => {
        // Stop event from propagating to the card itself
        e.stopPropagation();
        loadSong(index);
    });
});

// Initial setup on page load
updateSongInfo(currentSongIndex);
// Wait for metadata to load to show initial duration
audioElement.addEventListener('loadedmetadata', () => {
    totalDurationEl.innerText = formatTime(audioElement.duration);
});
