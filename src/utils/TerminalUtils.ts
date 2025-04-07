import { LogLevel } from "../customTypes/FrameworkTypes";
import path from "path";

export default abstract class TerminalUtils {

    private static RESET = "\x1b[0m";
    private static FG_RED = "\x1b[31m";
    private static FG_GREEN = "\x1b[32m";
    private static FG_YELLOW = "\x1b[33m";
    private static FG_BLUE = "\x1b[34m";
    private static FG_MAGENTA = "\x1b[35m";
    private static FG_WHITE = "\x1b[37m";

    static printHeader() {
        console.log(`|${this.padText("filename")}|${this.padText("title")}|${this.padText("level")}|${this.padText("message")}|${this.RESET}`);
    }

    static printLogLevelMessage(filepath: string, title: string, level: LogLevel, message: string) {
        let textColor: string;
        switch(level) {
            case "test":
                textColor = this.FG_WHITE;
                break;
            case "describe":
                textColor = this.FG_BLUE;
                break;
            case "specFile":
                textColor = this.FG_YELLOW;
                break;
            case "fixture":
                textColor = this.FG_GREEN;
                break;
            case "projectDependency":
                textColor = this.FG_RED;
                break;
            case "reporter":
                textColor = this.FG_MAGENTA;
                break;
        }
        console.log(`${textColor}|${this.padText(path.basename(filepath))}|${this.padText(title)}|${this.padText(level)}|${this.padText(message)}|${this.RESET}`);
    }

    static printColoredText(text: string, color: "red" | "green" | "yellow" | "blue" | "magenta") {
        let textColor: string;
        switch(color) {
            case "blue":
                textColor = this.FG_BLUE;
                break;
            case "yellow":
                textColor = this.FG_YELLOW;
                break;
            case "green":
                textColor = this.FG_GREEN;
                break;
            case "red":
                textColor = this.FG_RED;
                break;
            case "magenta":
                textColor = this.FG_MAGENTA;
                break;
        }
        console.log(`${textColor}${text}${this.RESET}`);
    }

    static clearOutput(outputText: string) {
        return outputText.replaceAll(/(\\x1(b|B))?\[[0-9;]*[mK]/g, "");
    }
    
    private static padText(text: string) {
        const maxLength = 20;
        text = text.substring(0, maxLength);
        const leftPadding = Math.floor((maxLength - text.length) / 2);
        const rightPadding = maxLength - leftPadding - text.length;
        return `${' '.repeat(leftPadding)}${text}${' '.repeat(rightPadding)}`;
    }
}