import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SearchView from './views/SearchView/SearchView';
import ShelfView from './views/ShelfView/ShelfView';
import catalogo from './data/catalogo.json';

function ProfileView() {
  return (
    <main style={{ padding: '20px' }}>
      <h2> Meu Perfil</h2>
      <p>Em construção: Aqui ficarão as suas estatísticas e configurações.</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      
      <Routes>
        <Route path="/" element={<SearchView resultados={catalogo} />} />
        <Route path="/estante" element={<ShelfView />} />
        <Route path="/perfil" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  );
}