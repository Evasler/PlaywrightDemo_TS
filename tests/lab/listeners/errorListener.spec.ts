import uiTest from "../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/Blank/BlankSteps";
import testUtils from "../../../src/utils/testUtils";

uiTest(testUtils.fullTitle(0, "Test failure, because errorListener catches a JS error"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToJsErrorPage();
    await stepSequenceHelper.stepSequence;
});

uiTest(testUtils.fullTitle(1, "Test failure, because errorListener catches an Error Status code"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToInternalServerErrorPage();
    await stepSequenceHelper.stepSequence;
});

uiTest(testUtils.fullTitle(2, "Test failure, because errorListener catches a Connection Error"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToConnectionErrorPage();
    await stepSequenceHelper.stepSequence;
});