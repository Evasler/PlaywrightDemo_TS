import { Page } from "@playwright/test";

export class HomePageLocators {

    constructor(private readonly page: Page) { }

    ajaxDataLink = this.page.getByRole("link", {name: "AJAX Data", exact: true});
}