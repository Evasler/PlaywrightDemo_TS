import { expect, Page } from "@playwright/test";
import { IndexPage } from "../pages/Index/IndexPage";
import { randomUUID } from "crypto";

export class PageManager {

    private indexPage: IndexPage;
    
    private constructor(private readonly page: Page, private readonly id: string) {}

    private static readonly pageManagerMap: Map<string,PageManager> = new Map<string,PageManager>();

    static newInstance(page: Page) {
        const id = randomUUID();
        this.pageManagerMap.set(id, new PageManager(page, id));
        return this.getInstance(id);
    }

    static getInstance(id: string) {
        if (this.pageManagerMap.has(id))
            return this.pageManagerMap.get(id)!;
        throw new Error(`PageManager ${id} not found`);
    }

    static deleteInstance(id: string) {
        const result = this.pageManagerMap.delete(id);
        expect(result).toBeTruthy();
    }

    static getLength() {
        return this.pageManagerMap.size;
    }

    getIndexPage() {
        if (this.indexPage === undefined)
            this.indexPage = new IndexPage(this.page, this.id);
        return this.indexPage;
    }
}