import SearchView from './views/SearchView/SearchView';

export default function App() {

  const livrosExemplo = [
    { 
      titulo: 'O Senhor dos Anéis', 
      autor: 'J.R.R. Tolkien', 
      capaUrl: 'https://placehold.co/625x1000' 
    },
    { 
      titulo: '1984', 
      autor: 'George Orwell', 
      capaUrl: 'https://placehold.co/625x1000' 
    },
    { 
      titulo: 'Duna', 
      autor: 'Frank Herbert', 
      capaUrl: 'https://placehold.co/625x1000' 
    }
  ];

  return (
    <div>
      <h1>Booklog</h1>
      <SearchView resultados={livrosExemplo} />
    </div>
  );
}