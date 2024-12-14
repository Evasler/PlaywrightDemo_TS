import { Page } from "@playwright/test";
import { BasePage } from "../Base/BasePage";
import { PageManager } from "../../managers/PageManager";

export class IndexPage extends BasePage {

    constructor(page: Page, pageManagerId: string) {
        super(page, pageManagerId);
    }

    visit() {
        this.doTask(async() => {
            console.log("Visiting IndexPage");
            await this.page.goto("/styled/index.html");
        })
        return this;
    }

    greet() {
        this.doTask(async() => {
            console.log("Hello from IndexPage");
        })
        return this;
    }
}