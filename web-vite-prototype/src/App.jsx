import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ChildLayout from './child/components/ChildLayout.jsx';
import StorybookShelf from './child/pages/StorybookShelf.jsx';
import StorybookReader from './child/pages/StorybookReader.jsx';
import AllGamesView from './child/pages/AllGamesView.jsx';
import GameNotice from './child/pages/GameNotice.jsx';
import GamePlaceholder from './child/pages/GamePlaceholder.jsx';

import AdultLayout from './adult/components/AdultLayout.jsx';
import ParentDashboardPlaceholder from './adult/pages/ParentDashboardPlaceholder.jsx';
import ManageChildGames from './adult/pages/ManageChildGames.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/child" replace />} />

        {/* Child side: landscape-only, see ChildLayout / useLandscapeLock */}
        <Route path="/child" element={<ChildLayout />}>
          <Route index element={<StorybookShelf />} />
          <Route path="story" element={<StorybookReader />} />
          <Route path="games" element={<AllGamesView />} />
          <Route path="games/:gameId" element={<GameNotice />} />
          <Route path="games/:gameId/play" element={<GamePlaceholder />} />
        </Route>

        {/* Adult side: normal responsive layout */}
        <Route path="/adult" element={<AdultLayout />}>
          <Route index element={<ParentDashboardPlaceholder />} />
          <Route path="children/:childId/games" element={<ManageChildGames />} />
        </Route>

        <Route path="*" element={<Navigate to="/child" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
