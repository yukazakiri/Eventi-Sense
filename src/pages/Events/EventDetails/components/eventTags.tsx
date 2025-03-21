import React from 'react';
import { BiTag } from "react-icons/bi";
import { EventTag } from '../types'; // Adjust the path as needed

interface EventTagsProps {
    eventTags: EventTag[];
  }
  

  const EventTags: React.FC<EventTagsProps> = ({ eventTags }) => {
    return (
        <div className="event-tags-container">
            <div className="section-header">
                <BiTag className="tag-icon" />
                <h3>Tagged Entities</h3>
            </div>

            <div className="tags-grid">
                {eventTags.length > 0 ? (
                    eventTags.map((tag) => (
                        <span 
                            key={tag.id}
                            className={`tag ${tag.type}`}
                        >
                            {tag.type === 'venue' ? '🏢 ' : '🛠️ '}
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <p className="no-tags">No tags available</p>
                )}
            </div>
        </div>
    );
};

export default EventTags;