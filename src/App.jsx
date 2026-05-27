import SearchView from './views/SearchView/SearchView';

export default function App() {
  const livrosExemplo = [
    { 
      titulo: 'O Senhor dos Anéis', 
      autor: 'J.R.R. Tolkien', 
      genero: 'Fantasia',
      ano: 1954,
      capaUrl: 'https://placehold.co/625x1000' 
    },
    { 
      titulo: '1984', 
      autor: 'George Orwell', 
      genero: 'Ficção',
      ano: 1949,
      capaUrl: 'https://placehold.co/625x1000' 
    },
    { 
      titulo: 'Duna', 
      autor: 'Frank Herbert', 
      genero: 'Ficção',
      ano: 1965,
      capaUrl: 'https://placehold.co/625x1000' 
    },
    { 
      titulo: 'Clean Code', 
      autor: 'Robert C. Martin', 
      genero: 'Tecnologia',
      ano: 2008,
      capaUrl: 'https://placehold.co/625x1000' 
    }
  ];

  return (
    <div>
      <h1>Meu Booklog</h1>
      <SearchView resultados={livrosExemplo} />
    </div>
  );
}