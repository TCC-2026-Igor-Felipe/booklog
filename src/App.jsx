import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SearchView from './views/SearchView/SearchView';
import catalogo from './data/catalogo.json';

// 1. Componentes temporários (placeholders)
function ShelfView() {
  return (
    <main style={{ padding: '20px' }}>
      <h2>Minha Estante</h2>
      <p>Em construção: Aqui ficarão os seus livros guardados e o estado de leitura.</p>
    </main>
  );
}

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