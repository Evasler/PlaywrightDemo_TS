import { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { GeneralUtils } from "../utils/GeneralUtils";
import { TerminalUtils } from "../utils/TerminalUtils";
import { fileExists } from "../utils/FileUtils";
import { TestUtils } from "../utils/TestUtils";
import Excel from "exceljs";

export class ExcelReportHelper {

    private readonly _unreportedTestTitles: string[] = [];

    constructor(private readonly _filepath: string, private readonly _configurations: string[]) {}

    private worksheetName(testType: "API" | "UI") {
        return `FullScope (${testType})`;
    }

    async updateResult(test: TestCase, result: TestResult) {
        let _testId;
        let _projectConfiguration;
        let _testType: "API" | "UI";
        let workbook;
        let worksheet;
        try {
            _testId = TestUtils.id(test);
            _projectConfiguration = TestUtils.projectConfiguration(test, this._configurations);
            _testType = TestUtils.type(test);
            workbook = await new Excel.Workbook().xlsx.readFile(this._filepath);
            const worksheetName = this.worksheetName(_testType);
            const worksheetErrors = await this.worksheetErrors(worksheetName);
            if (worksheetErrors.length > 0)
                throw new Error();
            worksheet = workbook.getWorksheet(worksheetName)!;
        } catch(error) {
            this._unreportedTestTitles.push(test.title);
            return;
        }
        let testPointExists = false;
        for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
            const row = worksheet.getRow(rowIndex);
            const testIdCellValue = row.getCell(1).text;
            const configurationCellValue = row.getCell(3).text;
            if (testIdCellValue === _testId && configurationCellValue === _projectConfiguration) {
                const resultCell = row.getCell(4);
                const errorCell = row.getCell(5);
                const durationCell = row.getCell(6);
                const dateCell = row.getCell(7);
                if (result.status !== "skipped") {
                    resultCell.value = TestUtils.status(result);
                    if (result.error?.message)
                        errorCell.value = TerminalUtils.clearOutput(result.error.message);
                    durationCell.value = GeneralUtils.millisToString(result.duration);
                    dateCell.value = GeneralUtils.getCurrentDate();
                }
                testPointExists = true;
                break;
            }
        }
        try {
            if (!testPointExists)
                throw new Error();
            await workbook.xlsx.writeFile(this._filepath);
        } catch (error) {
            this._unreportedTestTitles.push(test.title);
        }
    }

    printUnreportedTestResultsWarning() {
        if (this._unreportedTestTitles.length > 0)
            TerminalUtils.printColoredText("\nExcel: The following Tests' result was not reported", "yellow");
        for (const unreportedTestTitle of this._unreportedTestTitles)
            TerminalUtils.printColoredText(`  ${unreportedTestTitle}`, "yellow");
    }

    private async excelIsWritable() {
        try {
            const workbook = await new Excel.Workbook().xlsx.readFile(this._filepath);
            await workbook.xlsx.writeFile(this._filepath);
            return true;
        } catch {
            return false;
        }
    }

    private async excelFileErrors() {
        const excelFileErrors = [];
        if (!fileExists(this._filepath))
            excelFileErrors.push(`Filepath \"${this._filepath}\" not found`);
        else if (!await this.excelIsWritable())
            excelFileErrors.push(`Excel Report is locked or not writable`);
        else {
            excelFileErrors.push(...await this.worksheetErrors(this.worksheetName("API")));
            excelFileErrors.push(...await this.worksheetErrors(this.worksheetName("UI")));
        }
        return excelFileErrors;
    }

    private async worksheetErrors(worksheetName: string) {
        const worksheetErrors = [];
        const worksheet = await this.worksheet(worksheetName);
        if (!worksheet)
            worksheetErrors.push(`Worksheet \"${worksheetName}\" not found`);
        else {
            const expectedHeaders = ["ID", "Title", "Configuration", "Result", "Error", "Duration", "Date", "Issue", "Note"];
            for (let i = 1; i <= expectedHeaders.length; i++){
                const actualValue = worksheet.getRow(1).getCell(i).text;
                const expectedValue = expectedHeaders[i - 1];
                if (actualValue !== expectedValue)
                    worksheetErrors.push(`Cell [${i},1] of Worksheet \"${worksheetName}\" should be \"${expectedValue}\" instead of \"${actualValue}\"`);
            }
        }
        return worksheetErrors;
    }

    private projectErrors(projectName: string) {
        const projectErrors = [];
        if (this._configurations) {
            const projectConfigurations = this._configurations.filter(configuration => projectName.includes(configuration));
            if (this._configurations.length > 0) {
                if (projectConfigurations.length === 0)
                    projectErrors.push(`Project \"${projectName}\" does not specify the configuration (${this._configurations.join("|")})`);
                else if (projectConfigurations.length > 1)
                    projectErrors.push(`Project \"${projectName}\" specifies multiple configurations (${this._configurations.join("|")})`);
            }
        }
        return projectErrors;
    }

    private async testErrors(test: TestCase, projectName: string, excelFileIsValid: boolean) {
        const testFileErrors: string[] = [];
        const titleErrors: string[] = [];
        const testPointErrors: string[] = [];

        let testType: "API" | "UI";
        const testFilepathSpecifiesUi = /(\\|\/)ui(\\|\/)/.test(test.location.file);
        const testFilepathSpecifiesApi = /(\\|\/)api(\\|\/)/.test(test.location.file);
        if (testFilepathSpecifiesUi && !testFilepathSpecifiesApi)
            testType = "UI";
        else if (!testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            testType = "API";
        else if (testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            testFileErrors.push(`Filepath \"${test.location.file}\" specifies multiple Test Types (api|ui)`);
        else
            testFileErrors.push(`Filepath \"${test.location.file}\" should include a directory that specifies the Test Type (api|ui)`);

        if (!test.title.includes(":"))
            titleErrors.push(`Title \"${test.title}\" should include a ":"`);
        const testId = test.title.substring(0, test.title.indexOf(":"));
        if (titleErrors.length === 0 && !/\d+/.test(testId))
            titleErrors.push(`TestId \"${testId}\" should be a number`);

        if (this._configurations && excelFileIsValid && testFileErrors.length === 0) {
            const projectConfigurations = this._configurations.filter(configuration => projectName.includes(configuration));
            if (titleErrors.length === 0 && projectConfigurations.length === 1)
                if (!await this.testPointExists(test))
                    testPointErrors.push(`Test Point [${testId},${projectConfigurations[0]}] not found in \"${this.worksheetName(testType!)}\"`);
        }
        return [...testFileErrors, ...titleErrors, ...testPointErrors];
    }

    private async worksheet(worksheetName: string) {
        const workbook = await new Excel.Workbook().xlsx.readFile(this._filepath);
        const worksheet = workbook.getWorksheet(worksheetName);
        return worksheet;
    }

    private async testPointExists(test: TestCase) {
        let _testId;
        let _projectConfiguration
        let _testType: "API" | "UI";
        try {
            _testId= TestUtils.id(test);
            _projectConfiguration = TestUtils.projectConfiguration(test, this._configurations);
            _testType = TestUtils.type(test);
        } catch(error) {
            return false;
        }
        const worksheet = await this.worksheet(this.worksheetName(_testType));
        if (!worksheet)
            return false;
        for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
            const row = worksheet.getRow(rowIndex);
            const testIdCellValue = row.getCell(1).text;
            const configurationCellValue = row.getCell(3).text;
            if (testIdCellValue === _testId && configurationCellValue === _projectConfiguration)
                return true;
        }
        return false;
    }

    async throwReportingErrors(rootSuite: Suite) {
        const excelFileErrors: string[] = [];
        const projectErrors: string[] = [];
        const testErrors: string[] = [];
        excelFileErrors.push(...await this.excelFileErrors());
        for (const projectSuite of rootSuite.suites) {
            const projectName = projectSuite.project()!.name;
            projectErrors.push(...this.projectErrors(projectName));
            for (const test of projectSuite.allTests())
                testErrors.push(...await this.testErrors(test, projectName, excelFileErrors.length === 0));
        }
        const uniqueReportingErrors = [...new Set([...excelFileErrors, ...projectErrors, ...testErrors])];
        if (uniqueReportingErrors.length > 0) {
            TerminalUtils.printColoredText("\nExcel:", "red");
            for (const reportingError of uniqueReportingErrors)
                TerminalUtils.printColoredText(`  ${reportingError}`, "red");
            process.exit();
        }
    }
}