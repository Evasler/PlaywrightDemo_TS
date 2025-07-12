import setup from "../../../../src/fixtures/firstFixtures";
import terminalUtils from "../../../../src/utils/terminalUtils";

setup("setup", async ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(__filename, testInfo.title, "projectDependency", "setup");
});