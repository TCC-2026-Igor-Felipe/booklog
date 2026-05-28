import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShelfView from './ShelfView';

describe('View: ShelfView', () => {
  it('deve renderizar o título da estante e os livros guardados', () => {
    const mockLivrosEstante = [
      { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', statusLeitura: 'LENDO', capaUrl: 'https://placehold.co/625x1000' },
      { titulo: '1984', autor: 'George Orwell', genero: 'Ficção', statusLeitura: 'QUERO_LER', capaUrl: 'https://placehold.co/625x1000' }
    ];

    render(<ShelfView livrosGuardados={mockLivrosEstante} />);

    const tituloPrincipal = screen.getByRole('heading', { name: /minha estante/i, level: 2 });

    expect(tituloPrincipal).toBeInTheDocument();
    expect(screen.getByText('O Hobbit')).toBeInTheDocument();
    expect(screen.getByText('1984')).toBeInTheDocument();
  });
});