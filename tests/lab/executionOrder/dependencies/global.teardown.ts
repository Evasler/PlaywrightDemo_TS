import { test as teardown} from "@playwright/test";
import TerminalUtils from "../../../../src/utils/TerminalUtils";

teardown("teardown", async ({}, testInfo) => {
    TerminalUtils.printLogLevelMessage(__filename, testInfo.title, "projectDependency", "teardown");
});