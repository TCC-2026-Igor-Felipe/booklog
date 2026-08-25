import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as RouterDom from 'react-router-dom';
import ListDetailsView from './ListDetailsView';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useCustomLists/useCustomLists');
vi.mock('../../hooks/useShelf/useShelf');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: vi.fn() };
});

describe('View: ListDetailsView', () => {
  const mockAtualizar = vi.fn();

  const mockLivros = [
    { titulo: 'Livro A', autor: 'Autor A', genero: 'Fantasia', ano: 2000 },
    { titulo: 'Livro B', autor: 'Autor B', genero: 'Ficção', ano: 2005 }
  ];
  
  const mockListaPadrao = {
    id: '1',
    titulo: 'Ranking',
    descricao: 'Meus top livros',
    livros: mockLivros
  };

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  const setupMocks = (listaCustomizada = mockListaPadrao, mockIdUrl = '1') => {
    vi.mocked(RouterDom.useParams).mockReturnValue({ id: mockIdUrl });
    
    useCustomLists.mockReturnValue({
      listas: listaCustomizada ? [listaCustomizada] : [],
      atualizarLivrosDaLista: mockAtualizar
    });
    
    useShelf.mockReturnValue({ estante: [] });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir mensagem de erro e botão de voltar se a lista não for encontrada', () => {
    setupMocks(null, '999');
    renderWithRouter(<ListDetailsView />);
    
    expect(screen.getByRole('heading', { name: /Lista não encontrada/i })).toBeInTheDocument();
  });

  it('deve renderizar o cabeçalho da lista e os livros presentes nela', () => {
    setupMocks();
    renderWithRouter(<ListDetailsView />);
    
    expect(screen.getByText('Ranking')).toBeInTheDocument();
    expect(screen.getByText('Meus top livros')).toBeInTheDocument();
    expect(screen.getByText('2 obra(s)')).toBeInTheDocument();
    expect(screen.getByText('Livro A')).toBeInTheDocument();
    expect(screen.getByText('Livro B')).toBeInTheDocument();
  });

  it('deve alternar para o modo de reordenação e chamar atualizarLivrosDaLista ao salvar', () => {
    setupMocks();
    renderWithRouter(<ListDetailsView />);

    fireEvent.click(screen.getByRole('button', { name: /Reordenar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(mockAtualizar).toHaveBeenCalledWith('1', mockLivros);
  });

  it('deve cancelar o modo de reordenação retornando ao estado original', () => {
    setupMocks();
    renderWithRouter(<ListDetailsView />);

    fireEvent.click(screen.getByRole('button', { name: /Reordenar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    expect(screen.getByRole('button', { name: /Reordenar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Salvar/i })).not.toBeInTheDocument();
  });

  it('deve reordenar os itens corretamente utilizando eventos de drag and drop', () => {
    setupMocks();
    const { container } = renderWithRouter(<ListDetailsView />);

    fireEvent.click(screen.getByRole('button', { name: /Reordenar/i }));
    const cards = container.querySelectorAll('.draggable-card');

    fireEvent.dragStart(cards[0]);
    fireEvent.dragEnter(cards[1]);
    fireEvent.dragOver(cards[1]);
    fireEvent.dragEnd(cards[1]);

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(mockAtualizar).toHaveBeenCalledWith('1', [mockLivros[1], mockLivros[0]]);
  });

  it('não deve alterar a ordem se o item for arrastado e solto no mesmo lugar', () => {
    setupMocks();
    const { container } = renderWithRouter(<ListDetailsView />);

    fireEvent.click(screen.getByRole('button', { name: /Reordenar/i }));
    const cards = container.querySelectorAll('.draggable-card');

    fireEvent.dragStart(cards[0]);
    fireEvent.dragEnter(cards[0]);
    fireEvent.dragEnd(cards[0]);

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    
    expect(mockAtualizar).toHaveBeenCalledWith('1', mockLivros); // Ordem inalterada
  });

  it('deve manter o botão Reordenar desabilitado se a lista tiver menos de 2 livros', () => {
    setupMocks({ ...mockListaPadrao, livros: [mockLivros[0]] });
    renderWithRouter(<ListDetailsView />);
    
    expect(screen.getByRole('button', { name: /Reordenar/i })).toBeDisabled();
  });

  it('deve exibir mensagem indicando que a lista está vazia caso não haja livros', () => {
    setupMocks({ ...mockListaPadrao, livros: [] });
    renderWithRouter(<ListDetailsView />);
    
    expect(screen.getByText('Esta lista ainda está vazia.')).toBeInTheDocument();
  });
});