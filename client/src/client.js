const writeEvent = (text) => {
    // <ul> element
    const parent = document.querySelector('#events');
    
    // <li> element
    const el = document.createElement('li');
    el.innerHTML = text;
    
    parent.appendChild(el);
};

const onFormSubmitted = (e) => {
    e.preventDefault();
    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
}

const onClsClicked = (e) => {
    e.preventDefault();

    const parent = document.querySelector("#events")
    parent.innerHTML ="";
}

const sock = io();
document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted)

document
.querySelector('#cls')
.addEventListener('click', onClsClicked)
sock.on('message', writeEvent);