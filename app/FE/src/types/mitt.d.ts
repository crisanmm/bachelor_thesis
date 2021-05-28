import type { EventType, WildcardHandler } from 'mitt';

/**
 * Handler type from mitt allows emitting events which data is possibly undefined,
 * as seen in the code snippet below from mitt type declarations:
 * export declare type Handler<T = any> = (event?: T) => void;
 * on<T = any>(type: EventType, handler: Handler<T>): void;
 *
 * This creates an issue when adding type annotations to on() event handlers, as a solution
 * create MyHandler type that doesn't allow optional arguments like the Handler type does.
 */

type MyHandler<T = any> = (event: T) => void;
type MyWildcardHandler = (type: EventType, event: any) => void;

declare module 'mitt' {
  export interface Emitter {
    on<T = any>(type: EventType, handler: MyHandler<T>): void;
    on(type: '*', handler: MyWildcardHandler): void;
    off<T = any>(type: EventType, handler: MyHandler<T>): void;
    off(type: '*', handler: MyWildcardHandler): void;
  }
}
