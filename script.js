
function appendMsg() {
    console.log('It ran...');

    var iframe = document.getElementById("window-frame");
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(Math.random().toString() + ' Hi!!!', "*");
    }
    else
        console.log('It failed....');
}