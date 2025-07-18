import extendedTest from "../../../src/fixtures/extendedTest.js";
import blankSteps from "../../../src/pages/blank/blankSteps.js";
import errorSteps from "../../../src/pages/error/errorSteps.js";
import testUtils from "../../../src/utils/testUtils.js";

extendedTest(testUtils.fullTitle(0, "Test failure, because errorListener catches a JS error"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToJsErrorPage(errorSteps)
    ._execute()
});

extendedTest(testUtils.fullTitle(1, "Test failure, because errorListener catches an Error Status code"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToInternalServerErrorPage(errorSteps)
    ._execute()
});

extendedTest(testUtils.fullTitle(2, "Test failure, because errorListener catches a Connection Error"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToConnectionErrorPage(errorSteps)
    ._execute()
});