

const express = require('express');
const app = express()
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");
let deckReady = false;

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("USER CONNECTED", socket.id);

    socket.on("join_room", (roomID, newDeck) => {
        socket.join(roomID);
        console.log("User with ID:", socket.id, "joined room", roomID);
        socket.to(roomID).emit("deck_set", newDeck);
    })

    socket.on("start_game", (roomID) => {
        console.log("test");
        io.in(roomID).emit("start_helper")
    })

    socket.on("draw", (roomID, players, deck) => {
        io.in(roomID).emit("card_draw", players, deck);
    })
    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED", socket.id);
    })

    socket.on("update_resource", (data, roomID) => {
        socket.to(roomID).emit("resource_update", data);
    })
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
})



function Deck() {

    let starters = shuffler(range(3, 15));
    let middle = range(16, 40);
    let ender = [42, 44, 46, 50];

    let deck = [];
    for (let i = 0; i < 8; i++)
    {
        deck.push(starters[i]);
    }

    let rest = [];
    for (let i = 8; i < 13; i++)
    {
        rest.push(starters[i]);
    }

    rest = rest.concat(middle);
    rest = rest.concat(ender);
    deck = deck.concat(shuffler(rest));

    return deck;
}

function shuffler(array) {
    let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

    return array;
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }