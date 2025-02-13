import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

//More readable
test(TestUtils.buildTestTitle(0, "Chained POM | StepSequenceBuilder"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTab_SS("currentContext", pageHelper.blankPage)
    .goToUiTestAutomationPlayground_SS(pageHelper.homePage)
    .clickAjaxData_SS(pageHelper.ajaxDataPage)
    .switchWorkingTab_SS(0, 0, pageHelper.blankPage)
    .goToUiTestAutomationPlayground_SS(pageHelper.homePage)
    .clickAjaxData_SS(pageHelper.ajaxDataPage)
    .execute();
});

//Better stack feedback
test(TestUtils.buildTestTitle(1, "Chained POM | ThenChaining"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTab("currentContext", pageHelper.blankPage)
    .then(res => res.goToUiTestAutomationPlayground(pageHelper.homePage))
    .then(res => res.clickAjaxData(pageHelper.ajaxDataPage))
    .then(res => res.switchWorkingTab(0, 0, pageHelper.blankPage))
    .then(res => res.goToUiTestAutomationPlayground(pageHelper.homePage))
    .then(res => res.clickAjaxData(pageHelper.ajaxDataPage));
});