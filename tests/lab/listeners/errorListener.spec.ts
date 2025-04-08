import uiTest from "../../../src/fixtures/uiFixtures";
import TestUtils from "../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(0, "Test failure, because ErrorListener catches a JS error"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToJsErrorPage(ui.pageStepsHelper.errorSteps)
    ._execute();
});

uiTest(TestUtils.fullTitle(1, "Test failure, because ErrorListener catches an Error Status code"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToInternalServerErrorPage(ui.pageStepsHelper.errorSteps)
    ._execute();
});

uiTest(TestUtils.fullTitle(2, "Test failure, because ErrorListener catches a Connection Error"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToConnectionErrorPage(ui.pageStepsHelper.errorSteps)
    ._execute();
});