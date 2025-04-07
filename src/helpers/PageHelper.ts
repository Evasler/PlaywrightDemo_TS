import BrowserHelper from "./BrowserHelper";
import BlankPage from "../pages/Blank/BlankPage";
import StepSequenceHelper from "./StepSequenceHelper";
import LoginPage from "../pages/RestfulBooker/Login/LoginPage";
import AdminPanelPage from "../pages/RestfulBooker/AdminPanel/AdminPanelPage";
import ErrorPage from "../pages/Error/ErrorPage";
import TempDataHelper from "./TempDataHelper";

export default class PageHelper {

    private _blankPage?: BlankPage;

    //https://automationintesting.online/
    private _loginPage?: LoginPage;
    private _adminPanelPage?: AdminPanelPage;

    //Dummy page to showcase ErrorListener
    private _errorPage?: ErrorPage;
    
    constructor(
        private readonly _browserHelper: BrowserHelper, 
        private readonly _stepSequenceHelper: StepSequenceHelper, 
        private readonly _tempDataHelper: TempDataHelper,
        private readonly _baseUrl: string
    ) { }

    get blankPage() {
        if (this._blankPage === undefined) {
            this._blankPage = new BlankPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._blankPage;
    }

    get loginPage() {
        if (this._loginPage === undefined) {
            this._loginPage = new LoginPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._loginPage;
    }

    get adminPanelPage() {
        if (this._adminPanelPage === undefined) {
            this._adminPanelPage = new AdminPanelPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._adminPanelPage;
    }

    get errorPage() {
        if (this._errorPage === undefined) {
            this._errorPage = new ErrorPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._errorPage;
    }
}