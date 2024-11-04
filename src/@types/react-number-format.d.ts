declare module 'react-number-format' {
    import * as React from 'react';

    export interface NumberFormatProps extends React.InputHTMLAttributes<HTMLInputElement> {
        allowNegative?: boolean;
        allowEmptyFormatting?: boolean;
        decimalScale?: number;
        fixedDecimalScale?: boolean;
        isNumericString?: boolean;
        onValueChange?: (values: { floatValue: number; formattedValue: string }) => void;
        thousandSeparator?: string | boolean;
        decimalSeparator?: string;
        prefix?: string;
        suffix?: string;
        value?: string | number;
    }

    export default class NumberFormat extends React.Component<NumberFormatProps> { }
}