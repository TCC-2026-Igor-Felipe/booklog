import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';
import './CustomListView.css';

export default function CustomListView() {
    const { listas, criarLista, removerLista } = useCustomLists();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!titulo.trim()) return;

        criarLista(titulo, descricao);

        setTitulo('');
        setDescricao('');
    };

    return (
        <main className="custom-list-view">
            <h2>Minhas Listas</h2>

            <form className="create-list-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Nome da lista (ex: Quero ler em 2027)"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Descrição breve..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-criar">Criar Lista</button>
            </form>

            <section className="lists-container">
                {listas.length > 0 ? (
                    listas.map((lista) => (
                        <div key={lista.id} className="list-card">
                            <div className="list-header">
                                <div>
                                    <h3>
                                        <Link to={`/listas/${lista.id}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                                            {lista.titulo}
                                        </Link>
                                    </h3>
                                    <p>{lista.descricao}</p>
                                </div>
                                <button
                                    className="btn-excluir-lista"
                                    onClick={() => removerLista(lista.id)}
                                    title="Excluir lista"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="list-books">
                                {lista.livros && lista.livros.length > 0 ? (
                                    <p>{lista.livros.length} obra(s) nesta lista.</p>
                                ) : (
                                    <p className="empty-list-text">Nenhum livro adicionado ainda.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="mensagem-vazia">Você ainda não criou nenhuma lista.</p>
                )}
            </section>
        </main>
    );
}