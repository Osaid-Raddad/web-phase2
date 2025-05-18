import React, { useState, useEffect } from 'react';
import styles from './project.module.css';

export default function Project() {
  const [students, setStudents] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formError, setFormError] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveduser, setSavedUser] = useState(() => {
    const saved = localStorage.getItem('SignedInUser');
    return saved ? JSON.parse(saved) : {};
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    students: [],
    category: "",
    startDate: "",
    endDate: "",
    statusValue: "In Progress",
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load students from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('Students');
    if (storedData) {
      try {
        setStudents(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing students from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = () => {
    const { title, description, category, startDate, endDate } = newProject;
    if (!title.trim() || !description.trim() || !category || category === "Select a category" || !startDate || !endDate) {
      setFormError("Please fill out all fields before submitting.");
      return;
    }

    const selectedStudents = selectedIndices.map(index => students[index]?.username).filter(Boolean);

    const statusMap = {
      "Completed": "100%",
      "In Progress": "50%",
      "Pending": "10%",
      "On Hold": "20%",
      "Cancelled": "0%"
    };

    const projectToAdd = {
      ...newProject,
      students: selectedStudents,
      status: statusMap[newProject.statusValue] || "0%"
    };

    setProjects(prev => [...prev, projectToAdd]);
    setShowModal(false);
    setSelectedIndices([]);
    setFormError("");
    setNewProject({
      title: "",
      description: "",
      students: [],
      category: "",
      startDate: "",
      endDate: "",
      statusValue: "In Progress",
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "in-progress" && project.status === "50%") ||
      (statusFilter === "completed" && project.status === "100%") ||
      (statusFilter === "pending" && project.status === "10%") ||
      (statusFilter === "on-hold" && project.status === "20%") ||
      (statusFilter === "cancelled" && project.status === "0%");

    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const toggleStudentSelection = (index) => {
    setSelectedIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen text-white p-4 w-full mt-12 flex flex-col items-center">
      <div className="mt-12 flex flex-col  w-300 justify-center">
        <h4 className={`text-base font-bold mb-4 -mx-20 ${styles.projectsTitle}`}>Projects Overview</h4>
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={saveduser.role === 'Admin' ? () => setShowModal(true) : () => setShowModal(false)}
            className="bg-blue-500 hover:bg-blue-800 text-white px-3 py-2 rounded w-[215px]"
          >
            Add New Project
          </button>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded bg-white text-black w-full"
          />
          <select
            className="px-4 py-2 rounded bg-white text-black font-bold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {saveduser.role === 'Admin' ? (
          <div className="flex justify-center w-full">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5 px-4 max-w-6xl">
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedProject(project)}
                  style={{ backgroundColor: '#333333' }}
                  className={`p-3 rounded-lg ring-2 h-[280px] w-[320px]
                    ${selectedProject === project ? 'ring-orange-400' : 'ring-white'} 
                    hover:ring-blue-500`}
                >
                  <h5>{project.title}</h5>
                  <p><span className="font-bold">Description:</span> {project.description}</p>
                  <p><span className="font-bold">Students:</span> {project.students.join(", ")}</p>
                  <p><span className="font-bold">Category:</span> {project.category}</p>
                  <div style={{ backgroundColor: '#444444', position: 'relative' }} className="w-full rounded-[5px] h-5 mt-2">
                    <div className="bg-blue-500 h-5 rounded-[5px]" style={{ width: project.status }}></div>
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="mt-2 text-white text-sm">{project.startDate}</p>
                    <p className="mt-2 text-white text-sm">{project.endDate}</p>
                  </div>
                </div>
              ))}
            </div>  
          </div>
        ) : saveduser.role === 'Student' ? (
          <div className="flex justify-center w-full">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5 px-4 max-w-6xl">
              {filteredProjects
                .filter(project => project.students.includes(saveduser.username))
                .map((project, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedProject(project)}
                    style={{ backgroundColor: '#333333' }}
                    className={`p-3 rounded-lg ring-2 h-[280px] w-[320px]
                      ${selectedProject === project ? 'ring-orange-400' : 'ring-white'} 
                      hover:ring-blue-500`}
                  >
                    <h5>{project.title}</h5>
                    <p><span className="font-bold">Description:</span> {project.description}</p>
                    <p><span className="font-bold">Students:</span> {project.students.join(", ")}</p>
                    <p><span className="font-bold">Category:</span> {project.category}</p>
                    <div style={{ backgroundColor: '#444444', position: 'relative' }} className="w-full rounded-[5px] h-5 mt-2">
                      <div className="bg-blue-500 h-5 rounded-[5px]" style={{ width: project.status }}></div>
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="mt-2 text-white text-sm">{project.startDate}</p>
                      <p className="mt-2 text-white text-sm">{project.endDate}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-red-400 text-center mt-5">
            Unknown role.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setFormError("");
            }
          }}>
          <div style={{ backgroundColor: '#1e1e1e' }} className="rounded-lg w-full ring-1 ring-neutral-400 max-w-lg p-4 shadow-xl relative">
            <div className={`flex ${styles.design}`}>
              <h4 className="text-blue-500 text-xl font-bold mb-4">Add New Project</h4>
              <button onClick={() => { setShowModal(false); setFormError(""); }} className=" font-bold text-2xl mx-2 my-2 fs-4 fw-bold">&times;</button>
            </div>

            <div className="space-y-3">
              {formError && <p className="text-red-500 font-semibold">{formError}</p>}
                
              <div>
                <label className="block font-bold mb-1">Project Title:</label>
                <input type="text" name="title" value={newProject.title} onChange={handleInputChange}
                  placeholder="Enter project title" style={{ backgroundColor: '#333333' }}
                  className="w-full p-2 my-1 rounded text-white" />
              </div>

              <div>
                <label className="block font-bold mb-1">Project Description:</label>
                <textarea name="description" value={newProject.description} onChange={handleInputChange}
                  placeholder="Enter project description" style={{ backgroundColor: '#333333' }}
                  className="w-full p-2 my-1 rounded text-white" />
              </div>

              <div>
                <label className="block font-bold mb-2">Students List:</label>
                <ul style={{ backgroundColor: '#333333' }} className="text-white p-2 rounded h-[95px] overflow-y-auto">
                  {students.length === 0 ? (
                    <li>No students found.</li>
                  ) : (
                    students.map((student, index) => (
                      <li
                        key={index}
                        onClick={() => toggleStudentSelection(index)}
                        className={`mb-1 cursor-pointer rounded px-2 ${
                          selectedIndices.includes(index) ? 'bg-blue-600 text-white' : ''
                        }`}
                      >
                        {student.username}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <label className="block font-bold mb-1">Project Category:</label>
                <select name="category" value={newProject.category} onChange={handleInputChange}
                  style={{ backgroundColor: '#333333' }} className="w-full p-2 my-1 rounded text-white">
                  <option>Select a category</option>
                  <option>Website Redesign</option>
                  <option>Embedded Systems</option>
                  <option>AI & Machine Learning</option>
                  <option>Data Science</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Starting Date:</label>
                <input type="date" name="startDate" value={newProject.startDate} onChange={handleInputChange}
                  style={{ backgroundColor: '#333333' }} className="w-full p-2 my-1 rounded text-white" />
              </div>

              <div>
                <label className="block font-bold mb-1">Ending Date:</label>
                <input type="date" name="endDate" value={newProject.endDate} onChange={handleInputChange}
                  style={{ backgroundColor: '#333333' }} className="w-full p-2 my-1 rounded text-white" />
              </div>

              <div>
                <label className="block font-bold mb-1">Project Status:</label>
                <select name="statusValue" value={newProject.statusValue} onChange={handleInputChange}
                  style={{ backgroundColor: '#333333' }} className="w-full p-2 my-1 rounded text-white">
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleAddProject}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded w-full font-bold mt-2"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedProject && (
        <div
          className="fixed inset-0 flex items-end justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div style={{ backgroundColor: '#1e1e1e' }} className=" w-[400px] h-full max-w-lg p-4 shadow-xl/20 relative">
            <h4 style={{ color: '#0ab4cb' }} className="text-blue-500 w-full text-xl font-bold">{selectedProject.title}</h4>
            <div className="bg-neutral-700 w-full h-[1px] mb-3"></div>
            <div className="text-white space-y-2">
              <p><span className="font-bold">Description:</span> {selectedProject.description}</p>
              <p><span className="font-bold">Category:</span> {selectedProject.category}</p>
              <p><span className="font-bold">Students:</span> {selectedProject.students.join(", ")}</p>
              <p><span className="font-bold">Start Date:</span> {selectedProject.startDate}</p>
              <p><span className="font-bold">End Date:</span> {selectedProject.endDate}</p>
            </div>

            <h4 style={{ color: '#0ab4cb' }} className="text-blue-500 text-xl font-bold mt-4">Tasks</h4>
            <div className="bg-neutral-700 w-full h-[1px] mb-3"></div>
            <div className="space-y-2 h-[520px] overflow-y-auto p-2">
              {tasks.filter(task => task.project === selectedProject.title).length === 0 ? (
                <p className="text-neutral-400">No tasks for this project.</p>
              ) : (
                tasks
                  .filter(task => task.project === selectedProject.title)
                  .map((task, index) => (
                    <div key={index} style={{ backgroundColor: '#333333' }} className="p-2 rounded ring-1 ring-teal-400 mb-3">
                      <p><span className="font-bold">Task:</span> {task.name}</p>
                      <p><span className="font-bold">Description:</span> {task.description}</p>
                      <p><span className="font-bold">Assigned to:</span> {task.student}</p>
                      <p><span className="font-bold">Status:</span> {task.status}</p>
                      <p><span className="font-bold">Due Date:</span> {task.dueDate}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

}