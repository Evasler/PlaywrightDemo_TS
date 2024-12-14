export class TestUtils {
    
    static buildTestTitle(id: number, title: string, tags?: string[]) {
        let testTitle = `${id}: ${title}`;
        if (tags)
            testTitle += ` | ${tags.map(tag => `@${tag}`).toString().replaceAll(",", " ")}`;
        return testTitle;
    }
}