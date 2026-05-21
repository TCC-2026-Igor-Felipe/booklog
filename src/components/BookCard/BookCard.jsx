export default function BookCard({ livro }) {
  if (!livro) return null;

  return (
    <div>
      <img 
        src={livro.capaUrl} 
        alt={`Capa do livro ${livro.titulo}`} 
      />
      <h2>{livro.titulo}</h2>
      <p>{livro.autor}</p>
    </div>
  );
}