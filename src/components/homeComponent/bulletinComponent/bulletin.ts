export default interface Bulletin {
    id: number;
    userName: string;
    info: string;
    date: Date;
  }

  export interface BulletinProps extends Bulletin {
    onDelete: (id: number) => void;
  }
