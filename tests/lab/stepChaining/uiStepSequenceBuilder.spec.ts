import { test as uiTest } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

uiTest(TestUtils.buildTestTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .openNewTabInNewContext(pageHelper.blankPage)
    .goToUiTestAutomationPlayground(pageHelper.homePage)
    .clickAjaxData(pageHelper.ajaxDataPage)
    .switchWorkingTab(0, 0, pageHelper.blankPage)
    .goToUiTestAutomationPlayground(pageHelper.homePage)
    .clickAjaxData(pageHelper.ajaxDataPage)
    .execute();
});