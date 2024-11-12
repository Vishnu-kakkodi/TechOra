class ApplicationIDGenerator {
    private lastDate: string;
    private counter: number;
  
    constructor() {
      this.lastDate = this.getCurrentDate();
      this.counter = 0;
    }
  
    private getCurrentDate(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    }
  
    public generateID(): string {
      const currentDate = this.getCurrentDate();
  
      if (this.lastDate !== currentDate) {
        this.counter = 0;
        this.lastDate = currentDate;
      }
  
      this.counter += 1;
      const counterString = String(this.counter).padStart(4, '0');
  
      return `APP-${currentDate}-${counterString}`;
    }
  }
  
  const generator = new ApplicationIDGenerator();

  export default generator;
  