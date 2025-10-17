'use client'
import React, { useEffect } from 'react'
import {PageData, PageHistory} from '../../types'


const PageTracker = () => {
  useEffect(() => {
    const currentPage = window.location.pathname;
    const currentTime = new Date().toISOString();
    const pageData: PageData = {
      page: currentPage,
      entryTime: currentTime,
      duration: 0,
    }

    const existingData = localStorage.getItem('pageHistory');
    const pageHistory: PageHistory[] = existingData ? JSON.parse(existingData) : [];

    const existingPageIndex = pageHistory.findIndex((page) => page.page === currentPage);
    if (existingPageIndex !== -1) {
      pageHistory[existingPageIndex].exitTime = undefined;
      pageHistory[existingPageIndex].entryTime = currentTime;
      pageHistory[existingPageIndex].duration = 0;
    } else {
      pageHistory.push({ ...pageData, exitTime: undefined })
    }

    localStorage.setItem('pageHistory', JSON.stringify(pageHistory));

    const handleBeforeUnload = () => {
      const updatedPageHistory: PageHistory[] = JSON.parse(localStorage.getItem('pageHistory') || '[]')
      const currentPageIndex = updatedPageHistory.findIndex((page) => page.page === currentPage)
      if (currentPageIndex !== -1) {
        const exitTime = new Date().toISOString();
        const entryTime = new Date(updatedPageHistory[currentPageIndex].entryTime).getTime();
        const duration = (new Date(exitTime).getTime() - entryTime) / 1000;
        updatedPageHistory[currentPageIndex].duration = duration;
        updatedPageHistory[currentPageIndex].exitTime = exitTime;
        localStorage.setItem('pageHistory', JSON.stringify(updatedPageHistory))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])


  return null
}

export default PageTracker
