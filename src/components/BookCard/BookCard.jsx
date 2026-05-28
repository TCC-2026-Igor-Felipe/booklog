import { useState } from 'react';
import StatusModal from '../StatusModal/StatusModal';
import useShelf from '../../hooks/useShelf/useShelf';

export default function BookCard({ livro }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { adicionarLivro } = useShelf();

  const estaNaEstante = Boolean(livro.statusLeitura);

  const handleSaveStatus = (statusEscolhido) => {
    adicionarLivro(livro, statusEscolhido);
  };

  return (
    <div className="book-card">
      <img src={livro.capaUrl} alt={`Capa do livro ${livro.titulo}`} />
      <div className="book-info">
        <h3>{livro.titulo}</h3>
        <p>{livro.autor}</p>
        <p>{livro.genero} - {livro.ano}</p>
      </div>

      <button className="status-button" onClick={() => setIsModalOpen(true)}>
        {estaNaEstante ? '...' : '+'}
      </button>

      <StatusModal
        livro={livro}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStatus}
      />
    </div>
  );
}