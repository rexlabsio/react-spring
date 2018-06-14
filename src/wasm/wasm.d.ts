/* tslint:disable */
export function tension_from_origami_value(arg0: number): number;

export function friction_from_origami_value(arg0: number): number;

export function calc_acceleration(arg0: number, arg1: number, arg2: number, arg3: number, arg4: number): number;

export function calc_temp(arg0: number, arg1: number, arg2: number): number;

export function concat(arg0: string, arg1: string): string;

export class PosVel {
free(): void;
static  new(): PosVel;

 rk4(arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number): void;

 get_pos(): number;

 get_vel(): number;

}
export class Foo {
free(): void;
static  new(): Foo;

 add(arg0: number): number;

}
