export default abstract class GeneralUtils {

    static padNumber(number: number, digitCount: number) {
        return number.toString().padStart(digitCount, "0");
    }
    
    static millisToString(millis: number) {
        var minutes = Math.floor(millis / 60000);
        var seconds = Math.floor((millis % 60000) / 1000);
        return `${minutes}:${this.padNumber(seconds, 2)}`;
    }
    
    static getCurrentDate() {
        const todayDate = new Date();
        const day = this.padNumber(todayDate.getDate(), 2);
        const month = this.padNumber(todayDate.getMonth() + 1, 2);
        const year = todayDate.getFullYear();
        const hours = this.padNumber(todayDate.getHours(), 2);
        const minutes = this.padNumber(todayDate.getMinutes(), 2);
        const seconds = this.padNumber(todayDate.getSeconds(), 2);
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
}