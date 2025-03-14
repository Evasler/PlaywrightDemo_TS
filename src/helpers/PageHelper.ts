import { BrowserHelper } from "./BrowserHelper";
import { HomePage } from "../pages/UITestingPlayground/Home/HomePage";
import { BlankPage } from "../pages/Blank/BlankPage";
import { AjaxDataPage } from "../pages/UITestingPlayground/AjaxData/AjaxDataPage";
import { StepSequenceHelper } from "./StepSequenceHelper";
import { LoginPage } from "../pages/RestfulBooker/Login/LoginPage";
import { AdminPanelPage } from "../pages/RestfulBooker/AdminPanel/AdminPanelPage";
import { ErrorPage } from "../pages/Error/ErrorPage";
import { TempDataHelper } from "./TempDataHelper";

export class PageHelper {

    private readonly _stepSequenceHelper: StepSequenceHelper;

    private _blankPage?: BlankPage;

    //https://automationintesting.online/
    private _loginPage?: LoginPage;
    private _adminPanelPage?: AdminPanelPage;

    //Dummy page to showcase ErrorListener
    private _errorPage?: ErrorPage;

    //http://uitestingplayground.com
    private _homePage?: HomePage;
    private _ajaxDataPage?: AjaxDataPage;
    
    constructor(private readonly _browserHelper: BrowserHelper, private readonly _tempDataHelper: TempDataHelper) {
        this._stepSequenceHelper = new StepSequenceHelper();
    }

    get blankPage() {
        if (this._blankPage === undefined) {
            this._blankPage = new BlankPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
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

    get homePage() {
        if (this._homePage === undefined) {
            this._homePage = new HomePage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._homePage;
    }

    get ajaxDataPage() {
        if (this._ajaxDataPage === undefined) {
            this._ajaxDataPage = new AjaxDataPage(this._browserHelper, this._stepSequenceHelper, this._tempDataHelper);
        }
        return this._ajaxDataPage;
    }
}