import { BasePage } from "../Base/BasePage";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { HomePageLocators } from "./HomeLocators";
import { AjaxDataPage } from "../AjaxData/AjaxDataPage";
import { step } from "../../decorators/StepDecorator";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { StorageStateHelper } from "../../helpers/StorageStateHelper";

export class HomePage extends BasePage {

    private readonly homePageLocators: HomePageLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, storageStateHelper: StorageStateHelper) {
        super("HomePage", browserHelper, stepSequenceHelper, storageStateHelper);
        this.homePageLocators = new HomePageLocators(browserHelper);
    }

    clickAjaxData(ajaxDataPage: AjaxDataPage) {
        this.addStep("clickAjaxData", async() => {
            console.log("clickAjaxData");
            await this.homePageLocators.ajaxDataLink.click();
        });
        return ajaxDataPage;
    }

    @step()
    async clickAjaxData_async(ajaxDataPage: AjaxDataPage): Promise<AjaxDataPage> {
        console.log("clickAjaxData_async")
        await this.homePageLocators.ajaxDataLink.click();
        return ajaxDataPage;
    }
}