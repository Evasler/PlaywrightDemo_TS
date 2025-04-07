import BasePage from "../pages/Base/BasePage";
import BrowserHelper from "./BrowserHelper";
import PageHelper from "./PageHelper";

export default class UiHelper {

    constructor(private readonly _browserHelper: BrowserHelper, public readonly pageHelper: PageHelper) { }

    openNewTabInNewContext<T extends BasePage>(page: T, authenticatedUser?: string) {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return page;
    }
}