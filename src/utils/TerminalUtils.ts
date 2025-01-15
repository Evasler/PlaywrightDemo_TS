import path from "path";

type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";

export class TerminalUtils {

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

    static printColoredMessage(filepath: string, title: string, level: LogLevel, message: string) {
        let messageColor: string;
        switch(level) {
            case "test":
                messageColor = this.FG_WHITE;
                break;
            case "describe":
                messageColor = this.FG_BLUE;
                break;
            case "specFile":
                messageColor = this.FG_YELLOW;
                break;
            case "fixture":
                messageColor = this.FG_GREEN;
                break;
            case "projectDependency":
                messageColor = this.FG_RED;
                break;
            case "reporter":
                messageColor = this.FG_MAGENTA;
                break;
        }
        console.log(`${messageColor}|${this.padText(path.basename(filepath))}|${this.padText(title)}|${this.padText(level)}|${this.padText(message)}|${this.RESET}`);
    }

    private static padText(text: string) {
        const maxLength = 20;
        text = text.substring(0, maxLength);
        const leftPadding = Math.floor((maxLength - text.length) / 2);
        const rightPadding = maxLength - leftPadding - text.length;
        return `${' '.repeat(leftPadding)}${text}${' '.repeat(rightPadding)}`;
    }
}