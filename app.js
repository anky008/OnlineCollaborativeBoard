let express=require("express");
let socket=require("socket.io");

let app = express(); // initializes and server is ready

app.use(express.static("public"));

// port which I want to listen
let port=process.env.PORT || 3000;
// whenever someone connects with my server I want to  listen
let server=app.listen(port,function(e){
    console.log("Listening to port:" + port);
}); 

let io=socket(server);

// whenever any event takes place with another computer this callback is called 
io.on("connection",function(socket){
    console.log("Made socket connection!")

    // data sent by a computer with key "begin_path" is recieved by the server 
    socket.on("begin_path",function(data){
        console.log("start point recieved by server:",data);
        
        // send the recieved data to all connected computers
        io.sockets.emit("begin_path",data);
    });

    socket.on("draw_path",function(data){
        console.log("point to draw recieved by server:",data);
        io.sockets.emit("draw_path",data);
    });


    // if server listens an undo/redo action from a connected device
    socket.on("undo_redo",function(data){
        // emit the data to all the connected computers
        io.sockets.emit("undo_redo",data);
    });
});