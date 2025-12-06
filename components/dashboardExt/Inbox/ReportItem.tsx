'use client'
import React from 'react';
// FIX: Using Lucide imports
import { Clock, Zap, MessageCircle, Send } from 'lucide-react';
// NOTE: Assuming alias resolution for shared types
import { ReportData } from '@/types';

interface ReportItemProps {
  report: ReportData;
  onReviewClick: (conversationId: string) => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, onReviewClick }) => {
  let icon: React.ReactNode;
  let colorClass: string;
  const NEON_PURPLE = "#A500FF";

  switch (report.type) {
    case 'DIGEST':
      icon = <Clock className='w-5 h-5 text-blue-400' />;
      colorClass = 'border-blue-500/50';
      break;
    case 'ALERT':
      icon = <Zap className='w-5 h-5 text-yellow-400' />;
      colorClass = 'border-yellow-500/50';
      break;
    case 'ESCALATION':
      icon = <MessageCircle className='w-5 h-5 text-red-400' />;
      colorClass = 'border-red-500/50';
      break;
    case 'QUERY_RESPONSE': // For owner's Ask Akira command response
      icon = <Send className='w-5 h-5 text-green-400' />;
      colorClass = 'border-green-500/50';
      break;
    default:
      icon = <Zap className='w-5 h-5 text-gray-400' />;
      colorClass = 'border-gray-500/50';
  }

  return (
    <div className={`p-4 bg-gray-900 rounded-xl border-l-4 ${colorClass} shadow-md`}>
      <div className='flex justify-between items-start'>
        <div className='flex items-center gap-2'>
          {icon}
          <h4 className='text-md font-semibold text-white'>{report.title}</h4>
        </div>
        <span className='text-xs text-gray-500'>{report.time}</span>
      </div>
      {/* Using dangerouslySetInnerHTML to render bold text from the mock data (e.g., product names) */}
      <p className='text-sm text-gray-400 mt-2' dangerouslySetInnerHTML={{ __html: report.message }} />

      {/* Review Button - only visible if a conversation ID is attached */}
      {report.conversationId && (
        <button
          onClick={() => onReviewClick(report.conversationId!)}
          className={`mt-3 text-xs text-right text-[${NEON_PURPLE}] hover:underline transition font-medium block w-full text-right`}
        >
          Review Conversation & Provide Feedback →
        </button>
      )}
    </div>
  );
};

export default ReportItem;