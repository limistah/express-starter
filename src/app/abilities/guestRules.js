// Rules for guests
const guestRules = () => {
  const actionRules = (can) => {
    can("get", "");
    can("post", "users");
    can("post", "authConfirmToken");
    can("post", "authResendToken");
    can("post", "authForgot");
    can("patch", "authForgot");
    can("post", "auth");
  };
  const fieldRules = (can) => {
    can("post", "User", ["fName", "lName", "phoneNumber", "imgUrl", "email", "displayName"]);

    can("read", "User", [
      "fName",
      "lName",
      "phoneNumber",
      "imgUrl",
      "email",
      "displayName",
      "followersCount",
      "followingCount",
      "createdAt",
      "updatedAt",
      "status",
      "suspensionExpires",
      "loginCount",
      "online"
    ]);
  };

  return {
    actionRules,
    fieldRules
  };
};

module.exports = guestRules;
