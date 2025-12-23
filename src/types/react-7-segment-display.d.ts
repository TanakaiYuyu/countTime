/**
 * Type declarations for react-7-segment-display
 */

declare module 'react-7-segment-display' {
  import { FC } from 'react';

  export interface DisplayProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    color?: string;
    height?: number;
    count?: number;
    bakgroundColor?: string;
    backgroundColor?: string;
    skew?: boolean;
    padding?: string;
  }

  export const Display: FC<DisplayProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Digit: FC<any>;
}

