const socket = io()

const form = document.querySelector('form')
const input = form.querySelector('#text')
const btn = form.querySelector('button')
const MessageText = document.querySelector('#message')


//template
const MessageTemplate = document.querySelector('#message-template').innerHTML
const LocationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//option

const { UserName, Room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
// console.log({UserName, Room})


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = e.target.message.value
    btn.setAttribute('disabled', 'disabled')
    // console.log('data submit')
    socket.emit('send', text, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
    btn.removeAttribute('disabled')
    input.value = ''
    input.focus()
})

const LocationBtn = document.getElementById('location')

LocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supoorted by your browser')
    }

    LocationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
        LocationBtn.removeAttribute('disabled')
    })
})

// autoscroll

const autoscroll = () => {
    const newMsg = MessageText.lastElementChild

    //new msg hight
    const newMsgStyle = getComputedStyle(newMsg)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgHeight = newMsg.offsetHeight + newMsgMargin

    //visible height
    const visibleHeight = MessageText.offsetHeight

    //height of msg container
    const containerHeight = MessageText.scrollHeight

    const scrolloffSet = MessageText.scrollTop + visibleHeight

    if(containerHeight - newMsgHeight <= scrolloffSet){
        MessageText.scrollTop = MessageText.scrollHeight
    }
}

//simple function that autoscrolled msg
// const autoscroll = () => {
//     MessageText.scrollTop = MessageText.scrollHeight;
// }



socket.on('message', (data) => {
    // console.log(data)
    const html = Mustache.render(MessageTemplate, {
        UserName: data.UserName,
        message: data.text,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    MessageText.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on('ShareLocation', (data) => {
    // console.log(data)
    const html = Mustache.render(LocationTemplate, {
        UserName: data.UserName,
        url: data.url,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    MessageText.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    // console.log(html)
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', { UserName, Room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})