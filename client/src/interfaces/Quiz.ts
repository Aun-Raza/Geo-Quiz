export interface Quiz {
    _id: number;
    title: string;
    questions: { name: string }[];
    owner: { username: string };
}
