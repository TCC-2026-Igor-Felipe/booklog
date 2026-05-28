import BookCard from '../../components/BookCard/BookCard';

export default function ShelfView({ livrosGuardados = [] }) {
    return (
        <main className="shelf-view" style={{ padding: '20px' }}>
            <h2>📚 Minha Estante</h2>

            <div className="resultados-lista">
                {livrosGuardados.length > 0 ? (
                    livrosGuardados.map((livro, index) => (
                        <BookCard key={index} livro={livro} />
                    ))
                ) : (
                    <p className="mensagem-vazia">Sua estante está vazia. Que tal buscar alguns livros?</p>
                )}
            </div>
        </main>
    );
}