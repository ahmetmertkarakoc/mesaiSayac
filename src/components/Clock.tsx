import { useState, useEffect } from 'react';

const Clock = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('tr-TR', options);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  
  return (
    <div className="text-center">
      <div className="text-lg font-medium">{formatDate(date)}</div>
      <div className="text-2xl font-bold">{formatTime(date)}</div>
    </div>
  );
};

export default Clock;