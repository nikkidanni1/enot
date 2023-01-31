import React from 'react';
import { FormControlLabel, Checkbox as MUICheckbox } from '@mui/material';
import styles from './Checkbox.module.css';

type Props = Partial<React.ComponentProps<typeof FormControlLabel>> & React.ComponentProps<typeof MUICheckbox>

const Checkbox: React.FC<Props> = ({ label = '', checked, onChange, ...props }) => {
    return (
        <FormControlLabel
            {...props}
            classes={{
                label: styles.label
            }}
            label={label}
            control={
                <MUICheckbox
                    classes={{
                        root: styles.checkbox
                    }}
                    onChange={onChange}
                    checked={checked} 
                />
            }
        />
    );
}

export default Checkbox;