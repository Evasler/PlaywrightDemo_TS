import test from "../../../../src/fixtures/secondFixtures";
import terminalUtils from "../../../../src/utils/terminalUtils";

test.beforeAll("fileBeforeAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "beforeAll") });
test.afterAll("fileAfterAll", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "afterAll") });
test.beforeEach("fileBeforeEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "beforeEach") });
test.afterEach("fileAfterEach", ({}, testInfo) => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "specFile", "afterEach") });

test("[7] fileTest", async ({}, testInfo) => {
    await test.step("step1", () => { terminalUtils.printLogLevelMessage(__filename, testInfo.title, "test", "step1") });
});