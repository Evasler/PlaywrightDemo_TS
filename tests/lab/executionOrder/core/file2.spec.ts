import test from "../../../../src/fixtures/firstFixtures.js";
import { terminalUtils } from "../../../../src/utils/index.js";

test.beforeAll("fileBeforeAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "specFile", "beforeAll") });
test.afterAll("fileAfterAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "specFile", "afterAll") });
test.beforeEach("fileBeforeEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "specFile", "beforeEach") });
test.afterEach("fileAfterEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "specFile", "afterEach") });

test("[4] fileTest", async ({}, testInfo) => {
    terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "test", "beforeStep1");
    await test.step("step1", () => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "test", "step1") });
});
test.describe("describe1", () => {
    test.beforeAll("describeBeforeAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "describe", "beforeAll") });
    test.afterAll("describeAfterAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "describe", "afterAll") });
    test.beforeEach("describeBeforeEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "describe", "beforeEach") });
    test.afterEach("describeAfterEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "describe", "afterEach") });
    test("[5] describeTest", async ({ failedTestFixture }, testInfo) => {  // eslint-disable-line @typescript-eslint/no-unused-vars
        await test.step("step1", () => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "test", "step1") });
    });
    test("[6] describeTest", async ({}, testInfo) => {
        await test.step("step1", () => { terminalUtils.printLogLevelMessage(import.meta.filename, testInfo.title, "test", "step1") });
    });
});