import { useState } from 'react'; // 1. Importamos o hook de estado do React
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookCard from '../../components/BookCard/BookCard';

export default function SearchView({ resultados = [] }) {
  const [termoBusca, setTermoBusca] = useState('');
  const livrosFiltrados = resultados.filter((livro) => {
    const termo = termoBusca.toLowerCase();
    const titulo = livro.titulo.toLowerCase();
    const autor = livro.autor.toLowerCase();

    return titulo.includes(termo) || autor.includes(termo);
  });

  return (
    <main>
      <SearchBar onSearch={setTermoBusca} />
      <FilterBar />

      <div className="resultados-lista">
        {livrosFiltrados.map((livro, index) => (
          <BookCard key={index} livro={livro} />
        ))}
      </div>
    </main>
  );
}