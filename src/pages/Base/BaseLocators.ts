import BrowserHelper from "../../helpers/channel/BrowserHelper";

/**
 * Provides basic functionality shared across all Locators classes.
 */
export default abstract class BaseLocators {

    constructor(private readonly _browserHelper: BrowserHelper) { }

    /**
     * The focused Tab.
     */
    protected get workingTab() { return this._browserHelper.workingTab; }
}