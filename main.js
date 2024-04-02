/**
 * 1. Render song
 * 2. Scroll top
 * 3. Play / pause /seek
 * 4. CD Rotate
 * 5. Next / Previous
 * 6. Random
 * 7. Next / repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'TRODUC_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const singer = $('header p');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    mouseDownOnSlider: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        //1
        {
            name: '1.Chúng ta của hiện tại',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/1.chung-ta-cua-hien-tai.mp3',
            image: './assets/img/1.chung-ta-cua-hien-tai.jpg',
        },
        //2
        {
            name: '2.Duyên do trời, phận tại ta',
            singer: 'Anh Tú - Voi Bản Đôn',
            path: './assets/music/2.duyen-do-troi-phan-do-ta.mp3',
            image: './assets/img/2.duyen-do-troi-phan-do-ta.jpg',
        },

        //3
        {
            name: '3.Rồi tới luôn',
            singer: 'Nal',
            path: './assets/music/3.roi-toi-luon.mp3',
            image: './assets/img/3.roi-toi-luon.jpg',
        },
        //4
        {
            name: '4.Em là',
            singer: 'Mono',
            path: './assets/music/4.em-la.mp3',
            image: './assets/img/4.em-la.jpg',
        },
        //5
        {
            name: '5.Thiên Lý ơi',
            singer: 'T.R.I',
            path: './assets/music/5.thien-ly-oi.mp3',
            image: './assets/img/5.thien-ly-oi.jpg',
        },
        //6
        {
            name: '6.Tò te tí',
            singer: 'Wren Evans',
            path: './assets/music/6.to-te-ti.mp3',
            image: './assets/img/6.to-te-ti.jpg',
        },
        //7
        {
            name: '7.Dance Monkey',
            singer: 'Tones and I',
            path: './assets/music/7.dance-monkey.mp3',
            image: './assets/img/7.dance-monkey.jpg',
        },
        //8
        {
            name: '8.Beggin',
            singer: 'Måneskin',
            path: './assets/music/8.beggin.mp3',
            image: './assets/img/8.beggin.jpg',
        },
        //9
        {
            name: '9.Havana',
            singer: 'Camila Cabello',
            path: './assets/music/9.havana.mp3',
            image: './assets/img/9.havana.jpg',
        },
        //10
        {
            name: '10.Rồi em sẽ gặp một chàng trai khác',
            singer: 'HippoHappy - The masked singer',
            path: './assets/music/10.roi-em-se-gap-mot-chang-trai-khac.mp3',
            image: './assets/img/10.roi-em-se-gap-mot-chang-trai-khac.jpg',
        },
    ],

    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}"
            data-index= "${index}">
                <div
                    class="thumb"
                    style="background-image: url('${song.image}')"
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents() {
        const cdWidth = cd.offsetWidth;
        _this = this;

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        //Xử lý phóng to/thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //Xử lý song được play
        audio.onplay = function (event) {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        //Xử lý song bị pause
        audio.onpause = function (event) {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // Khi tiến độ song thay đổi
        progress.onmousedown = function () {
            _this.mouseDownOnSlider = true;
        };
        progress.onmouseup = function () {
            _this.mouseDownOnSlider = false;
        };
        audio.ontimeupdate = function () {
            if (audio.duration && !_this.mouseDownOnSlider) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        progress.onchange = function (e) {
            if (audio.duration) {
                const seekTime = (audio.duration / 100) * e.target.value;
                audio.currentTime = seekTime;
            }
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi previous song
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật tắt nút random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Xử lý bật tắt nút lặp lại song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }
        };

        // Xử lý click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    _this.scrollToActiveSong();
                    audio.play();
                }
                // Xử lý khi click vào option
                if (e.target.closest('.option')) {
                }
            }
        };
    },

    scrollToActiveSong() {
        if (this.currentIndex < 4) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }, 300);
        } else {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }, 300);
        }
    },

    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Xử lý các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();
