import { browserHelper, stepSequenceHelper, testDataHelper } from "../../helpers/index.js";
import type { PageType, TestDataKeys } from "../../types/index.js";

export default abstract class BaseSteps {

    constructor(protected readonly _stepsType: PageType) {}

    protected get workingTab() {
        return browserHelper.workingTab;
    }

    protected addStep(stepName: string, stepFunction: () => Promise<void>) {
        stepSequenceHelper.addStep(stepName, stepFunction);
    }

    protected pushTestData(key: TestDataKeys, value: string) {
        testDataHelper.pushTestData(key, value);
    }

    protected getTestData(key: TestDataKeys, index: number) {
        testDataHelper.getTestData(key, index);
    }

    _openNewTabInNewContext<T extends BaseSteps>(page: T, authenticatedUser?: string): T {
        browserHelper.openNewTabInNewContext(authenticatedUser);
        return page;
    }

    _openNewTabInCurrentContext<T extends BaseSteps>(page: T): T {
        browserHelper.openNewTabInCurrentContext();
        return page;
    }

    _switchWorkingTab<T extends BaseSteps>(contextIndex: number, pageIndex: number, page: T): T {
        browserHelper.switchWorkingTab(contextIndex, pageIndex, this._stepsType, page._stepsType);
        return page;
    }

    _execute() {
        return stepSequenceHelper.stepSequence;
    }
}

export type { BaseSteps };