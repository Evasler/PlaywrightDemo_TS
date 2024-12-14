import { Page } from "@playwright/test";
import { PageManager } from "../../managers/PageManager";

export abstract class BasePage {

    private static task: Promise<void>;

    constructor(protected readonly page: Page, protected readonly pageManagerId: string) {
        if (BasePage.task === undefined)
            BasePage.task = Promise.resolve();
    }

    protected doTask(cb: any) {
        BasePage.task = BasePage.task.then(cb);
    }

    async execute() {
        this.doTask(() => PageManager.deleteInstance(this.pageManagerId));
        return BasePage.task;
    }
}