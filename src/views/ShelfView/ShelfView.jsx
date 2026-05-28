import BookCard from '../../components/BookCard/BookCard';
import useShelf from '../../hooks/useShelf/useShelf';

export default function ShelfView({ livrosGuardados }) {
  const { estante } = useShelf();
  const listaExibida = livrosGuardados || estante;

  return (
    <main className="shelf-view" style={{ padding: '20px' }}>
      <h2>Minha Estante</h2>
      
      <div className="resultados-lista">
        {listaExibida.length > 0 ? (
          listaExibida.map((livro, index) => (
            <BookCard key={index} livro={livro} />
          ))
        ) : (
          <p className="mensagem-vazia">Sua estante está vazia. Que tal buscar alguns livros?</p>
        )}
      </div>
    </main>
  );
}