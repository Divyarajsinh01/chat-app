const users = []

const addUser = ({id, UserName, Room}) => {
    UserName = UserName.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    if (!UserName || !Room) {
        return {
            error: 'UserName and Room are required!'
        }
    }

    const existUser = users.find((user) => {
        return user.Room === Room && user.UserName === UserName
    })

    if(existUser){
        return {
            error : 'UserName is already in use!'
        }
    }

    const user = {id, UserName, Room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id == id
    })
    return user
}

const getUsersInRoom = (Room) => {
    Room.trim().toLowerCase()
    return users.filter((user) => {
        return user.Room === Room
    })
}

module.exports = {
    getUser,
    getUsersInRoom,
    addUser,
    removeUser
}

