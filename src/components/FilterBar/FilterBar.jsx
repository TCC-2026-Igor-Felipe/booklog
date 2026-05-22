export default function FilterBar() {
  return (
    <div className="filter-bar">
      <div>
        <label htmlFor="filtro-genero">Gênero:</label>
        <select id="filtro-genero">
          <option value="">Todos os gêneros</option>
          <option value="Ficção">Ficção</option>
          <option value="Fantasia">Fantasia</option>
          <option value="Tecnologia">Tecnologia</option>
        </select>
      </div>

      <div>
        <label htmlFor="filtro-ano">Ano de Publicação:</label>
        <select id="filtro-ano">
          <option value="">Qualquer ano</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024 ou anterior</option>
        </select>
      </div>
    </div>
  );
}