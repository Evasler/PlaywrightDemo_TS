import { uiTest } from "../../../src/fixtures/uiFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async({ ui }) => {
    await ui
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToUiTestAutomationPlayground(ui.pageHelper.homePage)
    .clickAjaxData(ui.pageHelper.ajaxDataPage)
    .switchWorkingTab(0, 0, ui.pageHelper.blankPage)
    .goToUiTestAutomationPlayground(ui.pageHelper.homePage)
    .clickAjaxData(ui.pageHelper.ajaxDataPage)
    .execute();
});