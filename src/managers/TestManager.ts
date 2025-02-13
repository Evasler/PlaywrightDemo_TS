import { Page } from "@playwright/test";
import { PageType } from "../customTypes/PageTypes";

export const defaultTabPageType: PageType = "BlankPage";

export class TestManager {

    private readonly _tabPageType: Array<Array<PageType>> = [];

    constructor(private _workingPage: Page) { 
        this.initializeContextPageTypes();
        this.initializeTabPageType(0, 0);
    }
    
    get workingPage() {
        return this._workingPage;
    }

    updateWorkingPage(workingPage: Page) {
        this._workingPage = workingPage;
    }

    tabPageType(contextIndex: number, tabIndex: number) {
        return this._tabPageType[contextIndex][tabIndex];
    }

    initializeContextPageTypes() {
        this._tabPageType.push(new Array<PageType>());
    }

    initializeTabPageType(contextIndex: number, tabIndex: number) {
        this.updateTabPageType(contextIndex, tabIndex, defaultTabPageType);
    }

    removeContextPageTypes(contextIndex: number) {
        this._tabPageType.splice(contextIndex, 1);
    }

    updateTabPageType(contextIndex: number, tabIndex: number, pageType: PageType) {
        this._tabPageType[contextIndex][tabIndex] = pageType;
    }
}