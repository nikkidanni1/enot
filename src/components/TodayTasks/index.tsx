import React from 'react';
import { useState, useCallback, useContext } from 'react';
import CollapseShadowBox from 'components/CollapseShadowBox';
import Checkbox from 'components/Checkbox';
import { Context } from 'App';
import TaskItem from 'components/TaskItem'
import styles from './TodayTasks.module.css';

const colorSequence = ['#FF0000', '#366EFF', '#FFEB33']

const TodayTasks: React.FC = () => {
    const [isVisible, setVisible] = useState<boolean>(true)
    const {
        data: {
            tasks, createTask, editTask
        }
    } = useContext(Context)

    const onToggle = useCallback(() => {
        setVisible(prev => !prev)
    }, [])

    const filterTodayTasks = useCallback((item: Task): boolean => (
        item.date.getFullYear() === new Date().getFullYear()
        && item.date.getMonth() === new Date().getMonth()
        && item.date.getDate() === new Date().getDate()
    ), [tasks])

    return (
        <>
            <Checkbox
                className={styles.checkbox}
                label="Today Tasks:"
                checked={isVisible}
                onChange={onToggle}
            />
            <CollapseShadowBox 
                className="shadowBox_todayTasks" 
                in={isVisible}
                classes={{
                    root: styles.collapseShadowBox
                }}
            >
                {tasks.filter(filterTodayTasks).map((item, index) => (
                    <TaskItem
                        key={item.id}
                        task={item}
                        color={colorSequence[index % colorSequence.length]}
                        isToday={true}
                    />
                ))}
            </CollapseShadowBox>
        </>
    )
}

export default TodayTasks