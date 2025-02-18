import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test(TestUtils.buildTestTitle(0, "Chained POM | ThenChaining"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext_async(pageHelper.blankPage)
    .then(res => res.goToUiTestAutomationPlayground_async(pageHelper.homePage))
    .then(res => res.clickAjaxData_async(pageHelper.ajaxDataPage))
    .then(res => res.switchWorkingTab_async(0, 0, pageHelper.blankPage))
    .then(res => res.goToUiTestAutomationPlayground_async(pageHelper.homePage))
    .then(res => res.clickAjaxData_async(pageHelper.ajaxDataPage));
});