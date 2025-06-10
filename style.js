document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const letterPopup = document.getElementById('letterPopup');
    const closePopup = document.getElementById('closePopup');
    
    // Tìm và ẩn nút đọc thư
    const changeContentButton = document.getElementById('changeContentButton');
    if (changeContentButton) {
        changeContentButton.parentElement.style.display = 'none';
    }
    
    // Biến để theo dõi trạng thái của phong bì và hiệu ứng ảnh
    let isEnvelopeOpen = false;
    let areImagesAnimated = false;
    
    // Ẩn tất cả các hình ảnh ban đầu
    const floatingImages = document.querySelectorAll('.floating-image');
    floatingImages.forEach(img => {
        img.style.opacity = "0";
        img.style.top = "-120px";
    });
    
    // Hiệu ứng khi nhấp vào phong bì
    envelope.addEventListener('click', function() {
        if (!isEnvelopeOpen) {
            // Nếu phong bì chưa mở, mở phong bì và hiển thị thư
            openEnvelope();
            isEnvelopeOpen = true;
            
            // Chỉ bắt đầu hiệu ứng rơi ảnh khi lần đầu click vào phong bì
            if (!areImagesAnimated) {
                startAllFloatingImages();
                areImagesAnimated = true;
            }
        } else {
            // Nếu phong bì đã mở, đóng lại
            closeEnvelope();
            isEnvelopeOpen = false;
        }
    });
    
    // Hàm xử lý mở phong bì và hiển thị popup
    function openEnvelope() {
        // Bước 1: Mở nắp thư
        envelope.classList.add('open');
        envelope.classList.remove('closed');
        
        // Bước 2: Bật nhạc nếu có
        const music = document.getElementById('backgroundMusic');
        if (music) {
            // Luôn phát nhạc khi mở phong bì
            music.play().then(() => {
                updateMusicIcon(true);
            }).catch(e => {
                console.log("Không thể phát nhạc tự động:", e);
            });
        }
        
        // Bước 3: Sau khi card trồi lên, hiển thị popup thư
        setTimeout(() => {
            letterPopup.style.display = 'flex';
        }, 2000);
    }
    
    // Hàm xử lý đóng phong bì
    function closeEnvelope() {
        envelope.classList.remove('open');
        envelope.classList.add('closed');
        letterPopup.style.display = 'none';
    }
    
    // Đóng popup khi nhấp vào nút đóng
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            letterPopup.style.display = 'none';
            closeEnvelope();
            isEnvelopeOpen = false;
        });
    }
    
    // Đóng popup khi nhấp ra ngoài
    window.addEventListener('click', function(event) {
        if (event.target === letterPopup) {
            letterPopup.style.display = 'none';
            closeEnvelope();
            isEnvelopeOpen = false;
        }
    });

    // Định nghĩa danh sách nhạc (chỉ sử dụng các file local)
    const playlist = [
        {
            title: "[Playlist] - Ghé Qua, Một Đời, 10 Ngàn Năm, Phép Màu",
            path: "EM/[Playlist] - Ghé Qua, Một Đời, 10 Ngàn Năm, Phép Màu,.... ｜ Mùa Hạ Có Anh.mp3"
        },
        {
            title: "PlayList MCK ｜Hãy Đeo Tai Nghe Để Trải Nghiệm Cảm Giác Hay Hơn",
            path: "EM/PlayList MCK ｜Hãy Đeo Tai Nghe Để Trải Nghiệm Cảm Giác Hay Hơn.mp3"
        },
        {
            title: "Đánh Đổi thôi em",
            path: "EM/Obito - Đánh Đổi ft. MCK.mp3"
        },
        {
            title: "Anh Đã Ổn Hơn nhé",
            path: "EM/ADOH.mp3"
        },
        {
            title: "Em đang Buồn Hay Vui",
            path: "EM/BUỒN HAY VUI - VSOUL x MCK x Obito x Ronboogz x Boyzed (Official Audio).mp3"
        },
        {
            title: "Anh đã CHÌM SÂU vào em rồi",
            path: "EM/Chìm Sâu - RPT MCK (feat. Trung Trần) ｜ Official Lyrics Video.mp3"
        },
        {
            title: "Mộng Yu Nha",
            path: "EM/MỘNG YU - AMEE x MCK ｜ Official Music Video (from 'MỘNGMEE' album).mp3"
        }
    ];
    
    // Chỉ số của bài hát hiện tại
    let currentTrackIndex = 0;
    
    // Lấy các phần tử DOM cần thiết
    const music = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicToggle2 = document.getElementById('musicToggle2');
    const prevTrack = document.getElementById('prevTrack');
    const nextTrack = document.getElementById('nextTrack');
    const currentTrackName = document.getElementById('currentTrackName');
    const musicSeeker = document.getElementById('musicSeeker');
    const volumeControl = document.getElementById('volumeControl');
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    
    // Thiết lập bài hát đầu tiên
    loadTrack(currentTrackIndex);
    
    // Hàm load bài hát từ playlist (điều chỉnh để không tự động phát)
    function loadTrack(trackIndex) {
        // Đảm bảo index nằm trong phạm vi của playlist
        if (trackIndex < 0) trackIndex = playlist.length - 1;
        if (trackIndex >= playlist.length) trackIndex = 0;
        
        currentTrackIndex = trackIndex;
        
        // Kiểm tra xem bài hát có đường dẫn không
        if (!playlist[trackIndex].path) {
            // Nếu không có đường dẫn, chuyển sang bài tiếp theo
            loadTrack(currentTrackIndex + 1);
            return;
        }
        
        // Sử dụng đường dẫn trực tiếp từ playlist
        let audioUrl = playlist[trackIndex].path;
        
        // Ghi nhớ trạng thái phát hiện tại trước khi load bài mới
        const wasPlaying = !music.paused;
        
        // Cập nhật source của audio
        music.innerHTML = `<source src="${audioUrl}" type="audio/mp3">`;
        music.load();
        
        // Xử lý lỗi khi tải file nhạc
        music.addEventListener('error', function(e) {
            console.error('Lỗi tải nhạc:', e);
            currentTrackName.textContent = `⚠️ Không thể tải "${playlist[trackIndex].title}"`;
            
            // Tự động thử bài tiếp theo sau 2 giây nếu đang phát
            if (wasPlaying) {
                setTimeout(() => {
                    loadTrack((trackIndex + 1) % playlist.length);
                }, 2000);
            }
        }, {once: true});
        
        // Cập nhật tên bài hát
        currentTrackName.textContent = playlist[trackIndex].title;
        
        // Chỉ phát nhạc nếu trước đó đang phát (ví dụ khi chuyển bài)
        if (wasPlaying) {
            music.play().then(() => {
                updateMusicIcon(true);
            }).catch(e => {
                console.log("Không thể phát nhạc tự động:", e);
            });
        } else {
            // Nếu không phải đang phát, cập nhật biểu tượng thành trạng thái dừng
            updateMusicIcon(false);
        }
        
        // Reset thanh tua và cập nhật thời gian khi metadata được load
        music.addEventListener('loadedmetadata', function onMetadataLoaded() {
            // Cập nhật max value cho thanh tua
            musicSeeker.max = Math.floor(music.duration);
            
            // Hiển thị tổng thời gian
            const totalMinutes = Math.floor(music.duration / 60);
            const totalSeconds = Math.floor(music.duration % 60);
            totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
            
            // Xóa event listener này để tránh đăng ký nhiều lần
            music.removeEventListener('loadedmetadata', onMetadataLoaded);
        });
    }
    
    // Xử lý khi bài hát kết thúc - vẫn tự động chuyển và phát bài tiếp theo
    music.addEventListener('ended', () => {
        loadTrack(currentTrackIndex + 1);
    });
    
    // Xử lý nút previous
    if (prevTrack) {
        prevTrack.addEventListener('click', () => {
            loadTrack(currentTrackIndex - 1);
        });
    }
    
    // Xử lý nút next
    if (nextTrack) {
        nextTrack.addEventListener('click', () => {
            loadTrack(currentTrackIndex + 1);
        });
    }
    
    // Xử lý nút play/pause (nút lớn bên trái)
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Xử lý nút play/pause (nút nhỏ ở giữa)
    if (musicToggle2) {
        musicToggle2.addEventListener('click', toggleMusic);
    }
    
    // Giữ nguyên và điều chỉnh các hàm liên quan đến điều khiển nhạc
    function toggleMusic() {
        if (music.paused) {
            music.play();
            updateMusicIcon(true);
        } else {
            music.pause();
            updateMusicIcon(false);
        }
    }
    
    function updateMusicIcon(isPlaying) {
        if (musicToggle) {
            const icon = musicToggle.querySelector('.music-icon');
            if (icon) {
                icon.textContent = isPlaying ? '🔊' : '🔇';
            }
        }
        
        if (musicToggle2) {
            musicToggle2.textContent = isPlaying ? '⏸' : '▶️';
        }
    }
    
    // Cập nhật thanh tua nhạc
    music.addEventListener('loadedmetadata', () => {
        // Thiết lập thời lượng tối đa cho thanh tua
        musicSeeker.max = Math.floor(music.duration);
        
        // Hiển thị tổng thời gian
        const totalMinutes = Math.floor(music.duration / 60);
        const totalSeconds = Math.floor(music.duration % 60);
        totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    });
    
    // Cập nhật thanh tua theo tiến độ phát nhạc
    music.addEventListener('timeupdate', () => {
        if (!musicSeeker.dragging) {
            musicSeeker.value = Math.floor(music.currentTime);
            
            // Cập nhật hiển thị thời gian hiện tại
            const currentMinutes = Math.floor(music.currentTime / 60);
            const currentSeconds = Math.floor(music.currentTime % 60);
            currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        }
    });
    
    // Xử lý khi người dùng tua
    musicSeeker.addEventListener('mousedown', () => {
        musicSeeker.dragging = true;
    });
    
    musicSeeker.addEventListener('mouseup', () => {
        musicSeeker.dragging = false;
        music.currentTime = musicSeeker.value;
    });
    
    musicSeeker.addEventListener('input', () => {
        const currentMinutes = Math.floor(musicSeeker.value / 60);
        const currentSeconds = Math.floor(musicSeeker.value % 60);
        currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    });
    
    // Xử lý điều chỉnh âm lượng
    volumeControl.addEventListener('input', () => {
        music.volume = volumeControl.value;
        
        // Cập nhật icon âm lượng
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon) {
            if (music.volume === 0) {
                volumeIcon.textContent = '🔇';
            } else if (music.volume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    });
    
    // Thiết lập âm lượng ban đầu
    if (music && volumeControl) {
        music.volume = volumeControl.value;
    }

    // Hàm bắt đầu hiệu ứng rơi cho tất cả các hình ảnh
    function startAllFloatingImages() {
        const totalImages = floatingImages.length;
        
        // Thiết lập vị trí cho các hình ảnh
        floatingImages.forEach((img, index) => {
            // Phân bố đều các hình ảnh theo chiều ngang
            const leftPos = 5 + (90 / (totalImages - 1)) * index;
            img.style.left = `${leftPos}%`;
            
            // Độ trễ tăng dần theo vị trí từ trái sang phải
            const sequentialDelay = index * 0.3; // 0.3 giây giữa mỗi ảnh
            
            // Khởi tạo animation cho hình ảnh
            startFallingAnimation(img, sequentialDelay);
        });
    }
    
    function startFallingAnimation(img, initialDelay) {
        // Ẩn ảnh ban đầu
        img.style.opacity = "0";
        img.style.top = "-120px";
        
        // Tăng thời gian rơi: từ 6-9s lên 15-25s (rơi chậm hơn)
        const fallDuration = Math.random() * 10 + 15; // 15-25s
        
        // Loại bỏ animation lắc qua lại
        img.style.animation = "none";
        
        // Thiết lập animation rơi sau một độ trễ
        setTimeout(() => {
            // Di chuyển ảnh từ trên xuống với tốc độ chậm hơn
            img.style.transition = `top ${fallDuration}s linear, opacity 1s`;
            img.style.top = "100vh";
            img.style.opacity = "0.8";
            
            // Khi kết thúc rơi, bắt đầu lại với độ trễ ngẫu nhiên
            setTimeout(() => {
                // Reset vị trí
                img.style.transition = "none";
                img.style.opacity = "0";
                img.style.top = "-120px";
                
                // Bắt đầu animation mới sau độ trễ dài hơn
                const randomDelay = Math.random() * 3; // Tăng độ trễ tối đa lên 3s
                setTimeout(() => {
                    startFallingAnimation(img, 0);
                }, randomDelay * 1000);
                
            }, fallDuration * 1000);
        }, initialDelay * 1000);
    }
    
    // Thêm code xử lý nút ẩn/hiện phong bì
    const toggleEnvelopeBtn = document.getElementById('toggleEnvelopeBtn');
    const bodyElement = document.body;

    if (toggleEnvelopeBtn) {
        let envelopeVisible = true;
        
        toggleEnvelopeBtn.addEventListener('click', function() {
            if (envelopeVisible) {
                // Ẩn phong bì nhưng giữ hiệu ứng ảnh rơi
                bodyElement.classList.add('hide-envelope');
                toggleEnvelopeBtn.textContent = 'Thư của anh';
                envelopeVisible = false;
                
                // Bắt đầu hiệu ứng ảnh rơi nếu chưa bắt đầu
                if (!areImagesAnimated) {
                    startAllFloatingImages();
                    areImagesAnimated = true;
                }
                
                // Tự động phát nhạc nếu chưa phát
                if (music && music.paused) {
                    music.play().then(() => {
                        updateMusicIcon(true);
                    }).catch(e => {
                        console.log("Không thể phát nhạc tự động:", e);
                    });
                }
            } else {
                // Hiển thị lại phong bì
                bodyElement.classList.remove('hide-envelope');
                toggleEnvelopeBtn.textContent = 'Dành cho bé chỉ nghe nhạc';
                envelopeVisible = true;
                
                // Giữ nguyên hiệu ứng ảnh rơi đã được bật
            }
        });
    }
});

// Bắt lỗi unhandled rejection
window.addEventListener('unhandledrejection', function(e) {
    console.log('Lỗi promise không được xử lý:', e.reason);
    
    // Ngăn lỗi hiển thị trong console nếu là AbortError
    if (e.reason && e.reason.name === 'AbortError') {
        e.preventDefault();
    }
});

