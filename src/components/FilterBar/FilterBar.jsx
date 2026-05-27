export default function FilterBar({ onFilterChange }) {
  const handleGeneroChange = (evento) => {
    if (onFilterChange) {
      onFilterChange('genero', evento.target.value);
    }
  };

  const handleAnoChange = (evento) => {
    if (onFilterChange) {
      onFilterChange('ano', evento.target.value);
    }
  };

  return (
    <div className="filter-bar">
      <div>
        <label htmlFor="filtro-genero">Gênero:</label>
        <select id="filtro-genero" onChange={handleGeneroChange}>
          <option value="">Todos os gêneros</option>
          <option value="Ficção">Ficção</option>
          <option value="Fantasia">Fantasia</option>
          <option value="Tecnologia">Tecnologia</option>
        </select>
      </div>

      <div>
        <label htmlFor="filtro-ano">Ano de Publicação:</label>
        <input 
          type="number" 
          id="filtro-ano" 
          placeholder="Ex: 1984"
          onChange={handleAnoChange} 
        />
      </div>
    </div>
  );
}