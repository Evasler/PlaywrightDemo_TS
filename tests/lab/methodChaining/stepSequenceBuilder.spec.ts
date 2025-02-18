import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test(TestUtils.buildTestTitle(0, "Chained POM | StepSequenceBuilder"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .goToUiTestAutomationPlayground(pageHelper.homePage)
    .clickAjaxData(pageHelper.ajaxDataPage)
    .switchWorkingTab(0, 0, pageHelper.blankPage)
    .goToUiTestAutomationPlayground(pageHelper.homePage)
    .clickAjaxData(pageHelper.ajaxDataPage)
    .execute();
});