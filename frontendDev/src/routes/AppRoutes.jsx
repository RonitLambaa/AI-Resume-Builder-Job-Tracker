import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import { Login, Dashboard, Signup, ResumesPage } from '../pages/index';
import ResumeForm from '../features/resume/ResumeForm';
import ResumeDetail from '../features/resume/ResumeDetail';
import ResumeEditForm from '../features/resume/resumeEditForm';
import JobTracker from '../features/jobs/JobTracker';
import AddJobForm from '../features/jobs/AddJobForm';
import PrivateRoute from './PrivateRoute';
import { useSelector } from 'react-redux';

function AppRoutes() {

  const authStaus = useSelector((state) => state.auth.status)
  const HomeElem  = authStaus ? <Dashboard/> : <Home/>

  return (
    <Routes>
        <Route path='/' element={HomeElem}/>
        <Route path = '/login' element = {<Login />} />
        <Route path = '/dashboard' element = {<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path = '/signup' element = {<Signup/>} />
        <Route path = '/resumes' element = {<PrivateRoute><ResumesPage/></PrivateRoute>} />
        <Route path = '/resumes/add' element = {<PrivateRoute><ResumeForm/></PrivateRoute>} />
        <Route path = '/resumes/:id' element = {<PrivateRoute><ResumeDetail/></PrivateRoute>} />
        <Route path = '/resumes/:id/edit' element = {<PrivateRoute><ResumeEditForm/></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobTracker /></PrivateRoute>} />
        <Route path="/jobs/add" element={<PrivateRoute><AddJobForm /></PrivateRoute>} />
        <Route path="/jobs/:jobId/edit" element={<PrivateRoute><AddJobForm /></PrivateRoute>} />
    </Routes>
  )
}

export default AppRoutes;