import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { Context } from 'App';
import TasksBlock from './components/TasksBlock';

const OtherTasks: React.FC = () => {
    const { data: { tasks } } = useContext(Context)

    const [allDates, setAllDates] = useState<Set<string>>(new Set())

    useEffect(() => {
        const dates: Set<string> = new Set()
        const nextDayDate = new Date(`${new Date(Date.now() + (3600 * 1000 * 24)).getFullYear()}-${new Date(Date.now() + (3600 * 1000 * 24)).getMonth() + 1}-${new Date(Date.now() + (3600 * 1000 * 24)).getDate()}`)
        
        tasks.forEach(task => {
            if (nextDayDate <= task.date) {
                const newDate = `${task.date.getFullYear()}-${task.date.getMonth() + 1}-${task.date.getDate()}`
                dates.add(newDate)
            }
        })
        setAllDates(dates)
    }, [tasks])

    return (
        <div>
            {
                Array.from(allDates).sort((date1: string, date2: string) => (
                    new Date(date1).getTime() - new Date(date2).getTime()
                )).map(date => (
                    <TasksBlock key={date} date={date} />
                ))
            }
        </div>
    )
}

export default OtherTasks