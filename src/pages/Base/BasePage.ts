import { PageType } from "../../customTypes/PageTypes";
import { defaultTabPageType } from "../../managers/TestManager";
import { TestManager } from "../../managers/TestManager";
import { BaseBrowser } from "./BaseBrowser";

export abstract class BasePage extends BaseBrowser {

    constructor(private readonly pageType: PageType, testManager: TestManager) {
        super(testManager);
    }

    protected addStep(callback: () => void) {
        this.testManager.addStep(callback);
    }

    execute() {
        return this.testManager.stepSequence;
    }

    openNewTab<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): T {
        this.addStep(async () => {
            await this.openNewTabBase(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.lastContextIndex : this.workingContextIndex;
            const newTabIndex = this.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.testManager.initializeContextPageTypes();
            this.testManager.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.switchWorkingTabBase(targetContextIndex, newTabIndex, defaultTabPageType);
        });
        return page;
    }
    
    switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep(async () => {
            await this.switchWorkingTabBase(contextIndex, pageIndex, page.pageType);
        });
        return page;
    }
}