import BasePageSteps from "../../pages/Base/BasePageSteps";
import BrowserHelper from "../channel/BrowserHelper";
import PageStepsHelper from "../objectInstantiation/PageStepsHelper";

export default class UiHelper {

    constructor(private readonly _browserHelper: BrowserHelper, public readonly pageStepsHelper: PageStepsHelper) { }

    _openNewTabInNewContext<T extends BasePageSteps>(pageSteps: T, authenticatedUser?: string) {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return pageSteps;
    }
}