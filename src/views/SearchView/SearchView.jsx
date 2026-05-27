import { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookCard from '../../components/BookCard/BookCard';

export default function SearchView({ resultados = [] }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroAno, setFiltroAno] = useState('');

  const lidarComFiltro = (tipo, valor) => {
    if (tipo === 'genero') {
      setFiltroGenero(valor);
    } else if (tipo === 'ano') {
      setFiltroAno(valor);
    }
  };

  const livrosFiltrados = resultados.filter((livro) => {
    const termo = termoBusca.toLowerCase();
    const titulo = livro.titulo.toLowerCase();
    const autor = livro.autor.toLowerCase();
    const passouNoTexto = titulo.includes(termo) || autor.includes(termo);
    const passouNoGenero = filtroGenero === '' || livro?.genero === filtroGenero;
    const passouNoAno = filtroAno === '' || String(livro?.ano).startsWith(String(filtroAno));
    
    return passouNoTexto && passouNoGenero && passouNoAno;
  });

  return (
    <main>
      <SearchBar onSearch={setTermoBusca} />
      <FilterBar onFilterChange={lidarComFiltro} />
      
      <div className="resultados-lista">
        {livrosFiltrados.map((livro, index) => (
          <BookCard key={index} livro={livro} />
        ))}
      </div>
    </main>
  );
}