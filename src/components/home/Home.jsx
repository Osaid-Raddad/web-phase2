// Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './home.module.css';
import { Chart } from 'chart.js/auto';

export default function Home() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });


  const stats = {
    projectCount: 2,
    studentCount: 2,
    taskCount: 2,
    finishedProjectCount: 1
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Projects', 'Students', 'Tasks', 'Finished Projects'],
        datasets: [{
          label: 'Count',
          data: [
            stats.projectCount,
            stats.studentCount === '-' ? 0 : stats.studentCount,
            stats.taskCount,
            stats.finishedProjectCount
          ],
          backgroundColor: [
            'rgb(41, 63, 62)',
            'rgb(37, 57, 71)',
            'rgb(75, 65, 42)',
            'rgb(55, 44, 75)'
          ],
          borderColor: ['cyan', 'lightblue', 'yellow', 'violet'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);

  return (
    <div className={styles.container}>
       <div className={styles.headerContainer}>
        <h1 className={styles.header}>Welcome to the Task Management System</h1>
        <span className={`${styles.datetime} text-white`}>{formattedTime}</span>
      </div>


      <div className={styles.cards}>
        <div className={styles.card}><p>Number of Projects</p><h2>{stats.projectCount}</h2></div>
        <div className={styles.card}><p>Number of Students</p><h2>{stats.studentCount}</h2></div>
        <div className={styles.card}><p>Number of Tasks</p><h2>{stats.taskCount}</h2></div>
        <div className={styles.card}><p>Number of Finished Projects</p><h2>{stats.finishedProjectCount}</h2></div>
      </div>

      <h2 className={styles.chartTitle}>Admin Dashboard Overview</h2>
      <div className={styles.chartWrapper}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
