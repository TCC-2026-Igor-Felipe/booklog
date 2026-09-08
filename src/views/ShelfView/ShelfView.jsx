import { useState } from 'react';
import BookCard from '../../components/BookCard/BookCard';
import useShelf from '../../hooks/useShelf/useShelf';
import './ShelfView.css';

export default function ShelfView({ livrosGuardados }) {
  const { estante } = useShelf();
  const listaOriginal = livrosGuardados || estante;
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const filtros = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Lendo', value: 'LENDO' },
    { label: 'Lido', value: 'LIDO' },
    { label: 'Quero Ler', value: 'QUERO_LER' },
    { label: 'Abandonado', value: 'ABANDONADO' }
  ];

  const livrosFiltrados = listaOriginal.filter((livro) => {
    if (filtroAtivo === 'Todos') return true;
    return livro.statusLeitura === filtroAtivo;
  });

  return (
    <main className="shelf-view" style={{ padding: '20px' }}>
      <h2>Minha Estante</h2>

      <div className="status-filters">
        {filtros.map((filtro) => (
          <button
            key={filtro.value}
            className={`btn-filter ${filtroAtivo === filtro.value ? 'active' : ''}`}
            onClick={() => setFiltroAtivo(filtro.value)}
          >
            {filtro.label}
          </button>
        ))}
      </div>
      
      <div className="resultados-lista">
        {livrosFiltrados.length > 0 ? (
          livrosFiltrados.map((livro, index) => (
            <BookCard key={index} livro={livro} />
          ))
        ) : (
          <p className="mensagem-vazia">
            Nenhum livro encontrado para este status.
          </p>
        )}
      </div>
    </main>
  );
}