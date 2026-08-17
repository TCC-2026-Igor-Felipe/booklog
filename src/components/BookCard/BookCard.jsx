import { useState } from 'react';
import StatusModal from '../StatusModal/StatusModal';
import useShelf from '../../hooks/useShelf/useShelf';
import './BookCard.css';

export default function BookCard({ livro }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Importamos a nova função alternarFavorito do hook
  const { estante, adicionarLivro, removerLivro, alternarFavorito } = useShelf();

  const livroNaEstante = estante.find((item) => item.titulo === livro.titulo);
  const estaNaEstante = Boolean(livroNaEstante);
  const livroParaOModal = livroNaEstante || livro;

  const handleSaveStatus = (statusEscolhido) => {
    adicionarLivro(livro, statusEscolhido);
  };

  const handleDelete = () => {
    removerLivro(livro.titulo);
  };

  return (
    <div className="book-card">
      <img src={livro.capaUrl} alt={`Capa do livro ${livro.titulo}`} />
      
      <div className="book-info">
        <h3>{livro.titulo}</h3>
        <p>{livro.autor}</p>
        <p>{livro.genero} - {livro.ano}</p>
      </div>

      {estaNaEstante && (
        <button 
          className="favorite-button" 
          onClick={() => alternarFavorito(livro.titulo)}
          title="Favoritar obra"
        >
          {livroNaEstante?.favorito ? '❤️' : '🤍'}
        </button>
      )}

      <button className="status-button" onClick={() => setIsModalOpen(true)}>
        {estaNaEstante ? '...' : '+'}
      </button>

      <StatusModal
        livro={livroParaOModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}