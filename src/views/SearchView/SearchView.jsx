import SearchBar from '../../components/SearchBar/SearchBar';
import BookCard from '../../components/BookCard/BookCard';

export default function SearchView({ resultados = [] }) {
  return (
    <main>
      <SearchBar />
      
      <div className="resultados-lista">
        {resultados.map((livro, index) => (
          <BookCard key={index} livro={livro} />
        ))}
      </div>
    </main>
  );
}