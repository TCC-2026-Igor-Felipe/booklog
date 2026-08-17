import useShelf from '../../hooks/useShelf/useShelf';
import BookCard from '../../components/BookCard/BookCard';
import './ProfileView.css';

export default function ProfileView() {
  const { estante } = useShelf();
  
  const livrosFavoritos = estante.filter((livro) => livro.favorito);

  return (
    <main className="profile-view">
      <div className="profile-header">
        <img 
          src="https://ui-avatars.com/api/?name=Igor+Felipe&background=00b0fa&color=fff&size=128" 
          alt="Foto de perfil de Igor Felipe" 
          className="profile-avatar" 
        />
        <div className="profile-info">
          <h2>Igor Felipe</h2>
          <p>Leitor Assíduo • {estante.length} obras na estante</p>
        </div>
      </div>

      <section className="favorite-books-section">
        <h3>Meus Favoritos</h3>
        
        {livrosFavoritos.length > 0 ? (
          <div className="resultados-lista">
            {livrosFavoritos.map((livro, index) => (
              <BookCard key={index} livro={livro} />
            ))}
          </div>
        ) : (
          <p className="mensagem-vazia">Você ainda não possui livros favoritos.</p>
        )}
      </section>
    </main>
  );
}