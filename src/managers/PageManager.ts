import { TestManager } from "./TestManager";
import { HomePage } from "../pages/Home/HomePage";
import { BlankPage } from "../pages/Blank/BlankPage";
import { AjaxDataPage } from "../pages/AjaxData/AjaxDataPage";
import { StepSequenceManager } from "./StepSequenceManager";

export class PageManager {

    private _blankPage?: BlankPage;
    private _homePage?: HomePage;
    private _ajaxDataPage?: AjaxDataPage;
    
    constructor(private readonly testManager: TestManager, private readonly stepSequenceManager: StepSequenceManager) { }

    get blankPage() {
        if (this._blankPage === undefined) {
            this._blankPage = new BlankPage(this.testManager, this.stepSequenceManager);
        }
        return this._blankPage;
    }

    get homePage() {
        if (this._homePage === undefined) {
            this._homePage = new HomePage(this.testManager, this.stepSequenceManager);
        }
        return this._homePage;
    }

    get ajaxDataPage() {
        if (this._ajaxDataPage === undefined) {
            this._ajaxDataPage = new AjaxDataPage(this.testManager, this.stepSequenceManager);
        }
        return this._ajaxDataPage;
    }
}