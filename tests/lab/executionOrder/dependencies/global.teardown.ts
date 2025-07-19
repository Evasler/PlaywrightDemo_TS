import { test as teardown} from "@playwright/test";
import { terminalUtils } from "../../../../src/utils/index.js";

teardown("teardown", ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "projectDependency", "teardown");
});