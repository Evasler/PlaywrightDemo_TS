import { LogLevel } from "../customTypes/FrameworkTypes";
import path from "path";

export default abstract class TerminalUtils {

    private static _RESET = "\x1b[0m";
    private static _FG_RED = "\x1b[31m";
    private static _FG_GREEN = "\x1b[32m";
    private static _FG_YELLOW = "\x1b[33m";
    private static _FG_BLUE = "\x1b[34m";
    private static _FG_MAGENTA = "\x1b[35m";
    private static _FG_WHITE = "\x1b[37m";

    static printHeader() {
        console.log(`|${this._padText("filename")}|${this._padText("title")}|${this._padText("level")}|${this._padText("message")}|${this._RESET}`);
    }

    static printLogLevelMessage(filepath: string, title: string, level: LogLevel, message: string) {
        let textColor: string;
        switch(level) {
            case "test":
                textColor = this._FG_WHITE;
                break;
            case "describe":
                textColor = this._FG_BLUE;
                break;
            case "specFile":
                textColor = this._FG_YELLOW;
                break;
            case "fixture":
                textColor = this._FG_GREEN;
                break;
            case "projectDependency":
                textColor = this._FG_RED;
                break;
            case "reporter":
                textColor = this._FG_MAGENTA;
                break;
        }
        console.log(`${textColor}|${this._padText(path.basename(filepath))}|${this._padText(title)}|${this._padText(level)}|${this._padText(message)}|${this._RESET}`);
    }

    static printColoredText(text: string, color: "red" | "green" | "yellow" | "blue" | "magenta") {
        let textColor: string;
        switch(color) {
            case "blue":
                textColor = this._FG_BLUE;
                break;
            case "yellow":
                textColor = this._FG_YELLOW;
                break;
            case "green":
                textColor = this._FG_GREEN;
                break;
            case "red":
                textColor = this._FG_RED;
                break;
            case "magenta":
                textColor = this._FG_MAGENTA;
                break;
        }
        console.log(`${textColor}${text}${this._RESET}`);
    }

    static clearOutput(outputText: string) {
        return outputText.replaceAll(/(\\x1(b|B))?\[[0-9;]*[mK]/g, "");
    }
    
    private static _padText(text: string) {
        const maxLength = 20;
        text = text.substring(0, maxLength);
        const leftPadding = Math.floor((maxLength - text.length) / 2);
        const rightPadding = maxLength - leftPadding - text.length;
        return `${' '.repeat(leftPadding)}${text}${' '.repeat(rightPadding)}`;
    }
}