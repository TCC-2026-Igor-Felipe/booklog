export default function BookCard({ livro }) {
  if (!livro) return null;

  return (
    <div>
      <h2>{livro.titulo}</h2>
      <p>{livro.autor}</p>
    </div>
  );
}