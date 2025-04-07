import BrowserHelper from "../../helpers/BrowserHelper";

export default abstract class BaseLocators {

    constructor(private readonly _browserHelper: BrowserHelper) { }

    protected get workingTab() { return this._browserHelper.workingTab; }
}