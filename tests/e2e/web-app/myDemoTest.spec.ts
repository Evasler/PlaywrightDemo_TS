import test from "@playwright/test";
import { TestUtils } from "../../../src/utils/TestUtils";
import { TestManager } from "../../../src/managers/TestManager";
import { PageManager } from "../../../src/managers/PageManager";

//More readable
test(TestUtils.buildTestTitle(0, "Chained POM | StepSequenceBuilder"), async({page}) => {

    const testManager = new TestManager(page);
    const pageManager = new PageManager(testManager);

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
test(TestUtils.buildTestTitle(1, "Chained POM | ThenChaining"), async({page}) => {

    const testManager = new TestManager(page);
    const pageManager = new PageManager(testManager);

    await pageManager.blankPage
    .openNewTab("currentContext", pageManager.blankPage)
    .then(res => res.goToUiTestAutomationPlayground(pageManager.homePage))
    .then(res => res.clickAjaxData(pageManager.ajaxDataPage))
    .then(res => res.switchWorkingTab(0, 0, pageManager.blankPage))
    .then(res => res.goToUiTestAutomationPlayground(pageManager.homePage))
    .then(res => res.clickAjaxData(pageManager.ajaxDataPage));
});