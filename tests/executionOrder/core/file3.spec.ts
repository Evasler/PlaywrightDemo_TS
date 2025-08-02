import test from "../../../src/fixtures/secondFixtures.js";
import { terminalUtils } from "../../../src/utils/index.js";

test.beforeAll("fileBeforeAll", ({}, testInfo) => {
  terminalUtils.printLogLevelMessage(
    import.meta.filename,
    testInfo.title,
    "specFile",
    "beforeAll",
  );
});
test.afterAll("fileAfterAll", ({}, testInfo) => {
  terminalUtils.printLogLevelMessage(
    import.meta.filename,
    testInfo.title,
    "specFile",
    "afterAll",
  );
});
test.beforeEach("fileBeforeEach", ({}, testInfo) => {
  terminalUtils.printLogLevelMessage(
    import.meta.filename,
    testInfo.title,
    "specFile",
    "beforeEach",
  );
});
test.afterEach("fileAfterEach", ({}, testInfo) => {
  terminalUtils.printLogLevelMessage(
    import.meta.filename,
    testInfo.title,
    "specFile",
    "afterEach",
  );
});

test("[7] fileTest", async ({}, testInfo) => {
  await test.step("step1", () => {
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      testInfo.title,
      "test",
      "step1",
    );
  });
});
