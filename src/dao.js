const GHApi = require("github-api");

let dao;

const init = (token_xor_username, password) => {
  dao = new GHApi(
    typeof password === "string"
      ? { username: token_xor_username, password }
      : { token: token_xor_username }
  );
};

const getUser = async username => {
  try {
    return dao.getUser(username);
  } catch (e) {
    console.log("user not found");
    process.exit(1);
  }
};

module.exports = { api: { init, getUser } };
