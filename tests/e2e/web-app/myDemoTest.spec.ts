import test from "@playwright/test";
import { TestUtils } from "../../../src/utils/TestUtils";
import { TestManager } from "../../../src/managers/TestManager";
import { PageManager } from "../../../src/managers/PageManager";

test(TestUtils.buildTestTitle(0, "My Demo Test"), async({page}) => {

    await test.step("First Step", async() => {

        const testManager = new TestManager(page);
        const pageManager = new PageManager(testManager);

        await pageManager.blankPage
        .goToUiTestAutomationPlayground(pageManager.homePage)
        .clickAjaxData(pageManager.ajaxDataPage)
        .execute();
    });
});