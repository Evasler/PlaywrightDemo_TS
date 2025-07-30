import type { TestCase, TestResult } from "@playwright/test/reporter";
import type { SuiteTag } from "../types/index.js";
import { expect } from "@playwright/test";
import fileUtils from "./fileUtils.js";

const testUtils = {

    fullTitle(id: number, title: string, suiteTags?: SuiteTag[]) {
        let testTitle = `${id}: ${title}`;
        if (suiteTags)
            testTitle += ` | ${suiteTags.join(" ")}`;
        return testTitle;
    },
    
    id(test: TestCase) {
        const colonIndex = test.title.indexOf(":");
        if (colonIndex < 0)
            throw new Error(`Test Title "${test.title}" should follow the format "testId: testTitle (| @tag)?"`);
        const id = test.title.substring(0, colonIndex);
        if (!/\d+/.test(id))
            throw new Error(`Test Id "${id}" should be a number`);
        return id;
    },
    
    project(test: TestCase) {
        let projectSuite = test.parent;
        while (projectSuite.type !== "project") {
            if (!projectSuite.parent)
                throw new Error("Suite parent is undefined while searching for project suite.");
            projectSuite = projectSuite.parent;
        }
        const project = projectSuite.project();
        if (!project)
            throw new Error(`Project suite "${projectSuite.title}" does not have a project defined.`);
        return project;
    },
    
    projectConfiguration(test: TestCase, configurationNames: string[]) {
        const _project = this.project(test);
        const projectName = _project.name;
        const projectConfiguration = configurationNames.filter(configurationName => projectName.includes(configurationName));
        if (projectConfiguration.length === 0)
            throw new Error(`Project "${projectName}" doesn't specify a configuration (${configurationNames.join("|")})`);
        else if (projectConfiguration.length > 1)
            throw new Error(`Project "${projectName}" specifies multiple configurations (${configurationNames.join("|")})`);
        return projectConfiguration[0];
    },
    
    type(test: TestCase) {
        const testFilepathSpecifiesUi = /(\\|\/)ui(\\|\/)/.test(test.location.file);
        const testFilepathSpecifiesApi = /(\\|\/)api(\\|\/)/.test(test.location.file);
        if (testFilepathSpecifiesUi && !testFilepathSpecifiesApi)
            return "UI";
        else if (!testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            return "API";
        else if (testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            throw new Error(`Filepath "${test.location.file}" specifies multiple Test Types (api|ui)`);
        else
            throw new Error(`Filepath "${test.location.file}" should include a directory that specifies the Test Type (api|ui)`);
    },
    
    status(result: TestResult) {
        if (result.status === "passed")
            return "Passed";
        else if (["failed", "timedOut", "interrupted"].includes(result.status))
            return "Failed";
        else if (result.status === "skipped")
            throw new Error(`Test Result should not be "skipped"`);
    },

    setReporterStatus({ azureReporterStatus, excelReporterStatus }: { azureReporterStatus?: "ready" | "pending", excelReporterStatus?: "ready" | "pending" }) {
        if (!process.env.REPORTER_STATUS_FILEPATH)
            throw new Error("REPORTER_STATUS_FILEPATH is not defined");
        const reporterStatus = JSON.parse(fileUtils.readFile(process.env.REPORTER_STATUS_FILEPATH)) as { azureReporter: string, excelReporter: string };
        reporterStatus.azureReporter = azureReporterStatus ?? reporterStatus.azureReporter;
        reporterStatus.excelReporter = excelReporterStatus ?? reporterStatus.excelReporter;
        fileUtils.writeFile(process.env.REPORTER_STATUS_FILEPATH, JSON.stringify(reporterStatus, null, 4));
    },

    async verifyReportersAreReady() {
        await expect.poll(() => {
            if (!process.env.REPORTER_STATUS_FILEPATH)
                throw new Error("REPORTER_STATUS_FILEPATH is not defined");
            const reporterStatus = JSON.parse(fileUtils.readFile(process.env.REPORTER_STATUS_FILEPATH)) as { azureReporter: string, excelReporter: string };
            return reporterStatus.azureReporter === "ready" && reporterStatus.excelReporter === "ready";
        }, { timeout: 60000 }).toBeTruthy();
    }
};

export default testUtils;