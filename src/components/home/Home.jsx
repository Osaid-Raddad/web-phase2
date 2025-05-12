import React, { useEffect, useRef, useState } from 'react';
import styles from './home.module.css';
import { Chart } from 'chart.js/auto';

export default function Home() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    projectCount: 0,
    studentCount: 0,
    taskCount: 0,
    finishedProjectCount: 0,
  });

  // Update current time every second
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

  // Fetch and calculate stats based on user role
  useEffect(() => {
    const getStats = () => {
      const signedInUser = JSON.parse(localStorage.getItem('SignedInUser'));
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const students = JSON.parse(localStorage.getItem('Students')) || [];

      if (!signedInUser) return;

      let projectCount = 0;
      let taskCount = 0;
      let finishedProjectCount = 0;
      let studentCount = students.length;

      if (signedInUser.role === 'Admin') {
        projectCount = projects.length;
        taskCount = tasks.length;
        finishedProjectCount = projects.filter(p => p.status === '100%').length;
      } else if (signedInUser.role === 'Student') {
        const username = signedInUser.username;
        projectCount = projects.filter(p => p.students.includes(username)).length;
        taskCount = tasks.filter(t => t.student === username).length;
        finishedProjectCount = projects.filter(
          p => p.students.includes(username) && p.status === '100%'
        ).length;
        studentCount = '-';
      }

      setStats({
        projectCount,
        studentCount,
        taskCount,
        finishedProjectCount
      });
    };

    getStats();
  }, []);

  // Chart update
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
  }, [stats]);

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
