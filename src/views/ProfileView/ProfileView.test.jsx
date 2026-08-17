import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileView from './ProfileView';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useShelf/useShelf');

describe('View: ProfileView', () => {
  it('deve renderizar o cabeçalho do perfil com nome e foto', () => {
    useShelf.mockReturnValue({ estante: [] });
    render(<ProfileView />);
    
    expect(screen.getByRole('heading', { name: /Igor Felipe/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Foto de perfil/i)).toBeInTheDocument();
  });

  it('deve exibir apenas os livros marcados como favoritos', () => {
    const mockEstante = [
      { titulo: '1984', autor: 'George Orwell', favorito: true, capaUrl: 'url' },
      { titulo: 'Duna', autor: 'Frank Herbert', favorito: false, capaUrl: 'url' },
      { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', favorito: true, capaUrl: 'url' }
    ];
    
    useShelf.mockReturnValue({ estante: mockEstante });
    render(<ProfileView />);
    
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('O Hobbit')).toBeInTheDocument();
    
    expect(screen.queryByText('Duna')).not.toBeInTheDocument();
  });

  it('deve exibir uma mensagem quando não houver livros favoritos', () => {
    const mockEstante = [
      { titulo: 'Duna', autor: 'Frank Herbert', favorito: false, capaUrl: 'url' }
    ];
    
    useShelf.mockReturnValue({ estante: mockEstante });
    render(<ProfileView />);
    
    expect(screen.getByText(/Você ainda não possui livros favoritos/i)).toBeInTheDocument();
  });
});