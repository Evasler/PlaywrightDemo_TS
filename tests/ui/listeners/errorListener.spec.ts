import extendedTest from "../../../src/fixtures/extendedTest.js";
import { blankSteps, errorSteps } from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";

extendedTest(testUtils.fullTitle(5, "Expected test failure, due to errorListener detecting a JS error", ["@fullScope"]), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToJsErrorPage(errorSteps)
    ._execute()
});

extendedTest(testUtils.fullTitle(6, "Expected test failure, due to errorListener detecting an Error Status code", ["@fullScope"]), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToInternalServerErrorPage(errorSteps)
    ._execute()
});

extendedTest(testUtils.fullTitle(7, "Expected test failure, due to errorListener detecting a Connection Error", ["@fullScope"]), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToConnectionErrorPage(errorSteps)
    ._execute()
});