import { PageType } from "../../customTypes/FrameworkTypes";

export const defaultTabPageType: PageType = "BlankPage";

/**
 * Stores the PageType of each tab for all contexts.
 * Allows providing feedback, in case of erroneous tab-switching, while writting Tests in a method-chaining manner.
 */
export default class TabPageTypeHelper {

    private readonly _tabPageType: Array<Array<PageType>> = [];

    /**
     * @param contextIndex 
     * @param tabIndex 
     * @returns The pageType of the tab.
     */
    tabPageType(contextIndex: number, tabIndex: number) {
        return this._tabPageType[contextIndex][tabIndex];
    }

    /**
     * Initializes the array of PageTypes for a new context.
     */
    initializeContextPageTypes() {
        this._tabPageType.push(new Array<PageType>());
    }

    /**
     * Sets defaultTabPageType as the pageType of the tab.
     * @param contextIndex 
     * @param tabIndex 
     */
    initializeTabPageType(contextIndex: number, tabIndex: number) {
        this.updateTabPageType(contextIndex, tabIndex, defaultTabPageType);
    }

    /**
     * Deletes the context's array of PageTypes. 
     * @param contextIndex 
     */
    removeContextPageTypes(contextIndex: number) {
        this._tabPageType.splice(contextIndex, 1);
    }

    /**
     * Sets the pageType of the tab.
     * @param contextIndex 
     * @param tabIndex 
     * @param pageType 
     */
    updateTabPageType(contextIndex: number, tabIndex: number, pageType: PageType) {
        this._tabPageType[contextIndex][tabIndex] = pageType;
    }
}