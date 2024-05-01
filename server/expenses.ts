export class Expenses {
    private userId: number;
    private apartmentId: number;

    constructor(userId: number, apartmentId: number) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }

    calculateExpenses(): number {
        return 0; // todo
    }
}
