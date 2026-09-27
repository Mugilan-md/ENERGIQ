import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

// Define the type for the card data
export interface CardData {
  id: number | string;
  colorClass: string;
  date: string;
  title: string;
  description: string;
  progressPercent: string;
  progressValue: string;
  imgSrc1?: string;
  imgAlt1?: string;
  imgSrc2?: string;
  imgAlt2?: string;
  countdownText: string;
  metricValue?: string | number;
  metricUnit?: string;
}

// Define the props for the Card component
export interface CardProps {
  data: CardData;
}

// SVG components (using lucide-react for sharp rendering)
const EllipsisIcon: React.FC = () => (
  <MoreHorizontal className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
);

const AddIcon: React.FC = () => (
  <Plus className="w-3.5 h-3.5" />
);

export const Card: React.FC<CardProps> = ({ data }) => {
  const {
    colorClass,
    date,
    title,
    description,
    progressPercent,
    progressValue,
    imgSrc1,
    imgAlt1,
    imgSrc2,
    imgAlt2,
    countdownText,
  } = data;

  return (
    <div className={`card ${colorClass}`}>
      <div className="card-header">
        <div className="date">{date}</div>
        <EllipsisIcon />
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="progress">
          <span>Progress</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: progressPercent }}
            />
          </div>
          <span>{progressValue}</span>
        </div>
      </div>
      <div className="card-footer">
        <ul>
          {imgSrc1 && (
            <li>
              <img src={imgSrc1} alt={imgAlt1 || 'user avatar'} />
            </li>
          )}
          {imgSrc2 && (
            <li>
              <img src={imgSrc2} alt={imgAlt2 || 'user avatar'} />
            </li>
          )}
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className="btn-add" title="Assign operator">
              <AddIcon />
            </a>
          </li>
        </ul>
        <a href="#" onClick={(e) => e.preventDefault()} className="btn-countdown">
          {countdownText}
        </a>
      </div>
    </div>
  );
};

export default Card;
