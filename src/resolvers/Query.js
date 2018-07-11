const { getUserId } = require('../utils')
const users = (parent, args, context, info) => context.db.query.users({}, info);
const projects = (parent, args, context, info) =>
  context.db.query.projects({}, info);
const messages = (parent, args, context, info) =>
  context.db.query.messages({}, info);
const infoes = (parent, args, context, info) =>
  context.db.query.infoes({}, info);
const vistors = (parent, args, context, info) =>
  context.db.query.vistors({}, info);

const currentUser = (parent, args, context, info) => {
  const id = getUserId(context);
  const where = id ?
    {
      OR: [{ id_contains: id }]
    } : {}

  return context.db.query.users(
    { where },
    info
  )
}

// get specific items with filter
const user = (parent, args, context, info) => {
  const where = args.filter
    ? {
      OR: [{ id_contains: args.filter }, { name_contains: args.filter }]
    }
    : {};

  return context.db.query.users(
    { where, first: args.first, skip: args.skip, orderBy: args.orderBy },
    info
  );
};

const project = (parent, args, context, info) => {
  const where = args.filter
    ? {
      OR: [
        { name_contains: args.filter },
        { description_contains: args.filter },
        { state_contains: args.filter }
      ]
    }
    : {};

  return context.db.query.projects(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    info
  );
};

const info = (parent, args, context, info) => {
  const where = args.filter
    ? {
      OR: [
        { os_contains: args.filter },
        { browser_contains: args.filter },
        { device_contains: args.filter }
      ]
    }
    : {};

  return context.db.query.infoes(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    info
  );
};

const vistor = (parent, args, context, info) => {
  const where = args.filter
    ? {
      OR: [{ city_contains: args.filter }]
    }
    : {};

  return context.db.query.vistors({ where }, info);
};

const msg = (parent, args, context, info) => {
  const id = getUserId(context);

  const where = args.filter
    ? {
      AND: [
        {
          OR: [
            { sender: { id_contains: id } },
            { receiver: { id_contains: id } },
          ]
        },
        {
          OR: [
            { sender: { email_contains: args.filter } },
            { receiver: { email_contains: args.filter } },
          ]
        }
      ]
    }
    : {}

  return context.db.query.messages(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    info
  );
};

module.exports = {
  currentUser,
  users,
  user,
  projects,
  project,
  messages,
  msg,
  infoes,
  info,
  vistors,
  vistor
};
