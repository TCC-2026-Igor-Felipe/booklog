import { useState } from 'react';
import useShelf from '../../hooks/useShelf/useShelf';
import BookCard from '../../components/BookCard/BookCard';
import './ProfileView.css';

export default function ProfileView() {
  const { estante } = useShelf();
  const livrosFavoritos = estante.filter((livro) => livro.favorito);

  const [nome, setNome] = useState(() => window.localStorage.getItem('booklog_nome') || 'Igor Felipe');
  const [isEditing, setIsEditing] = useState(false);

  const fotoPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=00b0fa&color=fff&size=128`;

  const salvarPerfil = (e) => {
    e.preventDefault();
    window.localStorage.setItem('booklog_nome', nome);
    setIsEditing(false);
  };

  const cancelarEdicao = () => {
    setNome(window.localStorage.getItem('booklog_nome') || 'Igor Felipe');
    setIsEditing(false);
  };

  const concluidos = estante.filter((livro) => livro.statusLeitura === 'LIDO');
  const livrosComNota = estante.filter((livro) => livro.notaAvaliacao);
  const somaNotas = livrosComNota.reduce((acc, livro) => acc + livro.notaAvaliacao, 0);
  const mediaNotas = livrosComNota.length > 0 ? (somaNotas / livrosComNota.length).toFixed(1) : 'N/A';

  const autoresContagem = estante.reduce((acc, livro) => {
    if (livro.autor) acc[livro.autor] = (acc[livro.autor] || 0) + 1;
    return acc;
  }, {});
  const autorMaisLido = Object.keys(autoresContagem).length > 0
    ? Object.keys(autoresContagem).reduce((a, b) => autoresContagem[a] > autoresContagem[b] ? a : b)
    : 'N/A';

  const livrosResenhados = estante.filter(l => l.statusLeitura === 'LIDO' && l.resenhaTextual);
  const diarioRecente = livrosResenhados.length > 0 ? livrosResenhados[livrosResenhados.length - 1] : null;

  const obterTituloLeitor = (quantidade) => {
    if (quantidade <= 5) return 'Leitor(a) Iniciante';
    if (quantidade <= 15) return 'Leitor(a) Casual';
    if (quantidade <= 30) return 'Leitor(a) Assíduo(a)';
    return 'Devorador de Livros';
  };

  return (
    <main className="profile-view">
      <div className="profile-header">
        {isEditing ? (
          <form onSubmit={salvarPerfil} className="profile-edit-form">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu Nome"
              required
            />
            <div className="edit-actions">
              <button type="button" className="btn-cancelar" onClick={cancelarEdicao}>Cancelar</button>
              <button type="submit" className="btn-salvar">Salvar Perfil</button>
            </div>
          </form>
        ) : (
          <>
            <img src={fotoPadrao} alt={`Foto de perfil de ${nome}`} className="profile-avatar" />
            <div className="profile-info">
              <h2>{nome} <button className="btn-editar-perfil" onClick={() => setIsEditing(true)} title="Editar Perfil">✏️</button></h2>
              <p>{obterTituloLeitor(concluidos.length)} • {estante.length} obras na estante</p>
            </div>
          </>
        )}
      </div>

      <section className="favorite-books-section">
        <h3>Meus Favoritos</h3>
        {livrosFavoritos.length > 0 ? (
          <div className="resultados-lista">
            {livrosFavoritos.map((livro, index) => (
              <BookCard key={index} livro={livro} hideActions={true} />
            ))}
          </div>
        ) : (
          <p className="mensagem-vazia">Você ainda não possui livros favoritos.</p>
        )}
      </section>

      <section className="profile-statistics-section">
        <h3>Minhas Estatísticas</h3>
        
        {diarioRecente && (
          <div className="diario-recente-container">
            <h3>Diário Recente</h3>
            <div className="diario-card">
              <img src={diarioRecente.capaUrl} alt={`Capa de ${diarioRecente.titulo}`} />
              <div className="diario-info">
                <h4>
                  {diarioRecente.titulo}
                  <span style={{ color: '#ffb400', fontSize: '16px', marginLeft: '10px' }}>
                    {'★'.repeat(Math.floor(diarioRecente.notaAvaliacao))}
                    {diarioRecente.notaAvaliacao % 1 !== 0 ? '⯨' : ''}
                  </span>
                </h4>
                <p className="diario-autor">{diarioRecente.autor}</p>
                <blockquote className="diario-resenha">"{diarioRecente.resenhaTextual}"</blockquote>
              </div>
            </div>
          </div>
        )}

        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Total na Estante: {estante.length}</h4>
          </div>
          <div className="metric-card">
            <h4>Concluídos: {concluidos.length}</h4>
          </div>
          <div className="metric-card">
            <h4>Média de Notas: {mediaNotas}</h4>
          </div>
          <div className="metric-card destaque">
            <h4>Autor Mais Lido: <br /><span>{autorMaisLido}</span></h4>
          </div>
        </div>
      </section>
    </main>
  );
}