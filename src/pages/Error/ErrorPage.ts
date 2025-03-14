import { BrowserHelper } from "../../helpers/BrowserHelper";
import { TempDataHelper } from "../../helpers/TempDataHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BasePage } from "../Base/BasePage";

export class ErrorPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("Error", browserHelper, stepSequenceHelper, tempDataHelper);
    }
}