const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("blast", (msg) => {
    io.emit("blast", msg);
  });

  socket.on("wild", (inputwild, inputwildnum) => {
    let clientsArray = [];
    let clientsList = io.sockets.adapter.rooms;
    let sentarray = [];
    for (let item of clientsList.keys()) clientsArray.push(item);

    // If inputwildnum is bigger then users online, it'll send to everyone the message.
    if (inputwildnum >= clientsArray.length) {
      // inputwildnum = clientsArray.length;
      io.to(clientsArray).emit("wild", inputwild);
      return;
    }
    for (let i = 0; i < inputwildnum; i++) {
      let choosenRandomUser =
        clientsArray[Math.floor(Math.random() * clientsArray.length)];
      // If the choosenRandomUser(random function) picked the messages writer, random again.
      // If the random picked someone who already picked, random again.
      if (
        socket.id == choosenRandomUser &&
        clientsArray.includes(choosenRandomUser)
      ) {
        while (
          socket.id == choosenRandomUser &&
          clientsArray.includes(choosenRandomUser)
        ) {
          choosenRandomUser =
            clientsArray[Math.floor(Math.random() * clientsArray.length)];
        }
      }
      sentarray.push(choosenRandomUser);
    }
    sentarray.push(socket.id);
    io.to(sentarray).emit("wild", inputwild);
  });

  socket.on("spin", (inputwild) => {
    let clientsArray = [];
    let sentarray = [];
    let clientsList = io.sockets.adapter.rooms;
    for (let item of clientsList.keys()) clientsArray.push(item);
    let choosenRandomUser =
      clientsArray[Math.floor(Math.random() * clientsArray.length)];
    // If the choosenRandomUser(random function) picked the messages writer, random again.
    // If the random picked someone who already picked, random again.
    if (
      socket.id == choosenRandomUser &&
      clientsArray.includes(choosenRandomUser)
    ) {
      while (
        socket.id == choosenRandomUser &&
        clientsArray.includes(choosenRandomUser)
      ) {
        choosenRandomUser =
          clientsArray[Math.floor(Math.random() * clientsArray.length)];
      }
    }
    sentarray.push(choosenRandomUser);
    sentarray.push(socket.id);
    io.to(sentarray).emit("spin", inputwild);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
