const { User, Thought } = require("../models");

const resolvers = {
  Query: {
    // get all users
    users: async () => {
      return (
        User.find()
          // omit the Mongoose-specific __v property and the user's password information
          .select("-__v -password")
          .populate("friends")
          .populate("thoughts")
      );
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
  },
};

module.exports = resolvers;
