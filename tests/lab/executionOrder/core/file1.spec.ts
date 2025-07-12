import test from "../../../../src/fixtures/firstFixtures";
import terminalUtils from "../../../../src/utils/terminalUtils";

test.beforeAll("fileBeforeAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "beforeAll") });
test.afterAll("fileAfterAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "afterAll") });
test.beforeEach("fileBeforeEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "beforeEach") });
test.afterEach("fileAfterEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "afterEach") });

test("[1] fileTest", async ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "beforeStep1");
    await test.step("step1", async () => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step1") });
});
test.describe("describe1", () => {
    test.beforeAll("describeBeforeAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "describe", "beforeAll") });
    test.afterAll("describeAfterAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "describe", "afterAll") });
    test.beforeEach("describeBeforeEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "describe", "beforeEach") });
    test.afterEach("describeAfterEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "describe", "afterEach") });
    test("[2] describeTest", async ({ manualTestFixture, manualWorkerFixture }, testInfo) => {
        await test.step("step1", async () => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step1") });
        await test.step("step2", async () => {
            terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step2_1");
            await test.step("nestedStep", async () => terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "nestedStep"));
            terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step2_2");
        });
    });
    test("[3] describeTest", async ({}, testInfo) => {
        await test.step("step1", async () => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step1") });
    });
});