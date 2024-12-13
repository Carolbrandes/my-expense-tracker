import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useState } from 'react';

interface CurrencyInputProps {
    onChange: (event: { target: { value: string, name: string } }) => void;
    value: string;
    name: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    (props, ref) => {
        const { onChange, value, name, ...other } = props;
        const [displayValue, setDisplayValue] = useState(value);

        const formatCurrency = (value: string) => {
            // Remove any non-numeric characters except decimal point
            const numericValue = value.replace(/[^0-9.]/g, '');

            // Split into integer and decimal parts
            const [integer, decimal] = numericValue.split('.');

            // Format integer part with thousand separator
            const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            // Limit decimal part to two digits
            const formattedDecimal = decimal ? decimal.slice(0, 2) : '';

            // Combine integer and decimal parts with prefix
            return `$${formattedInteger}${formattedDecimal ? '.' + formattedDecimal : ''}`;
        };


        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const formattedValue = formatCurrency(event.target.value);
            setDisplayValue(formattedValue);

            onChange({
                target: {
                    name,
                    value: formattedValue.replace(/[^0-9.]/g, ''), // pass only the numeric value to the parent
                },
            });
        };

        return (
            <TextField
                fullWidth
                {...other}
                value={displayValue}
                name={name}
                onChange={handleChange}
                inputRef={ref}
                label="Valor*"
                variant="outlined"
            />
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';
