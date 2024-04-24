class User {

    private readonly id: number;
    private fname: string;
    private lname: string;
    private email: string;
    private is_admin: boolean;
    private apartment: Apartment;

    constructor(id: number, fname: string, lname: string, email: string, is_admin: boolean, apartment: Apartment) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.is_admin = is_admin;
        this.apartment = apartment;
    }

    getId(): number {
        return this.id;
    }

    getFname(): string {
        return this.fname;
    }

    getLname(): string {
        return this.lname;
    }

    getEmail(): string {
        return this.email;
    }

    isAdmin(): boolean {
        return this.is_admin;
    }

    getApartment(): Apartment {
        return this.apartment;
    }

    setFname(fname: string): void {
        this.fname = fname;
    }

    setLname(lname: string): void {
        this.lname = lname;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setIsAdmin(is_admin: boolean): void {
        this.is_admin = is_admin;
    }

    setApartment(apartment: Apartment): void {
        this.apartment = apartment;
    }
    
}