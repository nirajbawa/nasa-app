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
    
    type ComponentClass<P = {}> = any;
    type FunctionComponent<P = {}> = (props: P) => React.ReactElement | null;
    type ComponentType<P = {}> = React.ComponentClass<P> | React.FunctionComponent<P>;
    type ReactNode = React.ReactChild | React.ReactFragment | React.ReactPortal | boolean | null | undefined;
    
    interface ForwardRefRenderFunction<T, P = {}> {
      (props: P, ref: React.Ref<T>): React.ReactElement | null;
    }
    
    interface ForwardRefExoticComponent<P> {
      (props: P): React.ReactElement | null;
      displayName?: string;
    }
    
    type PropsWithoutRef<P> = P extends any ? Omit<P, 'ref'> : P;
    interface RefAttributes<T> {
      ref?: React.Ref<T>;
    }
    
    type Ref<T> = React.RefCallback<T> | React.RefObject<T> | null;
    type RefCallback<T> = (instance: T | null) => void;
    interface RefObject<T> {
      readonly current: T | null;
    }
    interface MutableRefObject<T> {
      current: T;
    }
    
    type ReactElement = any;
    type ReactChild = React.ReactElement | React.ReactText;
    type ReactText = string | number;
    type ReactFragment = {} | React.ReactNodeArray;
    type ReactNodeArray = React.ReactNode[];
    type ReactPortal = any;
  }
  
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ReactNode = React.ReactNode;
  export type MutableRefObject<T> = React.MutableRefObject<T>;
  export const forwardRef: <T, P = {}>(component: React.ForwardRefRenderFunction<T, P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>;
  
  export const React: {
    forwardRef: <T, P = {}>(component: React.ForwardRefRenderFunction<T, P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>;
    ComponentType: React.ComponentType<any>;
    ReactNode: React.ReactNode;
  };
  export default React;
}
