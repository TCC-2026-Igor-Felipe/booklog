import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookCard from './BookCard';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useShelf/useShelf');

describe('Componente: BookCard', () => {
  const mockLivro = {
    titulo: 'O Nome do Vento',
    autor: 'Patrick Rothfuss',
    genero: 'Fantasia',
    ano: 2007,
    capaUrl: 'https://via.placeholder.com/150'
  };

  it('deve renderizar as informações básicas do livro', () => {
    useShelf.mockReturnValue({ estante: [], adicionarLivro: vi.fn(), removerLivro: vi.fn() });
    
    render(<BookCard livro={mockLivro} />);
    expect(screen.getByText('O Nome do Vento')).toBeInTheDocument();
    expect(screen.getByText('Patrick Rothfuss')).toBeInTheDocument();
  });

  it('deve exibir o botão "+" quando o livro não estiver na estante (sem status)', () => {
    useShelf.mockReturnValue({ estante: [], adicionarLivro: vi.fn(), removerLivro: vi.fn() });
    
    render(<BookCard livro={mockLivro} />);
    
    const botaoAdicionar = screen.getByRole('button', { name: '+' });
    expect(botaoAdicionar).toBeInTheDocument();
  });

  it('deve exibir o botão "..." quando o livro já estiver na estante (com status)', () => {
    useShelf.mockReturnValue({ 
      estante: [{ ...mockLivro, statusLeitura: 'LENDO' }], 
      adicionarLivro: vi.fn(), 
      removerLivro: vi.fn() 
    });
    
    render(<BookCard livro={mockLivro} />);
    
    const botaoAtualizar = screen.getByRole('button', { name: '...' });
    expect(botaoAtualizar).toBeInTheDocument();
    
    expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
  });
});