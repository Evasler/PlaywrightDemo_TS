import { test } from "../../../../src/fixtures/secondFixtures";
import { TerminalUtils } from "../../../../src/utils/TerminalUtils";

test.beforeAll("fileBeforeAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "beforeAll") });
test.afterAll("fileAfterAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "afterAll") });
test.beforeEach("fileBeforeEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "beforeEach") });
test.afterEach("fileAfterEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "afterEach") });

test("[7] fileTest", async ({}, testInfo) => {
    await test.step("step1", async () => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "test", "step1") });
});