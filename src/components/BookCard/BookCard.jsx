export default function BookCard({ livro }) {
  const estaNaEstante = Boolean(livro.statusLeitura);

  return (
    <div className="book-card">
      <img src={livro.capaUrl} alt={`Capa do livro ${livro.titulo}`} />
      <div className="book-info">
        <h3>{livro.titulo}</h3>
        <p>{livro.autor}</p>
        <p>{livro.genero} - {livro.ano}</p>
      </div>
      
      <button className="status-button">
        {estaNaEstante ? '...' : '+'}
      </button>
    </div>
  );
}