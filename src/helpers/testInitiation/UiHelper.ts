import BasePageSteps from "../../pages/Base/BasePageSteps";
import BrowserHelper from "../channel/BrowserHelper";
import PageStepsHelper from "../objectInstantiation/PageStepsHelper";

/**
 * Facilitates writting UI Tests in a method-chaining manner.
 * Serves as a starting point for the UI tests.
 * Provides the necessary PageStepsHelper, as well as, a way to open the initial tab.
 */
export default class UiHelper {

    constructor(private readonly _browserHelper: BrowserHelper, public readonly pageStepsHelper: PageStepsHelper) { }

    /**
     * Opens the initial tab.
     * @param pageSteps 
     * @param authenticatedUser The user whose storageState file should be loaded in the context.
     * @returns The pageSteps object, which should be used after this method.
     */
    _openNewTabInNewContext<T extends BasePageSteps>(pageSteps: T, authenticatedUser?: string) {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return pageSteps;
    }
}