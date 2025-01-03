
import React from 'react';
import { Users, TrendingUp, School, BookOpen, LucideIcon, HelpCircle, ClipboardList, Building } from 'lucide-react';
import { useCourseListQuery } from '../../../store/slices/institutionSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';


type CardType = 'students' | 'performance' | 'courses' | 'quizzes';

interface CustomCardProps {
  title?: string;
  value?: string;
  type?: CardType;
  trend?: string;
}

interface CardConfig {
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

interface CardDisplayProps {
  course: string;
  quizze: string; 
  department?: string;
}

const cardConfigs: Record<CardType, CardConfig> = {
  
  students: {
    icon: Building,
    gradient: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-500'
  },
  performance: {
    icon: ClipboardList,
    gradient: 'from-green-50 to-green-100',
    iconColor: 'text-green-500'
  },
  courses: {
    icon: BookOpen,
    gradient: 'from-purple-50 to-purple-100',
    iconColor: 'text-purple-500'
  },
  quizzes: {
    icon: ClipboardList,
    gradient: 'from-orange-50 to-orange-100',
    iconColor: 'text-orange-500'
  }
};

const CustomCard: React.FC<CustomCardProps> = ({ 
  title = "Total Students",
  value = 4,
  type = "students",
}) => {
  const config = cardConfigs[type];
  const Icon = config.icon;

  return (
    <div className={`w-64 p-6 rounded-xl bg-gradient-to-br ${config.gradient} 
      shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const CardDisplay: React.FC<CardDisplayProps> = ({ course, quizze, department }) => {
  const { data = {} } = useCourseListQuery(null);
  const courses = data.data || [] as any;
  const cardData: CustomCardProps[] = [
    {
      title: "Total Departments",
      value: department,
      type: "students",
    },
    {
      title: "Total Tutors",
      type: "students",
    },
    {
      title: "Active Courses",
      value: course,
      type: "courses",
    },
    {
      title: "Active Quizzes",
      value: quizze,
      type: "quizzes",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ml-10 mt-10 max-w-[calc(2*256px+6rem)]">
      {cardData.map((card, index) => (
        <CustomCard 
          key={index}
          title={card.title}
          value={card.value}
          type={card.type}
          trend={card.trend}
        />
      ))}
    </div>
  );
};

export type { CustomCardProps, CardType };
export { CustomCard };
export default CardDisplay;