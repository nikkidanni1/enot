import React from 'react';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Context } from 'App';
import TaskItem from 'components/TaskItem';
import styles from './TasksBlock.module.css';
import { Typography, IconButton, Collapse } from '@mui/material';

type Props = {
    date: string
}

const TasksBlock: React.FC<Props> = ({ date }) => {
    const { data: { tasks } } = useContext(Context)

    const [isExpand, setExpand] = useState<boolean>(false)
    const [tasksByDate, setTasksByDate] = useState<Array<Task>>([])

    useEffect(() => {
        const newTasksByDate = tasks.filter(task => (
            task.date.getFullYear() === new Date(date).getFullYear()
            && task.date.getMonth() === new Date(date).getMonth()
            && task.date.getDate() === new Date(date).getDate()
        ))
        setTasksByDate(newTasksByDate)
    }, [tasks])

    const toggleExpand = useCallback(() => {
        setExpand(prev => !prev)
    }, [])

    const title = useMemo(() => {
        const tomorrowDate = `${new Date(Date.now() + (3600 * 1000 * 24)).getFullYear()}-${new Date(Date.now() + (3600 * 1000 * 24)).getMonth() + 1}-${new Date(Date.now() + (3600 * 1000 * 24)).getDate()}`
        const yearResult = new Date(date).getFullYear() !== new Date().getFullYear() ? new Date(date).getFullYear() : ''
        const dateResult = `${new Date(date).getDate().toString().padStart(2, '0')}/${(new Date(date).getMonth() + 1).toString().padStart(2, '0')}${yearResult}`
        return tomorrowDate === date ? 'Tomorrow' : dateResult
    }, [date])

    return (
        <div className={styles.tasksBlock}>
            <header className={styles.tasksBlockHeader} onClick={toggleExpand}>
                <div className={styles.tasksBlockHeader__decor} />
                <Typography
                    className={styles.tasksBlockHeader__title}
                    component="h2"
                >
                    {`${title} Tasks`}
                </Typography>
                <IconButton
                    className={`${styles.tasksBlockHeader__expand} ${isExpand ? styles.tasksBlockHeader__expand_expanded : ''}`}
                    aria-label="expand"
                />
            </header>
            <Collapse classes={{ wrapperInner: styles.collapse__wrapperInner }} in={isExpand}>
                {tasksByDate.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        isToday={false}
                        color=""
                    />
                ))}
            </Collapse>

        </div>
    )
}

export default TasksBlock