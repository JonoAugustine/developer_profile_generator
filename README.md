# Developer Profile Generator

Command-line application that dynamically generates a PDF profile from a GitHub username.

## Running

To run the CLI, navigate to the root project directory and run
`npm start`. You will be prompted to use either a github personal
token in your systen env or to manually enter your username and password.
You can then select a color pallet and hit submit. Your PDF will be saved
to a file in the root directory. You can optionally setup a file in the root
dir `.config.json` to skip the promopts.

## Dependencies

- inquirer
- html-pdf
- github-api

### GNU GENERAL PUBLIC LICENSE
