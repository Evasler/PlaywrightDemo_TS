import { BasePage } from "../Base/BasePage";
import { TestManager } from "../../managers/TestManager";
import { HomePageLocators } from "./HomeLocators";
import { AjaxDataPage } from "../AjaxData/AjaxDataPage";
import { step } from "../../decorators/StepDecorator";
import { StepSequenceManager } from "../../managers/StepSequenceManager";

export class HomePage extends BasePage {

    private readonly homePageLocators: HomePageLocators;

    constructor(testManager: TestManager, stepSequenceManager: StepSequenceManager) {
        super("HomePage", testManager, stepSequenceManager);
        this.homePageLocators = new HomePageLocators(testManager);
    }

    clickAjaxData_SS(ajaxDataPage: AjaxDataPage) {
        this.addStep("clickAjaxData_SS", async() => {
            console.log("clickAjaxData_SS");
            await this.homePageLocators.ajaxDataLink.click();
        });
        return ajaxDataPage;
    }

    @step()
    async clickAjaxData(ajaxDataPage: AjaxDataPage): Promise<AjaxDataPage> {
        console.log("clickAjaxData")
        await this.homePageLocators.ajaxDataLink.click();
        return ajaxDataPage;
    }
}