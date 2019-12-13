const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "green",
    headerColor: "black",
    photoBorderColor: "black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};

const template = async () => await readFile("./src/template.html", "UTF-8");

/**
 *
 * @param {*} data
 * @param {string} toFill
 * @returns {string} filled HTML template as string
 */
const fill = async (data, toFill) => {
  if (typeof toFill === "undefined") toFill = await template();

  for (const k in data) {
    if (typeof data[k] === "object") toFill = fill(data[k], toFill);
    else toFill = toFill.replace(new RegExp(`_${k}_`, "gmi"), data[k]);
  }

  return toFill;
};

module.exports = { fill, colors, util: { readFile, writeFile } };
