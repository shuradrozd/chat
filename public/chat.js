
window.onload = () => {
    const socket = io.connect('http://localhost:8080');
    const field = document.getElementById('field');
    const form = document.getElementById('form');
    const content = document.getElementById('content');

    form.onsubmit = () => {
        const text = field.value;
        socket.emit('send', {message: text});
        return false;
    };
    const messages = [];

    const myName = prompt('Please enter your name', 'guest');

    socket.emit('hello', {name: myName});

      socket.on('message', (data) => {

          let html = '';
          if (data.message) {
            messages.push(data.message);

            messages.forEach((msg) => {
                html += `${msg}<br/>`;
            });
            content.innerHTML = html;
          } else {
              console.log('errorW');
          }
      })


};

window.onunload = () => {
    socket.disconnect();
};