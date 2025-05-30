import { test as base, expect } from "@playwright/test";
import TerminalUtils from "../utils/TerminalUtils";
import path from "path";

type TestFixtures = {
    autoTestFixture: void;
    manualTestFixture: void;
    failedTestFixture: void;
};
type WorkerFixtures = {
    autoWorkerFixture: void;
    manualWorkerFixture: void;
    dependencyFixture: void;
};

const test = base.extend<TestFixtures, WorkerFixtures>({
    autoTestFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "autoSetup");
        await use();
        TerminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "autoTeardown");
    }, { scope: "test", auto: true }],
    manualTestFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "manualSetup");
        await use();
        TerminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "manualTeardown");
    }, { scope: "test" }],
    failedTestFixture: [ async ({}, use) => {
        await use();
        expect(false, "Forced fail").toBeTruthy();
    }, { scope: "test" }],
    dependencyFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencySetup");
        await use();
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencyTeardown");
    }, {scope: "worker"}],
    autoWorkerFixture: [ async ({ dependencyFixture }, use, testInfo) => {
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoSetup");
        await use();
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoTeardown");
    }, {scope: "worker", auto: true}],
    manualWorkerFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualSetup");
        await use();
        TerminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualTeardown");
    }, {scope: "worker"}]
});

export default test;