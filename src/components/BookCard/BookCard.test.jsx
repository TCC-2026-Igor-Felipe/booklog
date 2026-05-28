import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookCard from './BookCard';

describe('Componente: BookCard', () => {
  const mockLivro = {
    titulo: 'O Nome do Vento',
    autor: 'Patrick Rothfuss',
    genero: 'Fantasia',
    ano: 2007,
    capaUrl: 'https://via.placeholder.com/150'
  };

  it('deve renderizar as informações básicas do livro', () => {
    render(<BookCard livro={mockLivro} />);
    expect(screen.getByText('O Nome do Vento')).toBeInTheDocument();
    expect(screen.getByText('Patrick Rothfuss')).toBeInTheDocument();
  });

  it('deve exibir o botão "+" quando o livro não estiver na estante', () => {
    render(<BookCard livro={mockLivro} />);
    
    const botaoAdicionar = screen.getByRole('button', { name: '+' });
    expect(botaoAdicionar).toBeInTheDocument();
  });

  it('deve exibir o botão "..." quando o livro já estiver na estante', () => {
    const livroNaEstante = { ...mockLivro, statusLeitura: 'LENDO' };
    render(<BookCard livro={livroNaEstante} />);
    
    const botaoAtualizar = screen.getByRole('button', { name: '...' });
    expect(botaoAtualizar).toBeInTheDocument();
    
    expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
  });
});