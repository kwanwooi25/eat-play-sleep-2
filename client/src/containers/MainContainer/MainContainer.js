import React from 'react';

/** Components */
import Header from '../../components/Header/Header';
import TopNavigation from '../../components/TopNavigation/TopNavigation';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';

const MainContainer = ({ route, children }) => {
  return (
    <main className={`main route-${route}`}>
      <Header />
      {route === 'stats' && <TopNavigation />}
      <div className="page-content">
        {children}
      </div>
      <BottomNavigation />


    </main>
  )
}

export default MainContainer;