import type { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import Excel from "exceljs";
import { errorHandlingUtils, fileUtils, generalUtils, terminalUtils, testUtils } from "../../utils/index.js";

const unreportedTestTitles: string[] = [];
let filepath: string;
let configurationNames: string[] = [];

function getWorksheetName(testType: "API" | "UI") {
    return `FullScope (${testType})`;
}

/**
 * Performs a write operation on the Excel Report.
 * @returns True, if the operation was successful. Otherwise, false.
 */
async function excelIsWritable() {
    try {
        const workbook = await new Excel.Workbook().xlsx.readFile(filepath);
        await workbook.xlsx.writeFile(filepath);
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
async function getExcelFileErrors() {
    const excelFileErrors = [];
    if (!fileUtils.fileExists(filepath))
        excelFileErrors.push(`Filepath "${filepath}" not found`);
    else if (!await excelIsWritable())
        excelFileErrors.push(`Excel Report is locked or not writable`);
    else {
        excelFileErrors.push(...await getWorksheetErrors(getWorksheetName("API")));
        excelFileErrors.push(...await getWorksheetErrors(getWorksheetName("UI")));
    }
    return excelFileErrors;
}

/**
 * Checks that worksheetName exist and has the proper structure.
 * @param worksheetName 
 * @returns An array containing the error messages, if there were errors. Otherwise, an empty array.
 */
async function getWorksheetErrors(worksheetName: string) {
    const worksheetErrors = [];
    const worksheet = await getWorksheet(worksheetName);
    if (!worksheet)
        worksheetErrors.push(`Worksheet "${worksheetName}" not found`);
    else {
        const expectedHeaders = ["ID", "Title", "Configuration", "Result", "Error", "Duration", "Date", "Issue", "Note"];
        for (let i = 1; i <= expectedHeaders.length; i++){
            const actualValue = worksheet.getRow(1).getCell(i).text;
            const expectedValue = expectedHeaders[i - 1];
            if (actualValue !== expectedValue)
                worksheetErrors.push(`Cell [${i},1] of Worksheet "${worksheetName}" should be "${expectedValue}" instead of "${actualValue}"`);
        }
    }
    return worksheetErrors;
}

/**
 * Gets the configurations specified by projectName.
 * @param projectName 
 * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
 */
function getProjectErrors(projectName: string) {
    const projectErrors = [];
    const projectConfigurations = configurationNames.filter(configuration => projectName.includes(configuration));
    if (projectConfigurations.length === 0)
        projectErrors.push(`Project "${projectName}" does not specify the configuration (${configurationNames.join("|")})`);
    else if (projectConfigurations.length > 1)
        projectErrors.push(`Project "${projectName}" specifies multiple configurations (${configurationNames.join("|")})`);
    return projectErrors;
}

/**
 * Checks if a test point exists.
 * @param test 
 * @param projectName 
 * @param excelFileIsValid 
 * @returns An array containing the error message, if there was an error or if the test point doesn't exist. Otherwise, an empty array.
 */
async function getTestErrors(test: TestCase, projectName: string, excelFileIsValid: boolean) {
    const testFileErrors: string[] = [];
    const titleErrors: string[] = [];
    const testPointErrors: string[] = [];

    let testType: "API" | "UI" | undefined = undefined;
    const testFilepathSpecifiesUi = /(\\|\/)ui(\\|\/)/.test(test.location.file);
    const testFilepathSpecifiesApi = /(\\|\/)api(\\|\/)/.test(test.location.file);
    if (testFilepathSpecifiesUi && !testFilepathSpecifiesApi)
        testType = "UI";
    else if (!testFilepathSpecifiesUi && testFilepathSpecifiesApi)
        testType = "API";
    else if (testFilepathSpecifiesUi && testFilepathSpecifiesApi)
        testFileErrors.push(`Filepath "${test.location.file}" specifies multiple Test Types (api|ui)`);
    else
        testFileErrors.push(`Filepath "${test.location.file}" should include a directory that specifies the Test Type (api|ui)`);

    if (!test.title.includes(":"))
        titleErrors.push(`Title "${test.title}" should include a ":"`);
    const testId = test.title.substring(0, test.title.indexOf(":"));
    if (titleErrors.length === 0 && !/\d+/.test(testId))
        titleErrors.push(`TestId "${testId}" should be a number`);

    if (excelFileIsValid && (testFileErrors.length === 0 && testType)) {
        const projectConfigurations = configurationNames.filter(configuration => projectName.includes(configuration));
        if (titleErrors.length === 0 && projectConfigurations.length === 1)
            if (!await testPointExists(test))
                testPointErrors.push(`Test Point [${testId},${projectConfigurations[0]}] not found in "${getWorksheetName(testType)}"`);
    }
    return [...testFileErrors, ...titleErrors, ...testPointErrors];
}

/**
 * @param worksheetName 
 * @returns The worksheet.
 */
async function getWorksheet(worksheetName: string) {
    const workbook = await new Excel.Workbook().xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet(worksheetName);
    return worksheet;
}

/**
 * @param test 
 * @returns True if the test point exists. Otherwise, false.
 */
async function testPointExists(test: TestCase) {
    let _testId;
    let _projectConfiguration
    let _testType: "API" | "UI";
    try {
        _testId= testUtils.id(test);
        _projectConfiguration = testUtils.projectConfiguration(test, configurationNames);
        _testType = testUtils.type(test);
    } catch {
        return false;
    }
    const worksheet = await getWorksheet(getWorksheetName(_testType));
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
 * Facilitates all Excel actions performed by ExcelReporter.
 */
const excelReportHelper = {

    init(excelData: { filepath: string, configurationNames: string[] }) {
        filepath = excelData.filepath;
        configurationNames = excelData.configurationNames;
    },

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
            _testId = testUtils.id(test);
            _projectConfiguration = testUtils.projectConfiguration(test, configurationNames);
            _testType = testUtils.type(test);
            workbook = await new Excel.Workbook().xlsx.readFile(filepath);
            const worksheetName = getWorksheetName(_testType);
            const worksheetErrors = await getWorksheetErrors(worksheetName);
            if (worksheetErrors.length > 0)
                throw new Error(`Worksheet "${worksheetName}" has errors: ${worksheetErrors.join(", ")}`);
            worksheet = workbook.getWorksheet(worksheetName);
            if (!worksheet)
                throw new Error(`Worksheet "${worksheetName}" not found`);
        } catch {
            unreportedTestTitles.push(test.title);
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
                    resultCell.value = testUtils.status(result);
                    if (result.error?.message)
                        errorCell.value = terminalUtils.clearOutput(result.error.message);
                    durationCell.value = generalUtils.millisToString(result.duration);
                    dateCell.value = generalUtils.getCurrentDate();
                }
                testPointExists = true;
                break;
            }
        }
        if (testPointExists)
            await workbook.xlsx.writeFile(filepath);
        else
            unreportedTestTitles.push(test.title);
    },

    /**
     * Lists the title of all tests, which weren't reported.
     */
    printUnreportedTestResultsWarning() {
        if (unreportedTestTitles.length > 0)
            errorHandlingUtils.reportWarnings("Excel", unreportedTestTitles.map(title => `Test result not reported: ${title}`));
    },

    /**
     * Checks if all tests of rootSuite can be reported on Excel.
     * Lists all error messages and stops the execution, if there are any errors.
     * @param rootSuite 
     */
    async throwReportingErrors(rootSuite: Suite) {
        const excelFileErrors: string[] = [];
        const projectErrors: string[] = [];
        const testErrors: string[] = [];
        excelFileErrors.push(...await getExcelFileErrors());
        for (const projectSuite of rootSuite.suites) {
            const project = projectSuite.project();
            if (!project) {
                projectErrors.push(`Suite "${projectSuite.title}" does not have a project defined.`);
                continue;
            }
            projectErrors.push(...getProjectErrors(project.name));
            for (const test of projectSuite.allTests())
                testErrors.push(...await getTestErrors(test, project.name, excelFileErrors.length === 0));
        }
        const uniqueReportingErrors = [...new Set([...excelFileErrors, ...projectErrors, ...testErrors])];
        if (uniqueReportingErrors.length > 0)
            errorHandlingUtils.reportErrors("Excel", uniqueReportingErrors);
    }
}

export default excelReportHelper;