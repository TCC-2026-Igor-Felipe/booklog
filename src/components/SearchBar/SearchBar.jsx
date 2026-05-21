export default function SearchBar({ onSearch }) {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Buscar por título, autor ou ISBN..." 
        onChange={(evento) => onSearch(evento.target.value)}
      />
    </div>
  );
}