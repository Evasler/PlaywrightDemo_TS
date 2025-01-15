import test from "@playwright/test";
import { TestUtils } from "../../../src/utils/TestUtils";
import { PageManager } from "../../../src/managers/PageManager";

test.describe.configure({ mode: "serial"})
test(TestUtils.buildTestTitle(1, "Dynamic HTML Table populated by JavaScript"), async({page}) => {

    await test.step("First Step", async() => {
        await PageManager.newInstance(page).getIndexPage()
            .visit()
            .greet()
            .execute();
        await PageManager.newInstance(page).getIndexPage()
            .visit()
            .greet()
            .execute();
        console.log(PageManager.getLength());
    })
});

test(TestUtils.buildTestTitle(2, "Dynamic HTML Table populated by JavaScript"), async({page}) => {

    await test.step("First Step", async() => {
        await PageManager.newInstance(page).getIndexPage()
            .visit()
            .greet()
            .execute();
        await PageManager.newInstance(page).getIndexPage()
            .visit()
            .greet()
            .execute();
        console.log(PageManager.getLength());
    })
});