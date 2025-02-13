import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

//More readable
test(TestUtils.buildTestTitle(0, "Chained POM | StepSequenceBuilder"), async({ pageManager }) => {
    await pageManager.blankPage
    .openNewTab_SS("currentContext", pageManager.blankPage)
    .goToUiTestAutomationPlayground_SS(pageManager.homePage)
    .clickAjaxData_SS(pageManager.ajaxDataPage)
    .switchWorkingTab_SS(0, 0, pageManager.blankPage)
    .goToUiTestAutomationPlayground_SS(pageManager.homePage)
    .clickAjaxData_SS(pageManager.ajaxDataPage)
    .execute();
});

//Better stack feedback
test(TestUtils.buildTestTitle(1, "Chained POM | ThenChaining"), async({ pageManager }) => {
    await pageManager.blankPage
    .openNewTab("currentContext", pageManager.blankPage)
    .then(res => res.goToUiTestAutomationPlayground(pageManager.homePage))
    .then(res => res.clickAjaxData(pageManager.ajaxDataPage))
    .then(res => res.switchWorkingTab(0, 0, pageManager.blankPage))
    .then(res => res.goToUiTestAutomationPlayground(pageManager.homePage))
    .then(res => res.clickAjaxData(pageManager.ajaxDataPage));
});