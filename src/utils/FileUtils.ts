import fs from "fs";

export default abstract class FileUtils {

    static fileExists(filePath: string) {
        return fs.existsSync(filePath);
    }
    
    static readFile(filePath: string) {
        return fs.readFileSync(filePath).toString();
    }
    
    static writeFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content);
    }
}