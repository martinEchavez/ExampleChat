$(() => {
    const socket = io();

    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $('#nickForm');
    const nickname = $('#nickname');
    const nickError = $('#nickError');

    const users = $('#usernames');

    nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                nickError.html(`
                    <div class="alert alert-danger">
                        El usuario ya existe
                    </div>
                `)
            }
            nickname.val('');
        })
    })

    messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', messageBox.val(), data => {
            chat.append(`<p class="error">${data}</p>`)
        });
        messageBox.val('');
    })

    socket.on('new message', (data) => {
        displayMsg(data);
    })

    socket.on('usernames', (data) => {
        let html = '';
        for (let index = 0; index < data.length; index++) {
            html += `<p><i class="fas fa-user"></i> ${data[index]}</p>`
        }
        users.html(html)
    })

    socket.on('whisper', data => {
        chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    })

    socket.on('load old msgs', msgs => {
        for (let i = msgs.length - 1; i >= 0; i--) {
            displayMsg(msgs[i]);
        }
    });

    const displayMsg = (data) => {
        chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    }

})