import fs from "fs";

export function fileExists(filePath: string) {
    return fs.existsSync(filePath);
}