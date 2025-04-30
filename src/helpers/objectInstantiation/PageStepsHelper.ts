import BrowserHelper from "../channel/BrowserHelper";
import BlankSteps from "../../pages/Blank/BlankSteps";
import StepSequenceHelper from "../chaining/StepSequenceHelper";
import LoginSteps from "../../pages/RestfulBooker/Login/LoginSteps";
import AdminPanelSteps from "../../pages/RestfulBooker/AdminPanel/AdminPanelSteps";
import ErrorSteps from "../../pages/Error/ErrorSteps";
import TempDataHelper from "../chaining/TempDataHelper";

/**
 * Instantiates all Steps objects used by the UI Tests.
 * Holds a reference for all of those objects.
 */
export default class PageStepsHelper {

    private _blankSteps?: BlankSteps;

    //https://automationintesting.online/
    private _loginSteps?: LoginSteps;
    private _adminPanelSteps?: AdminPanelSteps;

    //Dummy page to showcase ErrorListener
    private _errorSteps?: ErrorSteps;
    
    constructor(
        private readonly _browserHelper: BrowserHelper, 
        private readonly _stepSequenceHelper: StepSequenceHelper, 
        private readonly _tempDataHelper: TempDataHelper,
        private readonly _baseUrl: string
    ) { }

    get blankSteps() {
        if (this._blankSteps === undefined) {
            this._blankSteps = new BlankSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._blankSteps;
    }

    get loginSteps() {
        if (this._loginSteps === undefined) {
            this._loginSteps = new LoginSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._loginSteps;
    }

    get adminPanelSteps() {
        if (this._adminPanelSteps === undefined) {
            this._adminPanelSteps = new AdminPanelSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._adminPanelSteps;
    }

    get errorSteps() {
        if (this._errorSteps === undefined) {
            this._errorSteps = new ErrorSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._errorSteps;
    }
}