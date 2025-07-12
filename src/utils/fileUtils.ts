import fs from "fs";

const fileUtils = {

    fileExists(filePath: string) {
        return fs.existsSync(filePath);
    },
    
    readFile(filePath: string) {
        return fs.readFileSync(filePath).toString();
    },
    
    writeFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content);
    },

    makeDirectory(directoryPath: string) {
        fs.mkdirSync(directoryPath);
    }
};

export default fileUtils;