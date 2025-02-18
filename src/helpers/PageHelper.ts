import { BrowserHelper } from "./BrowserHelper";
import { HomePage } from "../pages/Home/HomePage";
import { BlankPage } from "../pages/Blank/BlankPage";
import { AjaxDataPage } from "../pages/AjaxData/AjaxDataPage";
import { StepSequenceHelper } from "./StepSequenceHelper";
import { LoginPage } from "../pages/AutomationInTesting/Login/LoginPage";
import { AdminPanelPage } from "../pages/AutomationInTesting/AdminPanel/AdminPanelPage";

export class PageHelper {

    private _blankPage?: BlankPage;

    //https://automationintesting.online/
    private _loginPage?: LoginPage;
    private _adminPanelPage?: AdminPanelPage;

    //http://uitestingplayground.com
    private _homePage?: HomePage;
    private _ajaxDataPage?: AjaxDataPage;
    
    constructor(private readonly browserHelper: BrowserHelper, private readonly stepSequenceHelper: StepSequenceHelper) { }

    get blankPage() {
        if (this._blankPage === undefined) {
            this._blankPage = new BlankPage(this.browserHelper, this.stepSequenceHelper);
        }
        return this._blankPage;
    }

    get loginPage() {
        if (this._loginPage === undefined) {
            this._loginPage = new LoginPage(this.browserHelper, this.stepSequenceHelper);
        }
        return this._loginPage;
    }

    get adminPanelPage() {
        if (this._adminPanelPage === undefined) {
            this._adminPanelPage = new AdminPanelPage(this.browserHelper, this.stepSequenceHelper);
        }
        return this._adminPanelPage;
    }

    get homePage() {
        if (this._homePage === undefined) {
            this._homePage = new HomePage(this.browserHelper, this.stepSequenceHelper);
        }
        return this._homePage;
    }

    get ajaxDataPage() {
        if (this._ajaxDataPage === undefined) {
            this._ajaxDataPage = new AjaxDataPage(this.browserHelper, this.stepSequenceHelper);
        }
        return this._ajaxDataPage;
    }
}