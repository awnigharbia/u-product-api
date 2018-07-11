const { getUserIdSub } = require('../utils')

const newMsgSubscribe = (parent, args, context, info) => {
  const userId = getUserIdSub(context)
  const email = args.filter
  return context.db.subscription.message(
    { where: {
            AND:[
                  { mutation_in: ["CREATED"]}, 
                  { AND: [
                      {OR:[{ node: { sender: { id_contains: userId } }}, 
                          { node: { receiver: { id_contains: userId } }}]},

                      {OR:[{ node: {sender: { email_contains: email}}},
                          { node: {receiver: {email_contains: email}}},
                        ]},
                  ]}
                ]} 
            },
    info
  );
};

const newMsg = {
  subscribe: newMsgSubscribe
};

module.exports = {
  newMsg
};
