interface ValidateWeightInput {
    userId?: string;
    weight: number;
    date?: string;
    id?: string;
}
interface ValidateWeightEvent {
    arguments: {
        input: ValidateWeightInput;
    };
}
export declare const handler: (event: ValidateWeightEvent) => Promise<ValidateWeightInput>;
export {};
