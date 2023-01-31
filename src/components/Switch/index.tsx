import React from 'react';
import { Switch as MUISwitch } from '@mui/material';
import styles from './Switch.module.css';

type Props = React.ComponentProps<typeof MUISwitch>

const Switch: React.FC<Props> = (props) => {
    return (
        <MUISwitch 
            {...props}
            classes={{
                root: styles.root,
                switchBase: styles.switchBase,
                track: styles.track,
                thumb: styles.thumb,
                checked: styles.checked
            }}
        />
    )
}

export default Switch