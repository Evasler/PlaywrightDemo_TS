import { test as teardown} from "@playwright/test";
import terminalUtils from "../../../../src/utils/terminalUtils";

teardown("teardown", async ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(__filename, testInfo.title, "projectDependency", "teardown");
});