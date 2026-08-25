import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';
import BookCard from '../../components/BookCard/BookCard';
import './ListDetailsView.css';

export default function ListDetailsView() {
    const { id } = useParams();
    const { listas, atualizarLivrosDaLista } = useCustomLists();

    const listaOriginal = listas.find(l => l.id === id);
    const [modoReordenacao, setModoReordenacao] = useState(false);
    const [livrosLocais, setLivrosLocais] = useState([]);

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    if (!listaOriginal) {
        return (
            <main className="list-details-view">
                <h2>Lista não encontrada</h2>
                <Link to="/listas" className="btn-voltar">Voltar para Listas</Link>
            </main>
        );
    }

    const iniciarReordenacao = () => {
        setLivrosLocais([...listaOriginal.livros]);
        setModoReordenacao(true);
    };

    const cancelarReordenacao = () => {
        setLivrosLocais([]);
        setModoReordenacao(false);
    };

    const salvarReordenacao = () => {
        atualizarLivrosDaLista(listaOriginal.id, livrosLocais);
        setModoReordenacao(false);
    };

    const handleDragStart = (index) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            const novaLista = [...livrosLocais];
            const itemArrastado = novaLista.splice(dragItem.current, 1)[0];
            novaLista.splice(dragOverItem.current, 0, itemArrastado);
            setLivrosLocais(novaLista);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const livrosExibidos = modoReordenacao ? livrosLocais : listaOriginal.livros;

    return (
        <main className="list-details-view">
            <Link to="/listas" className="btn-voltar">← Voltar</Link>

            <div className="list-details-header">
                <div className="header-info">
                    <h2>{listaOriginal.titulo}</h2>
                    <p>{listaOriginal.descricao}</p>
                    <span>{listaOriginal.livros.length} obra(s)</span>
                </div>

                <div className="header-actions">
                    {modoReordenacao ? (
                        <>
                            <button className="btn-cancelar" onClick={cancelarReordenacao}>Cancelar</button>
                            <button className="btn-salvar" onClick={salvarReordenacao}>Salvar</button>
                        </>
                    ) : (
                        <button className="btn-reordenar" onClick={iniciarReordenacao} disabled={listaOriginal.livros.length < 2}>
                            Reordenar
                        </button>
                    )}
                </div>
            </div>

            {modoReordenacao && <p className="reorder-tip">Arraste os livros para organizar a sua lista.</p>}

            <div className="resultados-lista">
                {livrosExibidos.length > 0 ? (
                    livrosExibidos.map((livro, index) => (
                        <div
                            key={livro.titulo}
                            className={`draggable-card ${modoReordenacao ? 'is-draggable' : ''}`}
                            draggable={modoReordenacao}
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {modoReordenacao && <div className="drag-handle">☰</div>}
                            <BookCard livro={livro} />
                        </div>
                    ))
                ) : (
                    <p className="mensagem-vazia">Esta lista ainda está vazia.</p>
                )}
            </div>
        </main>
    );
}