const socket = io('https://googlemeet-ao7h.onrender.com');

const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

///username///

// div_chat.hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    div_chat.show();
    div_dang_ky.hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        document.getElementById("ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;

        document.getElementById("ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));



//username//

const peer = new Peer(undefined, {
    path: "peerjs",
    host: 'googlemeet-ao7h.onrender.com',
    port: 443,
});

let myVideoStream;

const getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");

            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
        });

        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });
        
        document.addEventListener("keydown", (e) => {
            if (e.which === 13 && chatInputBox.value != "") {
                socket.emit("message", chatInputBox.value);
                chatInputBox.value = "";
            }
        });

        socket.on("createMessage", (msg) => {
            console.log(msg);
            let li = document.createElement("li");
            li.innerHTML = msg;
            all_messages.append(li);
            main__chat__window.scrollTop = main__chat__window.scrollHeight;
        });

    });
socket.on('user-disconnected', userId => {
             if (peers[userId]) peers[userId].close()
})


peer.on("call", function(call) {
    getUserMedia({ video: true, audio: true },
        function(stream) {
            call.answer(stream); // Answer the call with an A/V stream.
            const video = document.createElement("video");
            call.on("stream", function(remoteStream) {
                addVideoStream(video, remoteStream);
            });
        },
        function(err) {
            console.log("Failed to get local stream", err);
        }
    );
});


///////

peer.on("open", (id) => {
    let app1 = document.querySelector('#my-peer');
    app1.append(id);
    socket.emit("join-room", ROOM_ID, id);
    console.log('My peer ID is: ' + id);
    
    
     document.getElementById("btnSignUp").click(() => {
        const username = document.getElementById("#txtUsername").val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerID: id });
        console.log(username);
    });


});


// CHAT

const connectToNewUser = (userId, streams) => {
    var call = peer.call(userId, streams);
    console.log(call);
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
    });
};

const addVideoStream = (videoEl, stream) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });

    videoGrid.append(videoEl);
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
                100 / totalUsers + "%";
        }
    }
};

const shareScreen = () => {
    const shareScreen = displayMediaOptions = ({
        video: { cursor: 'always' },
        audio: false
    });

    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
    });
};



const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setPlayVideo = () => {
    const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
    const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
    const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
    const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};


const myVar = setInterval(function() {
    Clock()
}, 1000);

function Clock() {
    a = new Date();
    w = Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");
    var a = w[a.getDay()],
        w = new Date,
        d = w.getDate();
    m = w.getMonth() + 1;
    y = w.getFullYear();
    h = w.getHours();
    mi = w.getMinutes();
    se = w.getSeconds();
    if (10 > d) {
        d = "0" + d
    }
    if (10 > m) {
        m = "0" + m
    }
    if (10 > h) {
        h = "0" + h
    }
    if (10 > mi) {
        mi = "0" + mi
    }
    if (10 > se) {
        se = "0" + se
    }
    document.getElementById("clockDiv").innerHTML = a + "  ,  " + d + " - " + m + " - " + y + "    ,  " + h + ":" + mi + ":" + se + "";
}
