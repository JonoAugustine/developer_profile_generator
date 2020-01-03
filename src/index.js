const inq = require("inquirer");
const pdfer = require("html-pdf");
const api = require("./dao");
const templater = require("./templater");

/**
 * Async function to initialize the program
 */
const main = async () => {
  let config = {};
  try {
    /** Attempt to parse the config from the file .config.josn */
    const configRaw = await templater.util.readFile(".config.json", "UTF-8");
    config = JSON.parse(configRaw);
  } catch (e) {
    /** Use Inquirer to get config data */
    let password;
    let { useToken } = await inq.prompt([
      {
        name: "useToken",
        message: "Use environment token (will look for 'GITHUB_TOKEN')?",
        type: "confirm"
      }
    ]);
    if (!useToken) {
      password = (
        await inq.prompt([
          {
            name: "password",
            message: "GitHub password",
            type: "password"
          }
        ])
      ).password;
    }
    let { username, color } = await inq.prompt([
      {
        name: "username",
        message: "GitHub username",
        type: "input"
      },
      {
        name: "color",
        message: "Please choose a color",
        type: "list",
        choices: Object.keys(templater.colors)
      }
    ]);
    config.username = username;
    config.password = password;
    config.color = color;
  }

  const color = templater.colors[config.color];

  // initialize the GitHub API
  if (typeof config.password === "string") api.init(config.username, config.password);
  else api.init(process.env.GITHUB_TOKEN);

  // Get the GH user, profile, and repos
  const user = await api.getUser(config.username);
  const { data: profile } = await user.getProfile();
  const { data: repos } = await user.listRepos();

  // Calculate the number of stars
  const numStars = repos.reduce((acc, cur) => (acc += cur.stargazers_count), 0);

  // Fill the HTML template
  console.log("Filling Template...");
  const filled = await templater.fill({
    username: config.username,
    profileUrl: profile.html_url,
    imageUrl: profile.avatar_url,
    bio: profile.bio,
    numRepos: repos.length,
    numFollowers: (await user.listFollowers()).data.length,
    numFollowing: (await user.listFollowing()).data.length,
    numStars,
    color
  });
  console.log("template complete");

  // Generate PDF from generated HTML String
  pdfer
    .create(filled, { format: "letter" })
    .toFile(`./${config.username}.pdf`, (err, res) => {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.log("PDF created");
      }
    });
};

main();
