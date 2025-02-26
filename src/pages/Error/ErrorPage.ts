import { BrowserHelper } from "../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BasePage } from "../Base/BasePage";

export class ErrorPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("Error", browserHelper, stepSequenceHelper);
    }
}