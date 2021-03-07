const { User } = require("../../../models/user");
const { LoginRecord } = require("../../../models/loginRecord");
const authorizedItems = require("../../libs/authorizedItems");

exports.findOne = (filter) => User.findOne(filter);
exports.find = (filter) => User.find(filter);
exports.updateById = (id, update = {}, options = {}) => User.findByIdAndUpdate(id, update, options);
exports.findById = (id) => User.find(id);
exports.create = async (dto) => {
  const user = new User(dto);
  await user.save();
  return user.toJSON();
};
exports.authorizedItems = (ability, object, action = "get") => {
  return authorizedItems(User, ability, action).fieldsPicker(object);
};

exports.registerLoginDetails = async (userId, userAgent, userIp) => {
  const record = new LoginRecord({ userId, userAgent, userIp });
  await record.save();
  return record.toJSON();
};
