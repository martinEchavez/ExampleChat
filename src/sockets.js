const Chat = require('./models/Chat');

const socket = (io) => {

    let users = {};

    io.on('connection', async socket => {
        console.log('New user connected')

        const messages = await Chat.find({}).limit(10);
        socket.emit('load old msgs', messages);

        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNickname();
            }
        })

        // receive a message a broadcasting
        socket.on('send message', async (data, cb) => {
            var msg = data.trim();

            if (msg.substr(0, 3) === '/p ') {
                msg = msg.substr(3);
                var index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Ingresa un usuario valido');
                    }
                } else {
                    cb('Por favor ingresa tu mensaje');
                }
            } else {
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNickname();
        })

        const updateNickname = () => {
            io.sockets.emit('usernames', Object.keys(users))
        }

    });
}

module.exports = socket;