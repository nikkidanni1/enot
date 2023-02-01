import React from 'react';
import { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Box, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  useQuery, useMutation, useQueryClient
} from 'react-query';
import { getNews } from 'api';
import TodayTasks from 'components/TodayTasks';
import OtherTasks from 'components/OtherTasks';
import TaskFormModal from 'components/TaskFormModal';
import Settings from 'components/Settings';
import Ticker from 'components/Ticker';
import styles from './App.module.css';

type UIType = {
  taskItemWidth: number,
}

type ContextType = {
  data: {
    tasks: Array<Task>,
    createTask: (task: Omit<Task, 'id' | 'isComplete'>) => void,
    editTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
    isOpenTaskForm: boolean,
    selectedTask: Task | null,
    handleOpenTaskForm: (open: boolean) => void,
    handleSelectTask: (task: Task | null) => void,
    isShownNews: boolean,
    showNews: (show: boolean) => void,
    news: string
  },
  UI: UIType
}

const initTasks: Array<Task> = [
  {
    id: uuid(),
    date: new Date(),
    title: 'Visit David',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(),
    title: 'Goceries For Dinner',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24 * 2)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24 * 3)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24 * 4)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24 * 5)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
  {
    id: uuid(),
    date: new Date(Date.now() + (3600 * 1000 * 24 * 5)),
    title: 'Fix Dad’s iPad',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    isComplete: false
  },
]

const initContext: ContextType = {
  data: {
    tasks: [],
    createTask: () => { },
    editTask: () => { },
    deleteTask: () => { },
    isOpenTaskForm: false,
    selectedTask: null,
    handleOpenTaskForm: () => { },
    handleSelectTask: () => { },
    isShownNews: true,
    showNews: () => { },
    news: ''
  },
  UI: {
    taskItemWidth: 0,
  }
}

export const Context = createContext<ContextType>(initContext)

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  const [tasks, setTasks] = useState<Array<Task>>(initTasks)
  const [isOpenTaskForm, setOpenTaskForm] = useState<boolean>(initContext.data.isOpenTaskForm)
  const [selectedTask, setSelectedTask] = useState<Task | null>(initContext.data.selectedTask)
  const [isShownNews, setShownNews] = useState<boolean>(initContext.data.isShownNews)
  const [news, setNews] = useState<string>(initContext.data.news)
  const [UI, setUI] = useState<UIType>(initContext.UI)

  const { data, isSuccess } = useQuery({
    queryFn: getNews
  })

  const createTask = useCallback((task: Omit<Task, 'id' | 'isComplete'>) => {
    setTasks(prev => [...prev, { ...task, id: uuid(), isComplete: false }])
  }, [tasks])

  const editTask = useCallback((task: Task) => {
    const taskIndex = tasks.findIndex((item: Task) => (item.id === task.id))
    setTasks((prev: Array<Task>) => {
      const newTasks: Array<Task> = [...prev]
      newTasks[taskIndex] = task
      return newTasks
    })
  }, [tasks])

  const deleteTask = useCallback((task: Task) => {
    const newTasks = tasks.filter((item: Task) => (item.id !== task.id))
    setTasks(newTasks)
  }, [tasks])

  const handleOpenTaskForm = useCallback((open: boolean) => {
    setOpenTaskForm(open)
    if (!open) {
      handleSelectTask(null)
    }
  }, [])

  const openTaskFrom = useCallback(() => {
    setOpenTaskForm(true)
  }, [])

  const handleSelectTask = useCallback((task: Task | null) => {
    setSelectedTask(task)
  }, [])

  const showNews = useCallback((show: boolean) => {
    setShownNews(show)
  }, [])

  const context: ContextType = useMemo(() => ({
    data: {
      tasks,
      createTask,
      editTask,
      deleteTask,
      isOpenTaskForm,
      selectedTask,
      handleOpenTaskForm,
      handleSelectTask,
      isShownNews,
      showNews,
      news
    },
    UI
  }), [tasks, createTask, editTask, isOpenTaskForm, selectedTask, UI, isShownNews, showNews])

  const onResize = () => {
    const shadowBoxTodayTasks: HTMLDivElement | undefined = document.getElementsByClassName('shadowBox_todayTasks')?.[0] as HTMLDivElement

    if (shadowBoxTodayTasks && rootRef.current) {
      const shadowBoxTodayTasksPaddingLeft: number = parseInt(getComputedStyle(shadowBoxTodayTasks).paddingLeft)
      const shadowBoxTodayTasksPaddingRight: number = parseInt(getComputedStyle(shadowBoxTodayTasks).paddingRight)
      const rootWidth: number = parseInt(getComputedStyle(rootRef.current).width)
      const rootPaddingLeft: number = parseInt(getComputedStyle(rootRef.current).paddingLeft)
      const rootPaddingRight: number = parseInt(getComputedStyle(rootRef.current).paddingRight)

      setUI(prev => ({
        ...prev,
        taskItemWidth: (
          rootWidth - (shadowBoxTodayTasksPaddingLeft + shadowBoxTodayTasksPaddingRight + rootPaddingLeft + rootPaddingRight)
        )
      }))
    }
  }

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [rootRef.current])

  return (
    <Context.Provider value={context}>
      <ThemeProvider theme={darkTheme}>
        <Box ref={rootRef} className={styles.root}>
          <header className={styles.header}>
            <Typography className={styles.title} component="h1">To Do</Typography>
            <Settings />
          </header>
          <TodayTasks />
          <Button className={styles.createButton} onClick={openTaskFrom}>
            + Create Task
          </Button>
          <OtherTasks />
        </Box>
        <TaskFormModal />
        {(isSuccess && isShownNews && data) && <Ticker news={data?.[0]?.summary ?? data?.[0]?.title}/>}
      </ThemeProvider>
    </Context.Provider>
  );
}

export default App;
