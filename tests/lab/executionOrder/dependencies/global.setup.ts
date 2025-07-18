import setup from "../../../../src/fixtures/firstFixtures.js";
import terminalUtils from "../../../../src/utils/terminalUtils.js";

setup("setup", ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "projectDependency", "setup");
});