import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test(TestUtils.buildTestTitle(0, "Chained POM | StepSequenceBuilder"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext_SS(pageHelper.blankPage)
    .goToUiTestAutomationPlayground_SS(pageHelper.homePage)
    .clickAjaxData_SS(pageHelper.ajaxDataPage)
    .switchWorkingTab_SS(0, 0, pageHelper.blankPage)
    .goToUiTestAutomationPlayground_SS(pageHelper.homePage)
    .clickAjaxData_SS(pageHelper.ajaxDataPage)
    .execute();
});