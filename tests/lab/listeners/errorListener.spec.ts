import extendedTest from "../../../src/fixtures/extendedTest";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/blank/blankSteps";
import testUtils from "../../../src/utils/testUtils";

extendedTest(testUtils.fullTitle(0, "Test failure, because errorListener catches a JS error"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToJsErrorPage();
    await stepSequenceHelper.stepSequence;
});

extendedTest(testUtils.fullTitle(1, "Test failure, because errorListener catches an Error Status code"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToInternalServerErrorPage();
    await stepSequenceHelper.stepSequence;
});

extendedTest(testUtils.fullTitle(2, "Test failure, because errorListener catches a Connection Error"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToConnectionErrorPage();
    await stepSequenceHelper.stepSequence;
});