import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { SpecList } from './pages/SpecList';
import { UIList } from './pages/UIList';
import { Matrix } from './pages/Matrix';
import { Decisions } from './pages/Decisions';
import { Roadmap } from './pages/Roadmap';
import { Changelog } from './pages/Changelog';
import { UpdateCenter } from './pages/UpdateCenter';
import { ExportImport } from './pages/ExportImport';
import { StatusProvider } from './context/StatusContext';

function App() {
  return (
    <StatusProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="spec" element={<SpecList />} />
          <Route path="ui" element={<UIList />} />
          <Route path="matrix" element={<Matrix />} />
          <Route path="decisions" element={<Decisions />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="update" element={<UpdateCenter />} />
          <Route path="export" element={<ExportImport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StatusProvider>
  );
}

export default App;
