import React, { useState } from 'react';
import styles from './signUp.module.css';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [isStudent, setIsStudent] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsStudent(!isStudent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const admins = JSON.parse(localStorage.getItem('Admins')) || [];
    const students = JSON.parse(localStorage.getItem('Students')) || [];

    
    const isUsernameTaken = admins.some(a => a.username === username) ||
                            students.some(s => s.username === username);

    if (isUsernameTaken) {
      toast.error('Username already exists. Please choose a different one.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
      return;
    }

    if (isStudent) {
      
      const isValidId = /^\d{8}$/.test(universityId);
      if (!isValidId) {
        toast.error('University ID must be exactly 8 digits.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
          });
        return;
      }

      const isIdTaken = students.some(s => s.universityId === universityId);
      if (isIdTaken) {
        toast.error('University ID already exists.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
          });
        return;
      }

      
      students.push({ username, password, universityId });
      localStorage.setItem('Students', JSON.stringify(students));
      toast.success(`Student ${students[students.length - 1].username} registered successfully!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
    } else {
     
      admins.push({ username, password });
      localStorage.setItem('Admins', JSON.stringify(admins));
      toast.success(`Admin  ${admins[admins.length - 1].username} registered successfully!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
    }

   
    setUsername('');
    setPassword('');
    setUniversityId('');
    setIsStudent(false);
    
    navigate('/');
  
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className={`bg-zinc-900 p-8 rounded-lg shadow-md w-80 text-white ${styles.pad}`}>
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 rounded bg-zinc-800 ${styles.input}`}
            required
          />

          <label className="block mt-4 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 rounded bg-zinc-800 ${styles.input}`}
            required
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="student"
              checked={isStudent}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="student">I am a student</label>
          </div>

          {isStudent && (
            <>
              <label className="block mt-4 mb-1">University ID</label>
              <input
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className={`w-full p-2 rounded bg-zinc-800 ${styles.input}`}
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 mt-4 p-2 rounded text-white font-semibold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}