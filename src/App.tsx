import React from 'react';
import { Viewer } from './components';

const App: React.FC = () => {
  return (
    <Viewer style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
  );
};

export default App;
