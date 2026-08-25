import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BookCard from './BookCard';
import useShelf from '../../hooks/useShelf/useShelf';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';

vi.mock('../../hooks/useShelf/useShelf');
vi.mock('../../hooks/useCustomLists/useCustomLists');

describe('Componente: BookCard', () => {
  const mockLivro = {
    titulo: 'O Nome do Vento',
    autor: 'Patrick Rothfuss',
    genero: 'Fantasia',
    ano: 2007,
    capaUrl: 'https://via.placeholder.com/150'
  };

  const mockAdicionarLivro = vi.fn();
  const mockRemoverLivro = vi.fn();
  const mockAlternarFavorito = vi.fn();
  const mockAdicionarLivroNaLista = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useShelf.mockReturnValue({
      estante: [],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });

    useCustomLists.mockReturnValue({
      listas: [{ id: '1', titulo: 'Minha Lista de Fantasia' }],
      adicionarLivroNaLista: mockAdicionarLivroNaLista
    });

    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar as informações básicas do livro', () => {
    render(<BookCard livro={mockLivro} />);
    expect(screen.getByText('O Nome do Vento')).toBeInTheDocument();
    expect(screen.getByText('Patrick Rothfuss')).toBeInTheDocument();
  });

  it('deve exibir o botão "+" quando o livro não estiver na estante (sem status)', () => {
    render(<BookCard livro={mockLivro} />);
    const botaoAdicionar = screen.getByRole('button', { name: '+' });
    expect(botaoAdicionar).toBeInTheDocument();
  });

  it('deve exibir o botão "..." quando o livro já estiver na estante (com status)', () => {
    useShelf.mockReturnValue({
       estante: [{ ...mockLivro, statusLeitura: 'LENDO' }],
       adicionarLivro: mockAdicionarLivro,
       removerLivro: mockRemoverLivro,
       alternarFavorito: mockAlternarFavorito
     });
         
    render(<BookCard livro={mockLivro} />);
         
    const botaoAtualizar = screen.getByRole('button', { name: '...' });
    expect(botaoAtualizar).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
  });

  it('deve favoritar um livro ao clicar no botão de coração', () => {
    useShelf.mockReturnValue({
      estante: [{ ...mockLivro, statusLeitura: 'LIDO', favorito: false }],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });
    
    render(<BookCard livro={mockLivro} />);
    
    const btnFavorito = screen.getByTitle('Favoritar obra');
    fireEvent.click(btnFavorito);
    
    expect(mockAlternarFavorito).toHaveBeenCalledWith('O Nome do Vento');
  });

  it('deve salvar as alterações de status fechando o modal corretamente', () => {
    render(<BookCard livro={mockLivro} />);
    
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    
    expect(mockAdicionarLivro).toHaveBeenCalledWith(mockLivro, expect.any(Object));
  });

  it('deve deletar um livro da estante através do modal', () => {
    useShelf.mockReturnValue({
      estante: [{ ...mockLivro, statusLeitura: 'LIDO' }],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });
    
    render(<BookCard livro={mockLivro} />);
    
    fireEvent.click(screen.getByRole('button', { name: '...' }));
    
    fireEvent.click(screen.getByTitle('Excluir da estante'));
    
    expect(mockRemoverLivro).toHaveBeenCalledWith('O Nome do Vento');
  });

  it('deve adicionar um livro a uma lista customizada através do modal', () => {
    render(<BookCard livro={mockLivro} />);
    
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    const selectListas = screen.getByLabelText(/Adicionar à Lista:/i);
    fireEvent.change(selectListas, { target: { value: '1' } });
    
    fireEvent.click(screen.getByTitle('Adicionar livro à lista'));

    expect(mockAdicionarLivroNaLista).toHaveBeenCalledWith('1', mockLivro);
    expect(window.alert).toHaveBeenCalledWith('Livro adicionado à lista com sucesso!');
  });
});