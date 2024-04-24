class Expenses {
    userId: string;
    apartmentId: string;

    constructor(userId: string, apartmentId: string) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }

    calculateExpenses(): number {
        return 0; // todo
    }
}