const express = require('express');
const app = express();
const port = 8080;
const io = require('socket.io').listen(app.listen(port));
const users = {};
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

const getUsers = ((obj) => {
    const userHold = [];
    for(let key in obj) {
        userHold.push(obj[key]);

    }
    return userHold.join(', ');
});

app.get('/', (req, res) => {
    res.render('page');
});
io.sockets.on('connection', (client) => {
        client.on('send', (data) => {
            io.sockets.emit('message', {message: data.message});
        });
        client.on('hello', (data) => {
            console.log(data.name);
            client.set('nick', data.name);
                client.emit('message', {message: 'Welcome ' + data.name});
                client.broadcast.emit('message', {message: data.name + ' join to us'});

                if (Object.keys(users).length > 0) {
                    const userList = getUsers(users);
                    client.emit('message', {message: 'In chat now' + userList});
                } else {
                    client.emit('message', {message: 'Nobody in chat now '});
                }
            users[client.id] = data.name;
        });
        client.on('disconnect', (data) => {
            if (Object.keys(users).length > 1) {
                client.get('nick', (err, name) => {
                    client.broadcast.emit('message', {message:name + ' logout'});
                });
            }
           delete users[client.id];
        });
});
