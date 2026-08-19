import { useState } from 'react';
import StatusModal from '../StatusModal/StatusModal';
import useShelf from '../../hooks/useShelf/useShelf';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';
import './BookCard.css';

export default function BookCard({ livro }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { estante, adicionarLivro, removerLivro, alternarFavorito } = useShelf();

  const { listas, adicionarLivroNaLista } = useCustomLists();

  const livroNaEstante = estante.find((item) => item.titulo === livro.titulo);
  const estaNaEstante = Boolean(livroNaEstante);
  const livroParaOModal = livroNaEstante || livro;

  const handleSaveStatus = (statusEscolhido) => {
    adicionarLivro(livro, statusEscolhido);
  };

  const handleDelete = () => {
    removerLivro(livro.titulo);
  };

  const handleAddToList = (idLista) => {
    adicionarLivroNaLista(idLista, livro);
    window.alert(`Livro adicionado à lista com sucesso!`);
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
        listas={listas}
        onAddToList={handleAddToList}
      />
    </div>
  );
}