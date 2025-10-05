declare module 'react' {
  export interface ChangeEvent<T = Element> {
    target: T;
    preventDefault(): void;
  }
  
  export interface FormEvent<T = Element> {
    preventDefault(): void;
  }
  
  export function useState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useId(): string;
  
  export interface HTMLInputElement {
    name: string;
    value: string;
    type: string;
    checked: boolean;
  }
  
  export interface HTMLSelectElement {
    name: string;
    value: string;
  }
  
  export interface Element {
    name: string;
    value: string;
    type: string;
    checked: boolean;
  }
  
  export interface JSX {
    IntrinsicElements: any;
  }
  
  export interface SVGAttributes<T> {
    [key: string]: any;
  }
  
  export namespace React {
    interface ChangeEvent<T = Element> {
      target: T;
      preventDefault(): void;
    }
    
    interface FormEvent<T = Element> {
      preventDefault(): void;
    }
    
    interface ComponentProps<T> {
      [key: string]: any;
    }
  }
  
  export const React: any;
  export default React;
}
