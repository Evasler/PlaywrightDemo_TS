import type { LogLevel } from "../types/index.js";
import path from "path";

const reset = "\x1b[0m";
const fg_red = "\x1b[31m";
const fg_green = "\x1b[32m";
const fg_yellow = "\x1b[33m";
const fg_blue = "\x1b[34m";
const fg_magenta = "\x1b[35m";
const fg_white = "\x1b[37m";

function _padText(text: string) {
  const maxLength = 20;
  text = text.substring(0, maxLength);
  const leftPadding = Math.floor((maxLength - text.length) / 2);
  const rightPadding = maxLength - leftPadding - text.length;
  return `${" ".repeat(leftPadding)}${text}${" ".repeat(rightPadding)}`;
}

const terminalUtils = {
  printHeader() {
    console.log(
      `|${_padText("filename")}|${_padText("title")}|${_padText("level")}|${_padText("message")}|${reset}`,
    );
  },

  printLogLevelMessage(
    filepath: string,
    title: string,
    level: LogLevel,
    message: string,
  ) {
    let textColor: string;
    switch (level) {
      case "test":
        textColor = fg_white;
        break;
      case "describe":
        textColor = fg_blue;
        break;
      case "specFile":
        textColor = fg_yellow;
        break;
      case "fixture":
        textColor = fg_green;
        break;
      case "projectDependency":
        textColor = fg_red;
        break;
      case "reporter":
        textColor = fg_magenta;
        break;
    }
    console.log(
      `${textColor}|${_padText(path.basename(filepath))}|${_padText(title)}|${_padText(level)}|${_padText(message)}|${reset}`,
    );
  },

  printColoredText(
    text: string,
    color: "red" | "green" | "yellow" | "blue" | "magenta",
  ) {
    let textColor: string;
    switch (color) {
      case "blue":
        textColor = fg_blue;
        break;
      case "yellow":
        textColor = fg_yellow;
        break;
      case "green":
        textColor = fg_green;
        break;
      case "red":
        textColor = fg_red;
        break;
      case "magenta":
        textColor = fg_magenta;
        break;
    }
    console.log(`${textColor}${text}${reset}`);
  },

  clearOutput(outputText: string) {
    return outputText.replaceAll(/(\\x1(b|B))?\[[0-9;]*[mK]/g, "");
  },
};

export default terminalUtils;
