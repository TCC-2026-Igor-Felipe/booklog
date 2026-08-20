import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as RouterDom from 'react-router-dom';
import ListDetailsView from './ListDetailsView';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useCustomLists/useCustomLists');
vi.mock('../../hooks/useShelf/useShelf');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('View: ListDetailsView', () => {
  const mockReordenar = vi.fn();

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('deve exibir mensagem de erro e botão de voltar se a lista não for encontrada', () => {
    vi.mocked(RouterDom.useParams).mockReturnValue({ id: '999' });
    useCustomLists.mockReturnValue({ listas: [], reordenarLivrosDaLista: mockReordenar });
    useShelf.mockReturnValue({ estante: [] });
    renderWithRouter(<ListDetailsView />);

    expect(screen.getByRole('heading', { name: /Lista não encontrada/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar para Listas/i })).toBeInTheDocument();
  });

  it('deve renderizar o cabeçalho da lista e os livros presentes nela', () => {
    vi.mocked(RouterDom.useParams).mockReturnValue({ id: '1' });

    useCustomLists.mockReturnValue({
      listas: [
        {
          id: '1',
          titulo: 'Quero ler em 2027',
          descricao: 'Metas do próximo ano',
          livros: [
            { titulo: 'Neuromancer', autor: 'William Gibson' },
            { titulo: 'Fundação', autor: 'Isaac Asimov' }
          ]
        }
      ],
      reordenarLivrosDaLista: mockReordenar
    });
    useShelf.mockReturnValue({ estante: [] });

    renderWithRouter(<ListDetailsView />);

    expect(screen.getByText('Quero ler em 2027')).toBeInTheDocument();
    expect(screen.getByText('Metas do próximo ano')).toBeInTheDocument();
    expect(screen.getByText('2 obra(s)')).toBeInTheDocument();

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.getByText('Fundação')).toBeInTheDocument();
  });

  it('deve alternar para o modo de reordenação e chamar atualizarLivrosDaLista ao salvar', () => {
    vi.mocked(RouterDom.useParams).mockReturnValue({ id: '1' });
    const mockAtualizar = vi.fn();

    useCustomLists.mockReturnValue({
      listas: [{
        id: '1', titulo: 'Ranking', descricao: '',
        livros: [{ titulo: 'Livro A' }, { titulo: 'Livro B' }]
      }],
      atualizarLivrosDaLista: mockAtualizar
    });
    useShelf.mockReturnValue({ estante: [] });

    renderWithRouter(<ListDetailsView />);

    const botaoReordenar = screen.getByRole('button', { name: /Reordenar/i });

    fireEvent.click(botaoReordenar);

    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Reordenar/i })).not.toBeInTheDocument();

    const botaoSalvar = screen.getByRole('button', { name: /Salvar/i });
    fireEvent.click(botaoSalvar);

    expect(mockAtualizar).toHaveBeenCalledWith('1', [{ titulo: 'Livro A' }, { titulo: 'Livro B' }]);
    expect(screen.getByRole('button', { name: /Reordenar/i })).toBeInTheDocument();
  });
});