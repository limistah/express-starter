const config = require("config");

// Set paginate data and the sort to default if not set
function middleware(req, res, next) {
  if (req.method === "GET") {
    // The maximum value a paginate limit can be
    const $maxLimit = config.get("paginateMaximumLimit");

    const $paginate = config.get("paginate"); // limit, skip
    const query = req.query;
    // Pluck the skip and limit
    let limit = parseInt(typeof query.limit === "string" ? query.limit : $paginate.limit, 10);

    // Sets the skip to include the skipped pages and the limit
    let skip = parseInt(typeof query.skip === "string" ? query.skip : $paginate.skip, 10);

    limit = parseInt(limit, 10);
    if (limit > $maxLimit) {
      limit = $maxLimit;
    }
    let sort = query.sort || "";
    // Maps all the sorted values to object splitted by comma
    if (sort) {
      let obj = {};
      sort.split(",").map((value) => {
        value = value.trim().split(":");
        obj[value[0]] = value[1] || 1;
      });
      sort = obj;
    }
    let onlyDeleted = req.query.onlyDeleted;
    // Only set deletedAt if the client specifies that deletedAt should be ignored when making query
    query.deletedAt = -1;
    if (onlyDeleted && onlyDeleted === "true") {
      // Load all undeleted
      query.deletedAt = { $gt: 0 };
    }
    delete query.ignoreDeletedAt;

    req.query = { ...query, limit, skip, sort };
  }
  next();
}

module.exports = () => middleware;
