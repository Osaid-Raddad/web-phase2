import React, { useState, useEffect } from "react";
import styles from "./task.module.css";

const Task = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("status");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [formData, setFormData] = useState({
    project: "",
    name: "",
    description: "",
    student: "",
    status: "",
    dueDate: "",
  });

  // جلب بيانات الطلاب المسجلين في الجلسة من localStorage
const loggedInStudents = JSON.parse(localStorage.getItem("Students")) || [];


  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, formData]);
    setFormData({
      project: "",
      name: "",
      description: "",
      student: "",
      status: "",
      dueDate: "",
    });
    setIsModalOpen(false);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    const sorted = [...tasks].sort((a, b) => {
      if (value === "status") return a.status.localeCompare(b.status);
      if (value === "project") return a.project.localeCompare(b.project);
      if (value === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (value === "student") return a.student.localeCompare(b.student);
      return 0;
    });

    setTasks(sorted);
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="flex justify-between items-center p-2 my-4 mb-4">
        <div>
          <label className="mr-2 font-semibold">Sort By:</label>
          <select
            className="bg-[#2b2b2b] text-white border border-gray-700 rounded px-3 py-1"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="status">Task Status</option>
            <option value="project">Project</option>
            <option value="dueDate">Due Date</option>
            <option value="student">Assigned Student</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Create a New Task
        </button>
      </div>

      <div className="overflow-x-auto mx-4">
        <table className="w-full table-auto text-sm border-collapse bg-[#1e1e1e] rounded-lg border border-black">
          <thead>
            <tr className="bg-[#2a2a2a] text-white text-left">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Task Name</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Assigned Student</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-700">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{task.project}</td>
                  <td className="px-3 py-2">{task.name}</td>
                  <td className="px-3 py-2">{task.description}</td>
                  <td className="px-3 py-2">{task.student}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`font-medium ${
                        task.status === "Completed"
                          ? "text-green-400"
                          : task.status === "In Progress"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{task.dueDate}</td>
                </tr>
                <tr>
                  <td colSpan="7">
                    <div className="border-b border-gray-400 w-full"></div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={styles.closeBtn}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-blue-500 mb-4">
              Create New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Project Title:</label>
                <select
                  name="project"
                  required
                  value={formData.project}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a project</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="E-commerce Platform">E-commerce Platform</option>
                  <option value="jhk">jhk</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Task Name:</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.input}
                ></textarea>
              </div>

              {/* تعديل هنا: جلب الطلاب من localStorage */}
              <div>
                <label className="block mb-1 font-semibold">Assigned Student:</label>
                <select
                  name="student"
                  required
                  value={formData.student}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a student</option>
                  {/* عرض الطلاب المسجلين فقط */}
                  {loggedInStudents.map((student, index) => (
                    <option key={index} value={student.username}>
                      {student.username}
                    </option>
                  ))}
                </select>
              </div>










              <div>
                <label className="block mb-1 font-semibold">Status:</label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
