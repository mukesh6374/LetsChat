const express = require('express');
const app = express();
const webPush = require('web-push');
var bodyParser = require('body-parser');
const path = require('path');

const http = require('http').Server(app);
const io = require('socket.io')(http);
// VAPID keys should only be generated only once.
//const vapidKeys = webPush.generateVAPIDKeys();
const port = 8081;
const title = "letsChat";
// const requestIp = require('request-ip');
// var router = express.Router();
// app.use(requestIp.mw());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/******************************/
//web push notification


/******************************/

app.get('/',(req,res)=>{
	res.render(__dirname+'/public/chatIndex',{title:title});
});
app.post('/chat',(req,res)=>{

	const data = {
		title : title,
		name  : req.body.username
	};
	res.render(__dirname+'/public/chat',data);
});


/*********** HTTP/Socket.IO Connections ***************/

io.on('connection',function(socket){
	//console.log('connected '+socket.id); //getting socket id
	socket.on('chat',function(msg,person,user,time){
		io.emit('chat',msg,person,user,time);
	});
	socket.on('typing',function(person,user){
		io.emit('typing',person,user);
	});
});

io.on('disconnect',function(){
	console.log('user is disconnected!!!');
});
/********** here always be http connection not app connection ***************/
http.listen(port,function(){
	console.log('Listening at port: '+port);
});