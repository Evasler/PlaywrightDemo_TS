import { PageType } from "../../customTypes/FrameworkTypes";

export const defaultTabPageType: PageType = "BlankPage";

export default class TabPageTypeHelper {

    private readonly _tabPageType: Array<Array<PageType>> = [];

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