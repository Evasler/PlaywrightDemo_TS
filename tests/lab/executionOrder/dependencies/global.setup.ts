import { test as setup } from "../../../../src/fixtures/firstFixtures";
import { TerminalUtils } from "../../../../src/utils/TerminalUtils";

setup("setup", async ({}, testInfo) => {
    TerminalUtils.printLogLevelMessage(__filename, testInfo.title, "projectDependency", "setup");
});