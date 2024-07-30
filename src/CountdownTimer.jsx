import React, { useState, useEffect, useRef } from 'react';
import './assets/countdownTimer.css';

const CountdownTimer = () => {
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [timeLeft, setTimeLeft] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const intervalRef = useRef(null);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const alertTimeoutRef = useRef(null);


    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const eventDateTime = new Date(`${eventDate}T${eventTime}`);
                const timeDifference = eventDateTime - now;

                if (timeDifference <= 0) {
                    clearInterval(intervalRef.current);
                    setTimeLeft({});
                    setIsActive(false);
                    setAlertMessage('Change the time');
                    startAlertTimeout();
                    return;
                }

                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [isActive, isPaused, eventDate, eventTime]);

    useEffect(() => {
        document.body.className = isDarkTheme ? 'dark' : 'light';
    }, [isDarkTheme]);

    const handleStart = () => {
        if (!eventDate || !eventTime) {
            setAlertMessage('Please enter date or time.');
            startAlertTimeout();
            return;
        }
        setIsActive(true);
        setIsPaused(false);
        setAlertMessage('Started');
        startAlertTimeout();
    };

    const handleStop = () => {
        setIsPaused(true);
        clearInterval(intervalRef.current);
        setAlertMessage('The timer has been stopped.');
        startAlertTimeout();
    };

    const handleResume = () => {
        setIsPaused(false);
        setAlertMessage('The timer has been resumed.');
        startAlertTimeout();
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        clearInterval(intervalRef.current);
        setTimeLeft({});
        setEventDate('');
        setEventTime('');
        setAlertMessage('The timer has been reset.');
        startAlertTimeout();
    };

    const toggleTheme = () => {
        setIsDarkTheme((prevTheme) => !prevTheme);
    };

    const startAlertTimeout = () => {
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        alertTimeoutRef.current = setTimeout(() => {
            setAlertMessage('');
        }, 5000); // 5000 milliseconds = 5 seconds
    };

    return (
        <div className={`container ${isDarkTheme ? 'dark' : 'light'}`}>
            <h1>Countdown Timer</h1>
            <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
            />
            <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
            />
            <button onClick={handleStart} disabled={isActive && !isPaused}>Start Countdown</button>
            <button onClick={handleStop} disabled={!isActive || isPaused}>Stop</button>
            <button onClick={handleResume} disabled={!isActive || !isPaused}>Resume</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <div id="countdown">
                <div><span>{timeLeft.days || '00'}</span> Days</div>
                <div><span>{timeLeft.hours || '00'}</span> Hours</div>
                <div><span>{timeLeft.minutes || '00'}</span> Minutes</div>
                <div><span>{timeLeft.seconds || '00'}</span> Seconds</div>
            </div>
            {alertMessage && (
                <React.Fragment>
                    <div className="alert">{alertMessage}</div>
                </React.Fragment>
            )}
        </div>
    );
};

export default CountdownTimer;
