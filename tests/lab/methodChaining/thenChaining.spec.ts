import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test(TestUtils.buildTestTitle(0, "Chained POM | ThenChaining"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .then(res => res.goToUiTestAutomationPlayground(pageHelper.homePage))
    .then(res => res.clickAjaxData(pageHelper.ajaxDataPage))
    .then(res => res.switchWorkingTab(0, 0, pageHelper.blankPage))
    .then(res => res.goToUiTestAutomationPlayground(pageHelper.homePage))
    .then(res => res.clickAjaxData(pageHelper.ajaxDataPage));
});