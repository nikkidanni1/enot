import React from 'react';
import { useState, useCallback, useContext } from 'react';
import { IconButton, Popper, Paper, FormControlLabel } from '@mui/material';
import Switch from 'components/Switch';
import SettingsIcon from 'assets/icons/settings-icon.svg';
import { Context } from 'App';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
    const [isOpenPopper, setOpenPopper] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const { data: { isShownNews, showNews } } = useContext(Context)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        setAnchorEl(e.currentTarget)
        setOpenPopper((prev) => !prev);
    }, [])

    const handleToggle: React.ChangeEventHandler = useCallback(() => {
        showNews(!isShownNews)
    }, [isShownNews, showNews])

    return (
        <div>
            <IconButton
                className={styles.iconButton}
                onClick={handleClick}
            >
                <img src={SettingsIcon} alt="settings" />
            </IconButton>
            <Popper open={isOpenPopper} anchorEl={anchorEl} placement="bottom-end">
                <Paper className={styles.paper}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isShownNews}
                                onChange={handleToggle}
                            />
                        }
                        label="Show news"
                    />
                </Paper>
            </Popper>
        </div>
    )
}

export default Settings