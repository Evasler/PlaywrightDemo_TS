import { TestCase, TestResult } from "@playwright/test/reporter";

export default abstract class TestUtils {

    static fullTitle(id: number, title: string, tags?: string[]) {
        let testTitle = `${id}: ${title}`;
        if (tags)
            testTitle += ` | ${tags.map(tag => `@${tag}`).toString().replaceAll(",", " ")}`;
        return testTitle;
    }
    
    static id(test: TestCase) {
        const colonIndex = test.title.indexOf(":");
        if (colonIndex < 0)
            throw new Error(`Test Title \"${test.title}\" should follow the format "testId: testTitle (| @tag)?"`);
        const id = test.title.substring(0, colonIndex);
        if (!/\d+/.test(id))
            throw new Error(`Test Id \"${id}\" should be a number`);
        return id;
    }
    
    static project(test: TestCase) {
        let projectSuite = test.parent;
        while (projectSuite.type !== "project")
            projectSuite = projectSuite.parent!;
        return projectSuite.project()!;
    }
    
    static projectConfiguration(test: TestCase, configurations: string[]) {
        const _project = this.project(test);
        const projectName = _project.name;
        const projectConfiguration = configurations.filter(configuration => projectName.includes(configuration));
        if (projectConfiguration.length === 0)
            throw new Error(`Project \"${projectName}\" doesn't specify a configuration (${configurations.join("|")})`);
        else if (projectConfiguration.length > 1)
            throw new Error(`Project \"${projectName}\" specifies multiple configurations (${configurations.join("|")})`);
        return configurations.filter(configuration => projectName.includes(configuration))[0];
    }
    
    static type(test: TestCase) {
        const testFilepathSpecifiesUi = /(\\|\/)ui(\\|\/)/.test(test.location.file);
        const testFilepathSpecifiesApi = /(\\|\/)api(\\|\/)/.test(test.location.file);
        if (testFilepathSpecifiesUi && !testFilepathSpecifiesApi)
            return "UI";
        else if (!testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            return "API";
        else if (testFilepathSpecifiesUi && testFilepathSpecifiesApi)
            throw new Error(`Filepath \"${test.location.file}\" specifies multiple Test Types (api|ui)`);
        else
            throw new Error(`Filepath \"${test.location.file}\" should include a directory that specifies the Test Type (api|ui)`);
    }
    
    static status(result: TestResult) {
        if (result.status === "passed")
            return "Passed";
        else if (["failed", "timedOut", "interrupted"].includes(result.status))
            return "Failed";
        else if (result.status === "skipped")
            throw new Error(`Test Result should not be \"skipped\"`);
    }
}