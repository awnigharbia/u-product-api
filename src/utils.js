const jwt = require('jsonwebtoken')
const APP_SECRET = 'mysecret123'

const getUserId = (context) => {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}


// cause context subscription is availbe in ctx.connection.context  instead of ctx.request
const getUserIdSub = (context) => {
  const a = context.connection.context
  const Authorization = context.connection.context.Authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
  getUserIdSub,
}