import { DetailedHTMLProps, HTMLAttributes, JSX, useEffect, useState } from 'react'
import styles from './authModal.module.css'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/pages/_app';

interface AuthModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

interface FormDataProps {
  login: string;
  password: string;
}

export const AuthModal = ({ isOpen, onClose, className, ...props }: AuthModalProps): JSX.Element => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm<FormDataProps>({mode: 'onBlur'})

  const [authError, setAuthError] = useState<string>('')
  const {setUser} = useAuth()
  
  useEffect(() => {
    if (!isOpen) {
      reset()
      setTimeout(()=>{
        setAuthError('')
      }, 100)
    }
  }, [isOpen, reset])

  const handleClose = () => {
    onClose()
  }

  const onSubmit = (data: FormDataProps) => {
    try {
        if (data.login === 'admin' && data.password === 'love_dash') {
            setUser({ login: 'Admin' });
            onClose();
        }else{
            setAuthError('Неверный логин или пароль');
        }
    } catch (error) {
      setAuthError('Ошибка соединения')
    }
  }

  if (!isOpen) return <></>

  return (
    <div 
        className={`${styles.overlay} ${className || ''}`} 
        onClick={handleClose}
        {...props}>

      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className={styles.header}>
          <h2>Вход в админку</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            type="button"
            aria-label="Закрыть модальное окно"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="login" className={styles.label}>
                Логин
              </label>
              <input
                id="login"
                type="text"
                className={`${styles.input} ${errors.login ? styles.inputError : ''}`}
                placeholder="Введите логин"
                {...register('login', {
                  required: 'Введите логин',
                })}
              />
              {errors.login && (
                <span className={styles.errorText}>{errors.login.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Введите пароль"
                {...register('password', {
                  required: 'Введите пароль',
                })}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password.message}</span>
              )}
            </div>
          </div>

          {authError && (
            <div className={styles.errorMessage} role="alert">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}