const uname = document.querySelector('#username');
const pword = document.querySelector('#password');
const message = document.querySelector('#message');

let username = '';
let email = '';
let password = '';

document.querySelector('#login').addEventListener('click', async () => {
    if (uname.value.includes('@')) {
        email = uname.value;
    } else {
        username = uname.value;
    }
    password = pword.value;

    // fetch('http://localhost:1830/users/login', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ 'username': username, 'email': email, 'password': password })
    // })
    //     .then(response => response.json())
    //     .then(response => console.log(JSON.stringify(response)));
    const res = await fetch('http://localhost:1830/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'username': username, 'email': email, 'password': password })
    });

    const body = await res.json();
    if(body.error){
        message.textContent = body.error;
        return;
    }

    location = `http://localhost:1830/dashboard?id=${body.id}`;
});
