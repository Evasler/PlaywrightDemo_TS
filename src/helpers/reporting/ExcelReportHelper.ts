import { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import GeneralUtils from "../../utils/GeneralUtils";
import TerminalUtils from "../../utils/TerminalUtils";
import FileUtils from "../../utils/FileUtils";
import TestUtils from "../../utils/TestUtils";
import ErrorHandlingUtils from "../../utils/ErrorHandlingUtils";
import Excel from "exceljs";

/**
 * Facilitates all Excel actions performed by ExcelReporter.
 */
export default class ExcelReportHelper {

    private readonly _unreportedTestTitles: string[] = [];

    constructor(private readonly _filepath: string, private readonly _configurations: string[]) {}

    private _worksheetName(testType: "API" | "UI") {
        return `FullScope (${testType})`;
    }

    /**
     * Updates the result of the test, based on Playwright's test result.
     * The title of a test is added to the unreportedTestTitles array, if there was an error or if no test point exists for that test.
     * @param test 
     * @param result 
     */
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
            const worksheetName = this._worksheetName(_testType);
            const worksheetErrors = await this._worksheetErrors(worksheetName);
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
        if (testPointExists)
            await workbook.xlsx.writeFile(this._filepath);
        else
            this._unreportedTestTitles.push(test.title);
    }

    /**
     * Lists the title of all tests, which weren't reported.
     */
    printUnreportedTestResultsWarning() {
        if (this._unreportedTestTitles.length > 0)
            ErrorHandlingUtils.reportWarnings("Excel", this._unreportedTestTitles.map(title => `Test result not reported: ${title}`));
    }

    /**
     * Performs a write operation on the Excel Report.
     * @returns True, if the operation was successful. Otherwise, false.
     */
    private async _excelIsWritable() {
        try {
            const workbook = await new Excel.Workbook().xlsx.readFile(this._filepath);
            await workbook.xlsx.writeFile(this._filepath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks that the excel file exists and is writable.
     * It, also, checks that "FullScope (UI)" and "FullScope (API)" worksheets exist and have the proper structure.
     * @param projectName 
     * @returns An array containing the error messages, if there were errors. Otherwise, an empty array.
     */
    private async _excelFileErrors() {
        const excelFileErrors = [];
        if (!FileUtils.fileExists(this._filepath))
            excelFileErrors.push(`Filepath \"${this._filepath}\" not found`);
        else if (!await this._excelIsWritable())
            excelFileErrors.push(`Excel Report is locked or not writable`);
        else {
            excelFileErrors.push(...await this._worksheetErrors(this._worksheetName("API")));
            excelFileErrors.push(...await this._worksheetErrors(this._worksheetName("UI")));
        }
        return excelFileErrors;
    }

    /**
     * Checks that worksheetName exist and has the proper structure.
     * @param worksheetName 
     * @returns An array containing the error messages, if there were errors. Otherwise, an empty array.
     */
    private async _worksheetErrors(worksheetName: string) {
        const worksheetErrors = [];
        const worksheet = await this._worksheet(worksheetName);
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

    /**
     * Gets the configurations specified by projectName.
     * @param projectName 
     * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
     */
    private _projectErrors(projectName: string) {
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

    /**
     * Checks if a test point exists.
     * @param test 
     * @param projectName 
     * @param excelFileIsValid 
     * @returns An array containing the error message, if there was an error or if the test point doesn't exist. Otherwise, an empty array.
     */
    private async _testErrors(test: TestCase, projectName: string, excelFileIsValid: boolean) {
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
                if (!await this._testPointExists(test))
                    testPointErrors.push(`Test Point [${testId},${projectConfigurations[0]}] not found in \"${this._worksheetName(testType!)}\"`);
        }
        return [...testFileErrors, ...titleErrors, ...testPointErrors];
    }

    /**
     * @param worksheetName 
     * @returns The worksheet.
     */
    private async _worksheet(worksheetName: string) {
        const workbook = await new Excel.Workbook().xlsx.readFile(this._filepath);
        const worksheet = workbook.getWorksheet(worksheetName);
        return worksheet;
    }

    /**
     * @param test 
     * @returns True if the test point exists. Otherwise, false.
     */
    private async _testPointExists(test: TestCase) {
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
        const worksheet = await this._worksheet(this._worksheetName(_testType));
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

    /**
     * Checks if all tests of rootSuite can be reported on Excel.
     * Lists all error messages and stops the execution, if there are any errors.
     * @param rootSuite 
     */
    async throwReportingErrors(rootSuite: Suite) {
        const excelFileErrors: string[] = [];
        const projectErrors: string[] = [];
        const testErrors: string[] = [];
        excelFileErrors.push(...await this._excelFileErrors());
        for (const projectSuite of rootSuite.suites) {
            const projectName = projectSuite.project()!.name;
            projectErrors.push(...this._projectErrors(projectName));
            for (const test of projectSuite.allTests())
                testErrors.push(...await this._testErrors(test, projectName, excelFileErrors.length === 0));
        }
        const uniqueReportingErrors = [...new Set([...excelFileErrors, ...projectErrors, ...testErrors])];
        if (uniqueReportingErrors.length > 0)
            ErrorHandlingUtils.reportErrors("Excel", uniqueReportingErrors);
    }
}