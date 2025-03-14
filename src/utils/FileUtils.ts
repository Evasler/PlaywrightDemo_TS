import fs from "fs";

export function fileExists(filePath: string) {
    return fs.existsSync(filePath);
}

export function readFile(filePath: string) {
    return fs.readFileSync(filePath).toString();
}

export function writeFile(filePath: string, content: string) {
    fs.writeFileSync(filePath, content);
}