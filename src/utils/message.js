const generateMsg = (UserName,text) => {
    return {
        UserName,
        text,
        createdAt : new Date().getTime()
    }
}

const geneateLocationMsg = (UserName, url) => {
      return {
        UserName,
        url,
        createdAt : new Date().getTime()
      }
}

module.exports = {
    generateMsg,
    geneateLocationMsg
}