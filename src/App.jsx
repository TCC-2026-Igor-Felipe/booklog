import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SearchView from './views/SearchView/SearchView';
import ShelfView from './views/ShelfView/ShelfView';
import ProfileView from './views/ProfileView/ProfileView';
import StatisticsView from './views/StatisticsView/StatisticsView';
import CustomListView from './views/CustomListView/CustomListView';
import catalogo from './data/catalogo.json';

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      
      <Routes>
        <Route path="/" element={<SearchView resultados={catalogo} />} />
        <Route path="/estante" element={<ShelfView />} />
        <Route path="/perfil" element={<ProfileView />} />
        <Route path="/estatisticas" element={<StatisticsView />} />
        <Route path="/listas" element={<CustomListView />} />
      </Routes>
    </BrowserRouter>
  );
}