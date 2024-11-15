import React from 'react';
import { Users, TrendingUp, School, BookOpen, LucideIcon,  HelpCircle, ClipboardList } from 'lucide-react';

type CardType =  'students' |'students' | 'performance' | 'courses' | 'quizzes';

interface CustomCardProps {
  title?: string;
  value?: string | number;
  type?: CardType;
  trend?: string;
}

interface CardConfig {
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

const cardConfigs: Record<CardType, CardConfig> = {
  students: {
    icon: Users,
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
  value = "396",
  type = "students",
  trend = "+12% from last month"
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
        <p className="text-xs text-gray-500">{trend}</p>
      </div>
    </div>
  );
};

const CardDisplay: React.FC = () => {
  const cardData: CustomCardProps[] = [
    {
      title: "New Students",
      value: "396",
      type: "students",
      trend: "+12% from last month"
    },
    {
        title: "Total Students",
        value: "396",
        type: "students",
        trend: "+12% from last month"
    },
    {
      title: "Active Courses",
      value: "24",
      type: "courses",
      trend: "+3 new courses"
    },
    {
      title: "Active Quizzes",
      value: "8",
      type: "quizzes",
      trend: "2 new quizzes"
    }
  ];

  return (
    <div className="flex flex-wrap h-[250px] ml-10 mt-10 gap-6 p-6">
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