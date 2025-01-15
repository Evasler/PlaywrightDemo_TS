import { test } from "../../../../src/fixtures/firstFixtures";
import { expect } from "@playwright/test";
import { TerminalUtils } from "../../../../src/utils/TerminalUtils";

test.beforeAll("fileBeforeAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "beforeAll") });
test.afterAll("fileAfterAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "afterAll") });
test.beforeEach("fileBeforeEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "beforeEach") });
test.afterEach("fileAfterEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "specFile", "afterEach") });

test("[4] fileTest", async ({}, testInfo) => {
    TerminalUtils.printColoredMessage(__filename, testInfo.title, "test", "beforeStep1");
    await test.step("step1", async () => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "test", "step1") });
});
test.describe("describe1", () => {
    test.beforeAll("describeBeforeAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "describe", "beforeAll") });
    test.afterAll("describeAfterAll", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "describe", "afterAll") });
    test.beforeEach("describeBeforeEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "describe", "beforeEach") });
    test.afterEach("describeAfterEach", ({}, testInfo) => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "describe", "afterEach") });
    test("[5] describeTest", async ({ failedTestFixture }, testInfo) => {
        await test.step("step1", async () => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "test", "step1") });
    });
    test("[6] describeTest", async ({}, testInfo) => {
        await test.step("step1", async () => { TerminalUtils.printColoredMessage(__filename, testInfo.title, "test", "step1") });
    });
});