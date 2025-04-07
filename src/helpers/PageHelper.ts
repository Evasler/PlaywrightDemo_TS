import BrowserHelper from "./BrowserHelper";
import BlankSteps from "../pages/Blank/BlankSteps";
import StepSequenceHelper from "./StepSequenceHelper";
import LoginSteps from "../pages/RestfulBooker/Login/LoginSteps";
import AdminPanelSteps from "../pages/RestfulBooker/AdminPanel/AdminPanelSteps";
import ErrorSteps from "../pages/Error/ErrorSteps";
import TempDataHelper from "./TempDataHelper";

export default class PageHelper {

    private _blankPage?: BlankSteps;

    //https://automationintesting.online/
    private _loginPage?: LoginSteps;
    private _adminPanelPage?: AdminPanelSteps;

    //Dummy page to showcase ErrorListener
    private _errorPage?: ErrorSteps;
    
    constructor(
        private readonly _browserHelper: BrowserHelper, 
        private readonly _stepSequenceHelper: StepSequenceHelper, 
        private readonly _tempDataHelper: TempDataHelper,
        private readonly _baseUrl: string
    ) { }

    get blankPage() {
        if (this._blankPage === undefined) {
            this._blankPage = new BlankSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._blankPage;
    }

    get loginPage() {
        if (this._loginPage === undefined) {
            this._loginPage = new LoginSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._loginPage;
    }

    get adminPanelPage() {
        if (this._adminPanelPage === undefined) {
            this._adminPanelPage = new AdminPanelSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._adminPanelPage;
    }

    get errorPage() {
        if (this._errorPage === undefined) {
            this._errorPage = new ErrorSteps(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._errorPage;
    }
}