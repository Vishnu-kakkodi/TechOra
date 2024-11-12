import React, { useState } from 'react'
import CardDisplay from '../../components/card/institutionDashboard/CustomCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TutorAdd from '../../components/modals/Institute/TutorAdd';
import {store} from '../../store';




const InstitutionDashboard: React.FC = () => {

  const [tutorAdd, setTutorAdd] = useState(false);

  const instituteData = useSelector((state: RootState) => state.auth.institutionInfo);
  
  console.log("kakaka")
  console.log(instituteData, "kkkjdjd")

  const handleTutor = () =>{
    setTutorAdd(true)
  }

  console.log("Current Redux Store State:", store.getState());

  return (
    <div>
      <h1 className='text-center text-[40px] mt-5 font-bold'>College of Engineering Trivandrum</h1>

      <div className='flex justify-end'>
        <button onClick={handleTutor} className='bg-gold rounded-[10px] p-2 mt-10 '>Add Tutor</button>
      </div>
      <div>
        <CardDisplay />;
      </div>

      {tutorAdd && (
  <TutorAdd setTutorAdd={setTutorAdd} instituteId={instituteData} />
)}
    </div>
  )
};

export default InstitutionDashboard;