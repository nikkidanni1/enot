import React from 'react';
import { useRef, useContext, useDeferredValue, useCallback, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Context } from 'App'
import Switch from 'components/Switch'
import styles from './TaskItem.module.css';

type Props = {
    task: Task,
    color: string,
    isToday: boolean
}

const TaskItem: React.FC<Props> = ({ task, color, isToday }) => {
    const refTaskItem = useRef<HTMLDivElement | null>(null)
    const {
        data: {
            editTask,
            handleOpenTaskForm,
            handleSelectTask
        },
        UI
    } = useContext(Context)

    const [taskItemDetailsWidth, setTaskItemDetailsWidth] = useState<number>(0)

    useEffect(() => {
        let result = 0
        if (refTaskItem.current && UI.taskItemWidth !== 0) {
            const gridTemplateColumnsArray = getComputedStyle(refTaskItem.current).gridTemplateColumns.split(" ")
            const widthGaps = parseInt(getComputedStyle(refTaskItem.current).columnGap) * (isToday ? 2 : 1)
            result = UI.taskItemWidth - widthGaps - parseInt(gridTemplateColumnsArray[0]) - (isToday? parseInt(gridTemplateColumnsArray[2]): 0)
        }
        setTaskItemDetailsWidth(result)
    }, [refTaskItem.current, UI.taskItemWidth])

    const onToggle: React.ChangeEventHandler = useCallback((e) => {
        editTask({
            ...task,
            isComplete: !task.isComplete
        })
    }, [editTask, task])

    const handleClick: React.MouseEventHandler = useCallback((e) => {
        handleOpenTaskForm(true)
        handleSelectTask(task)
    }, [task])

    const deferredTaskItemDetailsWidth = useDeferredValue(taskItemDetailsWidth)

    return (
        <div
            ref={refTaskItem}
            className={styles.taskItem}
        >
            <div className={styles.taskItem__decor} style={{ backgroundColor: color }} />
            <div className={styles.taskItem__text} onClick={handleClick}>
                <Typography 
                    className={styles.taskItem__title} 
                    component="h3"
                    style={{
                        textDecoration: task.isComplete ? 'line-through' : 'unset'
                    }}
                    >
                        {task.title}
                        </Typography>
                <Typography
                    className={styles.taskItem__details}
                    component="p"
                    style={{
                        width: `${deferredTaskItemDetailsWidth}px`
                    }}
                >
                    {task.details}
                </Typography>
            </div>
            {isToday && <Switch checked={task.isComplete} onChange={onToggle} />}
        </div>
    )
}

export default TaskItem;