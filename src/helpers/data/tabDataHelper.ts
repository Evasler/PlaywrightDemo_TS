import type { PageType } from "../../types/index.js";

const defaultPageType: PageType = "BlankPage";
const pageTypes: PageType[][] = [];

/**
 * Stores the PageType of each tab for all contexts.
 * Allows providing feedback, in case of erroneous tab-switching, while writting Tests in a method-chaining manner.
 */
const tabDataHelper = {

    /**
     * @param contextIndex 
     * @param tabIndex 
     * @returns The pageType of the tab.
     */
    pageType(contextIndex: number, tabIndex: number) {
        return pageTypes[contextIndex][tabIndex];
    },

    /**
     * Initializes the array of PageTypes for a new context.
     */
    initializeContextPageTypes() {
        pageTypes.push(new Array<PageType>());
    },

    /**
     * Sets defaultPageType as the pageType of the tab.
     * @param contextIndex 
     * @param tabIndex 
     */
    initializePageType(contextIndex: number, tabIndex: number) {
        this.updatePageType(contextIndex, tabIndex, defaultPageType);
    },

    /**
     * Deletes the context's array of PageTypes. 
     * @param contextIndex 
     */
    removeContextPageTypes(contextIndex: number) {
        pageTypes.splice(contextIndex, 1);
    },

    /**
     * Sets the pageType of the tab.
     * @param contextIndex 
     * @param tabIndex 
     * @param pageType 
     */
    updatePageType(contextIndex: number, tabIndex: number, pageType: PageType) {
        pageTypes[contextIndex][tabIndex] = pageType;
    },

    resetPageTypes() {
        pageTypes.length = 0;
    }
}

export default tabDataHelper;