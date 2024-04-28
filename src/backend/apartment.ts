import { User } from "./user";

export class Apartment {
    private readonly id: number;
    private name?: string;
    private address: string;
    private users: User[];

    constructor(id: number, name: string, address: string, users: User[]) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.users = users;
    }

    getId(): number {
        return this.id;
    }

    getName(): string | undefined {
        return this.name;
    }

    getAddress(): string {
        return this.address;
    }

    add_user(user: User): void {
        if (!this.users.includes(user)){ 
            this.users.push(user); 
        }
    }

    remove_user(user: User): void {
        if (this.users.includes(user)) {
            this.users.splice(this.users.indexOf(user), 1);
        }
    }
}

