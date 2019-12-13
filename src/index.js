const inq = require("inquirer");
const { api } = require("./dao");
const templater = require("./templater");

const run = async () => {
  let config = {};
  try {
    const configRaw = await templater.util.readFile(".config.json", "UTF-8");
    config = JSON.parse(configRaw);
  } catch (e) {
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

  if (typeof config.password === "string")
    api.init(config.username, config.password);
  else api.init(process.env.GITHUB_TOKEN);

  const user = await api.getUser(config.username);
  const { data: profile } = await user.getProfile();

  const { data: repos } = await user.listRepos();

  const numStars = repos.reduce((acc, cur) => (acc += cur.stargazers_count), 0);

  console.log("Filling Template...");
  const filled = await templater.fill({
    username: config.username,
    profileUrl: profile.url,
    imageUrl: profile.avatar_url,
    numRepos: repos.length,
    numFollowers: (await user.listFollowers()).data.length,
    numFollowing: (await user.listFollowing()).data.length,
    numStars,
    color
  });
  console.log("template complete");

  await templater.util.writeFile("filled.html", filled, "UTF-8");
};

run();
