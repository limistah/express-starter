const authorizedItems = require("./authorizedItems");
// getProcessor - Used as query processor by getAllUsers route
const getProcessor = async (Model, query, skip, limit, sort, ability, populate, action = "get") => {
  // const total = await model.
  let documentQuery = Model.find(query)
    .skip(skip * limit)
    .limit(limit)
    .sort(sort);

  if (Array.isArray(populate)) {
    for (let i = 0; i < populate.length; i++) {
      documentQuery.populate(populate[i]);
    }
  }
  let data = await documentQuery.exec();
  const authItems = authorizedItems(Model, ability, action);

  // Modify the result picking just the allowed fields in the rule
  data = authItems.fieldsPicker(data);

  let total = await Model.countDocuments(query).exec(); //Count the total number of users found
  const page = skip + 1;
  const items = data.length;
  return { data, total, limit, page, skip, items, statusCode: 200 };
};

async function getSingleProcessor(
  res,
  req,
  Model,
  idKey,
  name,
  populate,
  notfoundCode,
  deletedCode
) {
  const id = req.params[idKey];
  let query = Model.findById(id);
  if (Array.isArray(populate)) {
    for (let i = 0; i < populate.length; i++) {
      query.populate(populate[i]);
    }
  }
  let doc = await query.exec();
  if (!doc) {
    return {
      status: 404,
      body: {
        error: {
          msg: `${name} with an id "${id}" can not be found`,
          code: notfoundCode
        },
        statusCode: 404
      }
    };
  }

  if (doc.deletedAt && doc.deletedAt > -1) {
    return {
      status: 404,
      body: {
        error: {
          msg: `${name} with ${id} is already deleted`,
          code: deletedCode
        },
        statusCode: 404
      }
    };
  }
  // Pull the ability rules from the request object
  const { fieldsAbility } = req.abilities;

  // fields to be picked from the options collection
  const optAbility = authorizedItems(Model, fieldsAbility, "get");
  // Modify the result picking just the allowed fields in the rule
  const data = optAbility.fieldsPicker(doc);
  return { status: 200, body: { data, statusCode: 200 } };
}

const postProcessor = async (Model, data, ability, populate) => {
  let forPosting = new Model(data);
  if (Array.isArray(populate)) {
    for (let i = 0; i < populate.length; i++) {
      forPosting.populate(populate[i]);
    }
    await forPosting.execPopulate();
  }
  await forPosting.save();
  // Always return fields that are opened to the current user
  const authItems = authorizedItems(Model, ability, "get");
  return authItems.fieldsPicker(forPosting);
};
//deleteProcessor - Used in src/controller/users.js file, deleteUser function
const deleteProcessor = async (Model, id, fieldsAbility, msgField, populate = [], notFoundCode) => {
  // 1. Find and update the data setting removed to -1
  let data = await Model.findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true }).populate(
    populate
  );

  // 2. Throws 404 notfound if there is no record found with the id
  if (!data) {
    return {
      status: 404,
      error: {
        error: {
          msg: `${msgField} with id ${id} not found`,
          code: notFoundCode
        },
        statusCode: 404
      }
    };
  }
  // 3. Get the readable fields for return data
  const authItems = authorizedItems(Model, fieldsAbility, "get");
  data = authItems.fieldsPicker(data);

  return { statusCode: 200, data };
};

//for mobile
const getProcessor2 = async (
  Model,
  query,
  skip,
  limit,
  sort,
  // ability,
  populate,
  action = "get"
) => {
  // const total = await model.
  let documentQuery = Model.find(query)
    .skip(skip * limit)
    .limit(limit)
    .sort(sort)
    .select("username");
  if (Array.isArray(populate)) {
    for (let i = 0; i < populate.length; i++) {
      documentQuery.populate(populate[i]);
    }
  }
  let data = await documentQuery.exec();
  // const authItems = authorizedItems(Model, ability, action);

  // // Modify the result picking just the allowed fields in the rule
  // data = authItems.fieldsPicker(data);

  let total = await Model.countDocuments(query).exec();
  const page = skip + 1;
  const items = data.length;
  return { data, total, limit, page, skip, items, statusCode: 200 };
};

module.exports = {
  deleteProcessor,
  postProcessor,
  getProcessor,
  getSingleProcessor,
  getProcessor2
};
