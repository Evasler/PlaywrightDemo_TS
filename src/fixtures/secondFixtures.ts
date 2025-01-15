import { test as base } from "@playwright/test";
import { TerminalUtils } from "../utils/TerminalUtils";
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

export const test = base.extend<TestFixtures, WorkerFixtures>({
    autoTestFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printColoredMessage(path.basename(__filename), testInfo.title, "fixture", "autoSetup");
        await use();
        TerminalUtils.printColoredMessage(path.basename(__filename), testInfo.title, "fixture", "autoTeardown");
    }, { scope: "test", auto: true }],
    manualTestFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printColoredMessage(path.basename(__filename), testInfo.title, "fixture", "manualSetup");
        await use();
        TerminalUtils.printColoredMessage(path.basename(__filename), testInfo.title, "fixture", "manualTeardown");
    }, { scope: "test" }],
    dependencyFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencySetup");
        await use();
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "dependencyTeardown");
    }, {scope: "worker"}],
    autoWorkerFixture: [ async ({ dependencyFixture }, use, testInfo) => {
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoSetup");
        await use();
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "autoTeardown");
    }, {scope: "worker", auto: true}],
    manualWorkerFixture: [ async ({}, use, testInfo) => {
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualSetup");
        await use();
        TerminalUtils.printColoredMessage(path.basename(__filename), `worker ${testInfo.workerIndex}`, "fixture", "manualTeardown");
    }, {scope: "worker"}]
});