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
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('deve exibir o botão "..." quando o livro já estiver na estante (com status)', () => {
    useShelf.mockReturnValue({
      estante: [{ ...mockLivro, statusLeitura: 'LENDO' }],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });
    render(<BookCard livro={mockLivro} />);
    expect(screen.getByRole('button', { name: '...' })).toBeInTheDocument();
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
    fireEvent.click(screen.getByTitle('Favoritar obra'));
    expect(mockAlternarFavorito).toHaveBeenCalledWith('O Nome do Vento');
  });

  it('deve exibir o ícone de coração preenchido quando o livro for favorito', () => {
    useShelf.mockReturnValue({
      estante: [{ ...mockLivro, statusLeitura: 'LIDO', favorito: true }],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });
    render(<BookCard livro={mockLivro} />);
    expect(screen.getByText('❤️')).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText(/Adicionar à Lista:/i), { target: { value: '1' } });
    fireEvent.click(screen.getByTitle('Adicionar livro à lista'));
    expect(mockAdicionarLivroNaLista).toHaveBeenCalledWith('1', mockLivro);
    expect(window.alert).toHaveBeenCalledWith('Livro adicionado à lista com sucesso!');
  });

  it('não deve exibir os botões de ação quando a propriedade hideActions for verdadeira', () => {
    useShelf.mockReturnValue({
      estante: [{ ...mockLivro, statusLeitura: 'LIDO', favorito: true }],
      adicionarLivro: mockAdicionarLivro,
      removerLivro: mockRemoverLivro,
      alternarFavorito: mockAlternarFavorito
    });
    render(<BookCard livro={mockLivro} hideActions={true} />);
    expect(screen.queryByTitle('Favoritar obra')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '...' })).not.toBeInTheDocument();
  });
});