window.addEventListener(
    "message",
    (e) => {
        console.log('Received message');
        document.getElementById('content').innerHTML += `<p> This is appended text: ${Date.now()} ${event.data}</p>`;
    },
    false
);