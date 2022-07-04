declare module "linebreak" {
    declare class Break {
        constructor(public position: number, public required = false);
    }
    declare class Breaker {
        constructor(val: string);
        nextBreak(): Break | null;
    }
    export default Breaker;
}
