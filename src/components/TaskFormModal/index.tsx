import React from 'react';
import { useContext, useCallback, useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Context } from 'App';
import styles from './TaskFormModal.module.css';

type Form = {
    title: string,
    details: string,
    date: Date | null
}
type FormFields = keyof Form
type FormErorrs = Record<FormFields, string>
type FormTouched = Record<FormFields, boolean>

const initForm: Form = {
    title: '',
    details: '',
    date: null
}

const initTouched = {
    title: false,
    details: false,
    date: false
}

const initErrors = {
    title: '',
    details: '',
    date: '',
}

const TaskFormModal: React.FC = () => {
    const {
        data: {
            createTask,
            editTask,
            deleteTask,
            isOpenTaskForm,
            selectedTask,
            handleOpenTaskForm
        }
    } = useContext(Context)

    const [form, setForm] = useState<Form>(initForm)
    const [touched, setTouched] = useState<FormTouched>(initTouched)
    const [errors, setErrors] = useState<FormErorrs>(initErrors)

    useEffect(() => {
        if (selectedTask) {
            const { title, details, date } = selectedTask
            setForm({ title, details, date })
        }
        return () => {
            setForm(initForm)
            setErrors(initErrors)
            setTouched(initTouched)
        }
    }, [selectedTask, isOpenTaskForm])

    useEffect(() => {
        validate()
    }, [form])

    const validate = useCallback(() => {
        setErrors((prev) => {
            const newErrors = { ...prev }
            if (!form.title) {
                newErrors.title = "Required field"
            } else {
                newErrors.title = ""
            }

            if (!form.details) {
                newErrors.details = "Required field"
            } else {
                newErrors.details = ""
            }

            if (form.date === null || form.date?.toString() === "Invalid Date") {
                newErrors.date = "Invalid Date"
            } else {
                newErrors.date = ""
            }
            return newErrors
        })
    }, [form])

    const onChange = useCallback((field: FormFields): React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> => (e) => {
        setForm(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }, [])

    const onChangeDate = useCallback((value: Date | null) => {
        if (value) {
            setForm(prev => ({
                ...prev,
                date: new Date(value.toString())
            }))
        }
    }, [])

    const onBlur = useCallback((field: FormFields) => () => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }))
    }, [])

    const onClose = useCallback(() => {
        handleOpenTaskForm(false)
    }, [handleOpenTaskForm])

    const onSave = useCallback(() => {
        let field: FormFields
        for (field in touched) {
            onBlur(field)()
        }

        for (field in errors) {
            if (errors[field]) {
                return
            }
        }

        if (selectedTask) {
            editTask({ ...selectedTask, ...form, date: form.date ?? new Date() })
        } else {
            createTask({ ...form, date: form.date ?? new Date() })
        }
        onClose()
    }, [form, touched, errors, selectedTask])


    const onDeleteTask = useCallback(() => {
        if (selectedTask) {
            deleteTask(selectedTask)
            onClose()
        }
    }, [selectedTask, onClose])

    return (
        <Dialog
            open={isOpenTaskForm}
            onClose={onClose}
            classes={{ paper: styles.taskFormModal }}
        >
            <DialogTitle className={styles.taskFormModal__title}>
                Task {selectedTask !== null ? 'Edit' : 'Create'}
            </DialogTitle>
            <DialogContent>
                <form className={styles.taskFormModal__form}>
                    <TextField
                        label="Title"
                        variant="filled"
                        value={form.title}
                        onChange={onChange('title')}
                        onBlur={onBlur('title')}
                        required
                        error={touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                    />
                    <TextField
                        label="Details"
                        variant="filled"
                        multiline
                        rows={4}
                        value={form.details}
                        onChange={onChange('details')}
                        onBlur={onBlur('details')}
                        required
                        error={touched.details && !!errors.details}
                        helperText={touched.details && errors.details}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={form.date}
                            onChange={onChangeDate}
                            disabled={selectedTask?.isComplete}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    required
                                    onBlur={onBlur('date')}
                                    error={touched.date && !!errors.date}
                                    helperText={touched.date && errors.date}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </form>
            </DialogContent>
            <DialogActions className={styles.taskFormModal__actions}>
                {selectedTask !== null ? (
                    <Button
                        className={styles.taskFormModal__delete}
                        variant="outlined"
                        color="error"
                        onClick={onDeleteTask}
                    >
                        Delete
                    </Button>
                ) : <span />}
                <div className={styles.taskFormModal__buttons}>
                    <Button
                        variant="contained"
                        onClick={onSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default TaskFormModal