import { BasePage } from "../../Base/BasePage";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { HomePageLocators } from "./HomeLocators";
import { AjaxDataPage } from "../AjaxData/AjaxDataPage";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { TempDataHelper } from "../../../helpers/TempDataHelper";

export class HomePage extends BasePage {

    private readonly _homePageLocators: HomePageLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("HomePage", browserHelper, stepSequenceHelper, tempDataHelper);
        this._homePageLocators = new HomePageLocators(browserHelper);
    }

    clickAjaxData(ajaxDataPage: AjaxDataPage) {
        this.addStep("clickAjaxData", async() => {
            console.log("clickAjaxData");
            await this._homePageLocators.ajaxDataLink.click();
        });
        return ajaxDataPage;
    }
}