export default function SearchBar({ onSearch }) {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Buscar por título ou autor..." 
        onChange={(evento) => onSearch(evento.target.value)}
      />
    </div>
  );
}