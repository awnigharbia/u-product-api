const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

// sign up function
async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);
  // 2
  const user = await context.db.mutation.createUser(
    {
      data: {
        name: args.name,
        city: args.city,
        email: args.email,
        uni: args.uni,
        admin: args.admin,
        password: password,
        project: { create: args.project }
      }
    },
    `{ id }`
  );

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.db.query.user(
    { where: { email: args.email } },
    ` { id password } `
  );
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user
  };
}

// creating new project with the authenticated user
const newProject = (parent, args, context, info) => {
  const userId = getUserId(context);
  return context.db.mutation.createProject(
    {
      data: {
        name: args.name,
        description: args.description,
        lang: args.lang,
        state: args.state,
        owner: { connect: { id: userId } }
      }
    },
    info
  );
};

const newInfo = (parent, args, context, info) => {
  const userId = getUserId(context);
  return context.db.mutation.createInfo(
    {
      data: {
        device: args.device,
        browser: args.browser,
        os: args.os,
        ip: args.ip,
        userAgent: args.userAgent,
        user: { connect: { id: userId } }
      }
    },
    info
  );
};

const newMsg = (parent, args, context, info) => {
  const userId = getUserId(context);
  const emai = args.email || '';
  console.log(emai)
  return userId !== 'cjjh6jszn00110843am5x4d6o' ?
    context.db.mutation.createMessage(
      {
        data: {
          sender: { connect: { id: userId } },
          receiver: { connect: { email: "support@support.com" } },
          body: args.body,
          send: args.send,
        }
      },
      info
    ) : context.db.mutation.createMessage(
      {
        data: {
          sender: { connect: { id: userId } },
          receiver: { connect: { email: emai } },
          send: args.send,
          body: args.body,
        }
      },
      info
    )
};


const newVistor = (parent, args, context, info) => {
  const userId = getUserId(context);
  return context.db.mutation.createVistor(
    {
      data: {
        device: args.device,
        browser: args.browser,
        os: args.os,
        ip: args.ip,
        city: args.city,
        userAgent: args.userAgent
      }
    },
    info
  );
};

module.exports = {
  signup,
  login,
  newProject,
  newInfo,
  newMsg,
  newVistor
};
