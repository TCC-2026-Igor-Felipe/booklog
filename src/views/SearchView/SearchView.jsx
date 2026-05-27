import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import BookCard from '../../components/BookCard/BookCard';

export default function SearchView({ resultados = [] }) {
  return (
    <main>
      <SearchBar />
      <FilterBar />
      
      <div className="resultados-lista">
        {resultados.map((livro, index) => (
          <BookCard key={index} livro={livro} />
        ))}
      </div>
    </main>
  );
}