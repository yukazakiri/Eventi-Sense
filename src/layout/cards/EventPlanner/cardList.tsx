import React from 'react';
import Card from './cardDesign';
import { EventPlanner } from '../../../types/eventPlanner';

type CardListProps = {
  eventPlanners: EventPlanner[]; // Receive event planners as a prop
  limit?: number;
};

const CardList: React.FC<CardListProps> = ({ eventPlanners, limit }) => {
  // If no event planners are provided, show a message
  if (!eventPlanners || eventPlanners.length === 0) {
    return <div className="text-center text-gray-600 py-6">No event planners found.</div>;
  }

  // Apply limit if provided
  const displayedCardData = limit ? eventPlanners.slice(0, limit) : eventPlanners;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {displayedCardData.map((eventPlanner, index) => (
        <div key={eventPlanner.planner.profile_id} className={index >= 3 ? "hidden sm:block" : ""}>
          <Card
            id={eventPlanner.planner.profile_id}
            name={eventPlanner.planner.company_name}
            specialization={eventPlanner.planner.specialization}
            avatar={eventPlanner.planner.avatar_url}
            is_public={eventPlanner.planner.is_public}
          />
        </div>
      ))}
    </div>
  );
};

export default CardList;