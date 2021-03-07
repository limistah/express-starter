const _ = require("lodash");
const { toMongoQuery } = require("@casl/mongoose");
const getRules = (model, fieldsAbility, action, data, id) => {
  const readableFields = model.accessibleFieldsBy(fieldsAbility, action);
  const fieldsPicker = (items) => pickReadableFields(readableFields, items);
  // Pick the fields that can be updated/patched/created by the user role
  const selectedFields = data ? fieldsPicker(data) : [];
  // Form a usable mongo query using the model name
  const query = toMongoQuery(fieldsAbility, model.modelName, action);
  return {
    mongoQuery: query,
    readableFields,
    selectedFields,
    fieldsPicker: fieldsPicker
  };
};

const pickReadableFields = (readableFields, items) => {
  let returnItems;
  if (Array.isArray(items)) {
    returnItems = _.map(items, _.partialRight(_.pick, readableFields));
  } else {
    returnItems = _.pick(items, readableFields);
  }
  return returnItems;
};

module.exports = getRules;
