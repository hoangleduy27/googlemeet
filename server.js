const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
    rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

const arrUserInfo = []
io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });
    });
     socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
    
});


server.listen(process.env.PORT || 3030);
