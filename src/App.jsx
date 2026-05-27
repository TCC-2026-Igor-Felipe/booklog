import SearchView from './views/SearchView/SearchView';
import catalogo from './data/catalogo.json';

export default function App() {
  return (
    <div>
      <h1>Booklog</h1>
      <SearchView resultados={catalogo} />
    </div>
  );
}