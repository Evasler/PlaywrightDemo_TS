import { test as setup } from "../../../../src/fixtures/firstFixtures";
import { TerminalUtils } from "../../../../src/utils/TerminalUtils";

setup("setup", async ({}, testInfo) => {
    TerminalUtils.printColoredMessage(__filename, testInfo.title, "projectDependency", "setup");
});