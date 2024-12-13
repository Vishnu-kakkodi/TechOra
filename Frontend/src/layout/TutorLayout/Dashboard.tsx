import React, { useState } from 'react'
import CardDisplay from '../../components/card/institutionDashboard/CustomCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TutorAdd from '../../components/modals/Institute/TutorAdd';
import { store } from '../../store';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart'
import PopularCourse from '../../pages/institute/PopularCourse';
import InstituteFooter from '../../components/footer/InstituteFooter';
import { useChartDataQuery } from '../../store/slices/institutionSlice';
import { Link } from 'react-router-dom';
import { Book, Clock, Eye } from 'lucide-react';
import { QuizDocument } from '../../types/quizType';
import TutorSidebar from '../../components/sidebar/tutorSidebar';





const Dashboard: React.FC = () => {

  const tutorData = useSelector((state: RootState) => state.auth.tutorInfo);

  return (
    <div className='flex'>
    <TutorSidebar />
    </div>

  )
};

export default Dashboard;