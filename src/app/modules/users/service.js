const { User } = require("../../../models/user");
const authorizedItems = require("../../libs/authorizedItems");

exports.findOne = (filter) => User.findOne(filter);
exports.find = (filter) => User.find(filter);
exports.findById = (id) => User.find(id);
exports.create = async (dto) => {
  const user = new User(dto);
  await user.save();
  return user.toJSON();
};
exports.authorizedItems = (ability, object, action = "get") => {
  return authorizedItems(User, ability, action).fieldsPicker(object);
};
