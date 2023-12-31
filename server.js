const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: ["https://sh-video-chat-messager-hemu21.vercel.app","https://sh-video-chat-messager-omega.vercel.app"],
		methods: [ "GET", "POST","PUT","DELETE" ]
	}
});

const corsOptions = {
   origin: ["https://sh-video-chat-messager-hemu21.vercel.app","https://sh-video-chat-messager-omega.vercel.app"],
}


app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);
	console.log(socket.id)
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
