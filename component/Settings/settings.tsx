import { DetailedHTMLProps, HTMLAttributes, JSX, useEffect, useState } from 'react'
import styles from './settings.module.css'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/pages/_app';

interface SettingModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  theme: boolean;
}

export interface SettingUser{
  want_to_date: string | null;
}

export const SettingModal = ({ isOpen, onClose, className, theme, ...props }: SettingModalProps): JSX.Element => {

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm<SettingUser>({mode: 'onBlur'})

  const [SettingError, setSettingError] = useState<string>('')
  const { setUserSetting, logout} = useAuth()
  
  useEffect(() => {
    if (!isOpen) {
      reset()
      setTimeout(()=>{
        setSettingError('')
      }, 100)
    }
  }, [isOpen, reset])

  const handleClose = () => {
    onClose()
  }

  const onSubmit = (data: SettingUser) => {
    try {
      setUserSetting({ want_to_date: data.want_to_date });
      onClose();

    } catch (error) {
      setSettingError('Ошибка при сохранении');
    }
  }

  const handleLogout = () => {
    logout()
    reset()
    onClose()
  }

  const cancelMint = () => {
    setUserSetting({ want_to_date: null });
    reset()
    onClose()
  }

  if (!isOpen) return <></>

  return (
    <div className={theme ? styles.darkTheme : ''}>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`} 
        onClick={handleClose}
      />
      
      {/* Боковая панель настроек */}
      <div
        className={`${styles.settingsPanel} ${isOpen ? styles.open : ''} ${className || ''}`}
        {...props}
      >
        <div className={`${styles.header}`}>
          <h2>Настройки</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            type="button"
            aria-label="Закрыть панель настроек"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="want_to_date">Когда приедешь ?</label>
            <input
              id="want_to_date"
              type="date"
              className={`${styles.input} ${errors.want_to_date ? styles.error : ''}`}
              {...register('want_to_date', { 
                required: 'Дата прибытия обязательна' 
              })}
            />
            {errors.want_to_date && (
              <span className={styles.errorMessage}>{errors.want_to_date.message}</span>
            )}
          </div>

          {SettingError && (
            <div className={styles.errorMessage}>{SettingError}</div>
          )}
          <button onClick={cancelMint}>Отменить приезд</button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button className={styles.adminButton} onClick={handleLogout}>Выйти</button>
        </form>
      </div>
    </div>
  )
}