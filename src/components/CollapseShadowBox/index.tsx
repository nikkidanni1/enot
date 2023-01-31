import React from 'react';
import { Collapse } from '@mui/material';
import styles from './CollapseShadowBox.module.css';

type Props = {
    className?: string,
    children: React.ReactNode
} & React.ComponentProps<typeof Collapse>

const CollapseShadowBox: React.FC<Props> = ({ className, children, ...props }) => {
    return (
        <Collapse className={styles.root} {...props}>
            <div className={`${styles.content} ${className ?? ''}`}>
                {children}
            </div>
        </Collapse>
    )
}

export default CollapseShadowBox;