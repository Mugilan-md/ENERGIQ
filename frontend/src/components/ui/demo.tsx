import React from 'react';
import Card, { CardData } from '@/components/ui/course-design-cards';
import '@/index.css';

export const DefaultDemo: React.FC = () => {
  const cardData: CardData[] = [
    {
      id: 1,
      colorClass: 'green',
      date: 'Feb 2, 2021',
      title: 'web designing',
      description: 'Prototyping',
      progressPercent: '90%',
      progressValue: '90%',
      imgSrc1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      imgAlt1: 'User 1',
      imgSrc2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      imgAlt2: 'User 2',
      countdownText: '2 days left',
    },
    {
      id: 2,
      colorClass: 'orange',
      date: 'Feb 05, 2021',
      title: 'mobile app',
      description: 'Shopping',
      progressPercent: '30%',
      progressValue: '30%',
      imgSrc1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      imgAlt1: 'User 3',
      imgSrc2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      imgAlt2: 'User 4',
      countdownText: '3 weeks left',
    },
    {
      id: 3,
      colorClass: 'red',
      date: 'March 03, 2021',
      title: 'dashboard',
      description: 'Medical',
      progressPercent: '50%',
      progressValue: '50%',
      imgSrc1: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      imgAlt1: 'User 5',
      imgSrc2: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      imgAlt2: 'User 6',
      countdownText: '3 weeks left',
    },
    {
      id: 4,
      colorClass: 'blue',
      date: 'March 08, 2021',
      title: 'web designing',
      description: 'Wireframing',
      progressPercent: '20%',
      progressValue: '20%',
      imgSrc1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      imgAlt1: 'Erik Longman',
      imgSrc2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      imgAlt2: 'Jane Doe',
      countdownText: '3 weeks left',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cardData.map((card) => (
        <Card key={card.id} data={card} />
      ))}
    </section>
  );
};

export default DefaultDemo;
