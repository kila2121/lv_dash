import React, { useState, MouseEvent, TouchEvent, JSX, useEffect } from 'react';
import styles from '@/styles/page_styles/index.module.css'
import { AuthModal } from '../../component/authModal/authModal';
import { useAuth } from './_app';
import { SettingModal } from '../../component/Settings/settings';

interface Heart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

function ValentineCard(): JSX.Element {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [kissCount, setKissCount] = useState<number>(0);
  const [secretVisible, setSecretVisible] = useState<boolean>(false);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const {user, userSetting} = useAuth()
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsClient(true);
      const savedCount = localStorage.getItem('currentKissCount');
      if (savedCount) {
        setKissCount(Number(savedCount));
      }

      const savedTheme = localStorage.getItem('valentine-theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    }, 100);
    return () => clearTimeout(timer)
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('valentine-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  const startDay = new Date("02-02-2026"); 
  const currentDay = new Date();
  const meetingDate = userSetting?.want_to_date? new Date (userSetting.want_to_date): null;

  currentDay.setHours(0, 0, 0, 0);
  if(meetingDate){
    meetingDate.setHours(0, 0, 0, 0);
  }
  
  const daysTogether: number = Math.floor((Number(currentDay) - Number(startDay)) / (1000 * 60 * 60 * 24));
  const meetingDay: number | string = userSetting?.want_to_date? Math.floor(
      (new Date(userSetting.want_to_date).getTime() - currentDay.getTime()) / 
      (1000 * 60 * 60 * 24)
    )
  : 'не указана';

  const personalDetails = {
    yourName: 'Тема',
    herName: 'Дашик',
    daysTogether: daysTogether,
    ourDate: '9 ноября 2026',
    petNames: ['зайка', 'солнышко', 'ласточка', 'радость моя'],
    promises: [
      'Слушать твои истории, даже самые незначительные',
      'Пить только с тобой :)',
      'Помнить, как ты любишь кофе',
      'Обнимать тебя так крепко, как будто это последний раз'
    ]
  };

  const createHeart = (e: MouseEvent | TouchEvent) => {
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const emojis = ['💕', '✨', '🌸', '💫', '🕊️', '🌼'];
    const heart: Heart = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    };
    
    setHearts(prev => [...prev, heart]);
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id));
    }, 2000);
  };

  const handleHeartClick = () => {
    const newCount = kissCount + 1;
    setKissCount(newCount);
    
    if (newCount === 3) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }
    
    if (newCount === 7) {
      setSecretVisible(true);
    }
  };
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('currentKissCount', kissCount.toString());
    }
  }, [kissCount, isClient]);

  const handleClick = (e: MouseEvent) => createHeart(e);
  const handleTouch = (e: TouchEvent) => createHeart(e);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (isClient) {
        localStorage.setItem('valentine-theme', newValue ? 'dark' : 'light');
      }
      return newValue;
    });
  };

  const adminModalOpen = (e: React.MouseEvent) =>{
    e.stopPropagation();
    setIsAuthModalOpen(true)
  }

  const settingModalOpen = (e: React.MouseEvent) =>{
    e.stopPropagation();
    setIsSettingModalOpen(true)
  }


  if (!isClient) {
    return (
      <div className={styles.valentinePage}>
        <div className={styles.valentineContainer}>
          <header className={styles.header}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>
                Для тебя, моя {personalDetails.petNames[0]}
              </h1>
            </div>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.valentinePage} ${isDarkMode ? styles.darkTheme : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <div className={styles.topControls}>
        <button 
          className={styles.themeToggle}
          onClick={toggleTheme}
        >
          {isDarkMode ? 'Белая тема' : 'Темная тема'}
        </button>
        
        {!user?<button className={styles.adminButton}onClick={adminModalOpen}>Войти</button>:<></>}

        {user?.login==="Admin"?<button onClick={settingModalOpen}>Настройки</button>:<></>}

      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        className={styles.authModal}
        theme={isDarkMode}
      />
      <SettingModal 
        isOpen={isSettingModalOpen}
        onClose={()=>setIsSettingModalOpen(false)}
        className={styles.settModal}
        theme={isDarkMode}
        />
      <div className={styles.backgroundElements}>
        <div className={styles.floatingOrnament}>❦</div>
        <div className={styles.floatingOrnament} style={{ left: '15%', top: '20%', animationDelay: '1.2s' }}>✽</div>
        <div className={styles.floatingOrnament} style={{ left: '85%', top: '30%', animationDelay: '2.5s' }}>❁</div>
        <div className={styles.floatingOrnament} style={{ left: '10%', top: '70%', animationDelay: '3.1s' }}>✿</div>
        <div className={styles.floatingOrnament} style={{ left: '90%', top: '80%', animationDelay: '1.8s' }}>❀</div>
      </div>

      {hearts.map(heart => (
        <div
          key={heart.id}
          className={styles.flyingElement}
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {showSparkles && (
        <div className={styles.sparkleOverlay}>
          <div className={styles.sparkle}>✨</div>
          <div className={styles.sparkle} style={{ left: '30%', top: '40%', animationDelay: '0.3s' }}>✨</div>
          <div className={styles.sparkle} style={{ left: '70%', top: '60%', animationDelay: '0.6s' }}>✨</div>
        </div>
      )}

      <div className={styles.valentineContainer}>
        
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>
              Для тебя, моя {personalDetails.petNames[0]}
            </h1>
            <p className={styles.subtitle}>
              Просто письмо от сердца к сердцу
            </p>
            {userSetting?.want_to_date && (
              <div className={styles.meetingCounter}>
                {typeof meetingDay === 'number' && meetingDay > 0 ? (
                  <span className={styles.meetingText}>
                    мы увидимся с тобой через: <span className={styles.meetingNumber}>{meetingDay}</span> <span className={styles.meetingUnit}>дн.</span>
                  </span>
                ) : typeof meetingDay === 'number' && meetingDay === 0 ? (
                  <span className={`${styles.meetingText}`}>
                    Сегодня!
                  </span>
                ) : typeof meetingDay === 'number' && meetingDay < 0 ? (
                  <span className={`${styles.meetingText}`}>
                    встреча была <span className={styles.meetingNumber}>{Math.abs(meetingDay)}</span> <span className={styles.meetingUnit}>дн.</span> назад
                  </span>
                ) : <></>}
              </div>
            )}
          </div>
          
          <div className={styles.dateStamp}>
            <div className={styles.dateStampInner}>
              <span className={styles.dateNumber}>{personalDetails.daysTogether}</span>
              <span className={styles.dateLabel}>день</span>
            </div>
            <div className={styles.dateStampText}>с тех пор, как моё сердце узнало твоё</div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.heartSection}>
            <div 
              className={`${styles.mainHeart} ${kissCount >= 3 ? styles.heartWarm : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleHeartClick();
              }}
            >
              <div className={styles.heartOutline}></div>
              <div className={styles.heartFill}>♥</div>
              {showSparkles && <div className={styles.heartSparkle}>✧</div>}
            </div>
            
            <div className={styles.instructions}>
              <p className={styles.instructionText}>
                Прикоснись к сердцу — оно бьётся только для тебя
              </p>
              <div className={styles.counterWrapper}>
                <span className={styles.counterLabel}>Сердцебиений:</span>
                <span className={styles.counterValue}>{kissCount}</span>
              </div>
            </div>
          </div>

          <div className={styles.letter}>
            <div className={styles.letterContent}>
              <div className={styles.letterHeader}>
                <span className={styles.letterDate}>14 февраля</span>
                <span className={styles.letterAddress}>Моей единственной</span>
              </div>
              
              <div className={styles.letterBody}>
                <p className={styles.letterParagraph}>
                  Моя дорогая Даша,
                </p>
                
                <p className={styles.letterParagraph}>
                  Сегодня утром я проснулся и первая мысль была о тебе. 
                  О том, как ты улыбаешься, когда ещё не совсем проснулась. 
                  О том, как твои глаза становятся узкими-узкими, когда ты смеёшься от души. 
                  О том, как ты прикасаешься ко мне, и мир вокруг замирает.
                </p>
                
                <p className={styles.letterParagraph}>
                  Знаешь, я никогда не верил, что можно чувствовать столько тепла 
                  от одного человека. Ты как домашний очаг в холодный день — 
                  стоишь рядом с тобой, и всё внутри оттаивает, становится мягким 
                  и спокойным.
                </p>
                
                <p className={styles.letterParagraph}>
                  Я люблю в тебе всё: и твою решительность, когда ты что-то задумала, 
                  и твою беззащитность, когда ты устала. Твой смех, который звенит 
                  как колокольчик. Твоё молчание, которое говорит больше слов. 
                  Твои руки, которые так умеют быть нежными.
                </p>
                
                <p className={styles.letterParagraph}>
                  Спасибо тебе за каждый наш день. За то, что ты есть. 
                  За то, что ты — это ты.
                </p>
                
                <div className={styles.letterSignature}>
                  <p>Твой</p>
                  <p className={styles.signatureName}>{personalDetails.yourName}</p>
                </div>
              </div>
            </div>
            
            <div className={styles.letterSeal}>
              <div className={styles.sealCircle}></div>
              <span className={styles.sealText}>Любовь</span>
            </div>
          </div>

          <div className={styles.promisesSection}>
            <h3 className={styles.sectionTitle}>Обещаю тебе, моя любимая:</h3>
            <div className={styles.promisesGrid}>
              {personalDetails.promises.map((promise, index) => (
                <div key={index} className={styles.promiseCard}>
                  <div className={styles.promiseNumber}>0{index + 1}</div>
                  <p className={styles.promiseText}>{promise}</p>
                  <div className={styles.promiseUnderline}></div>
                </div>
              ))}
            </div>
          </div>

          {secretVisible && (
            <div className={styles.secretReveal}>
              <div className={styles.secretEnvelope}>
                <div className={styles.envelopeFlap}></div>
                <div className={styles.envelopeBody}>
                  <h4 className={styles.secretTitle}>Ты нашла моё самое сокровенное...</h4>
                  <p className={styles.secretText}>
                    Я сохраню твоё сердце бережнее, чем самое драгоценное сокровище. 
                    И буду любить тебя каждый день сильнее, чем вчера.
                  </p>
                  <div className={styles.secretKiss}>💋</div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.wishSection}>
            <div className={styles.wishContent}>
              <p className={styles.wishText}>
                Пусть каждый твой день будет наполнен тем светом, 
                который ты даришь мне. И пусть моя любовь будет для тебя 
                таким же тёплым и безопасным местом, каким ты стала для меня.
              </p>
              <div className={styles.wishDecoration}>
                <span>С</span>
                <span className={styles.wishHeart}>♥</span>
                <span>любовью</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ValentineCard;