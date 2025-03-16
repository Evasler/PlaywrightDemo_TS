import { uiTest } from "../../../src/fixtures/uiFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

uiTest(TestUtils.buildTestTitle(0, "Test failure, because ErrorListener catches a JS error"), async({ ui }) => {
    await ui
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToJsErrorPage(ui.pageHelper.errorPage)
    .execute();
});

uiTest(TestUtils.buildTestTitle(1, "Test failure, because ErrorListener catches an Error Status code"), async({ ui }) => {
    await ui
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToInternalServerErrorPage(ui.pageHelper.errorPage)
    .execute();
});

uiTest(TestUtils.buildTestTitle(2, "Test failure, because ErrorListener catches a Connection Error"), async({ ui }) => {
    await ui
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToConnectionErrorPage(ui.pageHelper.errorPage)
    .execute();
});