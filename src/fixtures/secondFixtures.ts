/* eslint @typescript-eslint/no-invalid-void-type: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

import { test as base } from "@playwright/test";
import terminalUtils from "../utils/terminalUtils";
import path from "path";

type TestFixtures = {
    autoTestFixture: void;
    manualTestFixture: void;
};
type WorkerFixtures = {
    autoWorkerFixture: void;
    manualWorkerFixture: void;
    dependencyFixture: void;
};

const test = base.extend<TestFixtures, WorkerFixtures>({
    autoTestFixture: [ async ({}, use, testInfo) => {
        terminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "autoSetup");
        await use();
        terminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "autoTeardown");
    }, { scope: "test", auto: true }],
    manualTestFixture: [ async ({}, use, testInfo) => {
        terminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "manualSetup");
        await use();
        terminalUtils.printLogLevelMessage(path.basename(__filename), testInfo.title, "fixture", "manualTeardown");
    }, { scope: "test" }],
    dependencyFixture: [ async ({}, use, testInfo) => {
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencySetup");
        await use();
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencyTeardown");
    }, {scope: "worker"}],
    autoWorkerFixture: [ async ({ dependencyFixture }, use, testInfo) => {
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoSetup");
        await use();
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoTeardown");
    }, {scope: "worker", auto: true}],
    manualWorkerFixture: [ async ({}, use, testInfo) => {
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualSetup");
        await use();
        terminalUtils.printLogLevelMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualTeardown");
    }, {scope: "worker"}]
});

export default test;