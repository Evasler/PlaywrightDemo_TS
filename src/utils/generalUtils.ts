const generalUtils = {

  padCenteredString(str: string, length: number) {
    const paddingCharCount = length - str.length - 2;
    if (paddingCharCount < 1)
      return str;
    return ` ${str} `.padStart(Math.ceil(paddingCharCount / 2) + str.length + 2, "=").padEnd(length, "=");
  },
  padNumber(number: number, digitCount: number) {
    return number.toString().padStart(digitCount, "0");
  },

  millisToString(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${this.padNumber(seconds, 2)}`;
  },

  getCurrentDate() {
    const todayDate = new Date();
    const day = this.padNumber(todayDate.getDate(), 2);
    const month = this.padNumber(todayDate.getMonth() + 1, 2);
    const year = todayDate.getFullYear();
    const hours = this.padNumber(todayDate.getHours(), 2);
    const minutes = this.padNumber(todayDate.getMinutes(), 2);
    const seconds = this.padNumber(todayDate.getSeconds(), 2);
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  },
};

export default generalUtils;
