const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMsg, geneateLocationMsg } = require('../src/utils/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')

const app = express()

const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = socketio(server)

const DirPath = path.join(__dirname, '../public')

app.use(express.static(DirPath))



io.on('connection', (socket) => {
    console.log("New web-socket in connected")
    
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({id : socket.id, ...options})
        if(error){
            return callback(error)
        }

        // console.log(user)

        socket.join(user.Room)

        socket.emit('message', generateMsg('Admin', 'welcome!'))
        socket.broadcast.to(user.Room).emit('message', generateMsg('Admin', `${user.UserName} has joined!`))
        io.to(user.Room).emit('roomData',{
            room :user.Room,
            users : getUsersInRoom(user.Room)
        })
        callback()
    })

    socket.on('send',(text,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(text)){
            return callback('this message is not allowed!')
        }
        io.to(user.Room).emit('message', generateMsg(user.UserName, text))
        callback()
    })

    socket.on('sendLocation', (coords,callback) => {
        const user = getUser(socket.id)
        io.to(user.Room).emit('ShareLocation', geneateLocationMsg(user.UserName, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () =>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.Room).emit('message', generateMsg('Admin',`${user.UserName} left!`))
            io.to(user.Room).emit('roomData', {
                room: user.Room,
                users: getUsersInRoom(user.Room)
            })
        }
    })

})

server.listen(port,()=>{
    console.log(`server running on ${port}`)
})