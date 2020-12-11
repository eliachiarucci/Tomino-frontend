class timeFormatter {
    constructor() {
    }
    toDoubleDigit = (parsedTime) => parsedTime.toString().length < 2 ? "0" + parsedTime : parsedTime;
    getHours = (time) => this.toDoubleDigit(Math.floor(time/3600));
    getMinutes = (time) => this.toDoubleDigit(Math.floor(time/60)%60);
    getSeconds = (time) => this.toDoubleDigit(time%60);
    getFullString = (time) => this.getHours(time) + ":" + this.getMinutes(time) + ":" + this.getSeconds(time);
};

export default timeFormatter;