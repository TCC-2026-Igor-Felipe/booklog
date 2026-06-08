import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookCard from '../../components/BookCard/BookCard';
import useSearch from '../../hooks/useSearch/useSearch';
import './SearchView.css';

export default function SearchView({ resultados = [] }) {
  const {
    setTermoBusca,
    setFiltroGenero,
    setFiltroAno,
    livrosFiltrados
  } = useSearch(resultados);

  const lidarComFiltro = (tipo, valor) => {
    if (tipo === 'genero') {
      setFiltroGenero(valor);
    } else if (tipo === 'ano') {
      setFiltroAno(valor);
    }
  };

  return (
    <main>
      <SearchBar onSearch={setTermoBusca} />
      <FilterBar onFilterChange={lidarComFiltro} />
      
      <div className="resultados-lista">
        {livrosFiltrados.length > 0 ? (
          livrosFiltrados.map((livro, index) => (
            <BookCard key={index} livro={livro} />
          ))
        ) : (
          <p className="mensagem-vazia">Nenhum livro encontrado com este termo.</p>
        )}
      </div>
    </main>
  );
}