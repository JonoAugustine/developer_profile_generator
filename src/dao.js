const GHApi = require("github-api");

let dao;

/**
 * Initialize the GitHub API connection with a token or username & password.
 * @param {string} token_xor_username GitHub API token XOR github username.
 * @param {string} password GitHub password (only usefull if you pass the username in)
 */
const init = (token_xor_username, password) => {
  dao = new GHApi(
    typeof password === "string"
      ? { username: token_xor_username, password }
      : { token: token_xor_username }
  );
};

/**
 * Get the user from the GitHub API.
 * @param {string} username GitHub username
 */
const getUser = async username => {
  try {
    return dao.getUser(username);
  } catch (e) {
    console.log("user not found");
    process.exit(1);
  }
};

module.exports = { init, getUser };
