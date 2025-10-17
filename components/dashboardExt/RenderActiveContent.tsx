'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import AiTrainingContent from './AiTrainingContent'
import Inbox from './Inbox'
import Integrations from './Integrations'
import Analytics from './Analytics'
import Settings from './Settings'
import HelpCenter from './HelpCenter'


const RenderActiveContent = () => {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view')

  switch (currentView) {
    case 'ai-training':
      return <AiTrainingContent />
    case 'integrations':
      return <Integrations />
    case 'analytics':
      return <Analytics />
    case 'settings':
      return <Settings />
    case 'help-center':
      return <HelpCenter />
    case 'inbox':
    default: 
      return <Inbox />
  }
}

export default RenderActiveContent
