import setup from "../../../../src/fixtures/firstFixtures";
import terminalUtils from "../../../../src/utils/terminalUtils";

setup("setup", ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(__filename, testInfo.title, "projectDependency", "setup");
});