import React from 'react';
import { useRef, useEffect, useState } from 'react';
import styles from './Ticker.module.css';

type Props = {
    news: string
}

const Ticker: React.FC<Props> = ({ news }) => {
    const tickerRef = useRef<HTMLSpanElement | null>(null)

    const [duration, setDuration] = useState<number>(0)

    useEffect(() => {
        if (tickerRef.current) {
            setDuration(tickerRef.current.offsetWidth / 70)
        }

    }, [tickerRef.current])

    return (
        <div className={styles.ticker__wrapper}>
            <span
                ref={tickerRef}
                className={styles.ticker}
                style={{ animationDuration: `${duration}s` }}
            >
                {news}
            </span>
        </div>
    )
}

export default Ticker