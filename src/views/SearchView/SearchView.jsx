import { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookCard from '../../components/BookCard/BookCard';

export default function SearchView({ resultados = [] }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');

  const livrosFiltrados = resultados.filter((livro) => {
    const termo = termoBusca.toLowerCase();
    const titulo = livro.titulo.toLowerCase();
    const autor = livro.autor.toLowerCase();
    const passouNoTexto = titulo.includes(termo) || autor.includes(termo);
    const passouNoGenero = filtroGenero === '' || livro?.genero === filtroGenero;
    
    return passouNoTexto && passouNoGenero;
  });

  return (
    <main>
      <SearchBar onSearch={setTermoBusca} />
      <FilterBar onFilterChange={setFiltroGenero} />
      
      <div className="resultados-lista">
        {livrosFiltrados.map((livro, index) => (
          <BookCard key={index} livro={livro} />
        ))}
      </div>
    </main>
  );
}