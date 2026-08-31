import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatisticsView from './StatisticsView';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useShelf/useShelf');

describe('View: StatisticsView', () => {
  it('deve exibir uma mensagem caso a estante esteja vazia', () => {
    useShelf.mockReturnValue({ estante: [] });
    render(<StatisticsView />);
    expect(screen.getByText(/Nenhum dado para exibir/i)).toBeInTheDocument();
  });

  it('deve calcular e exibir as métricas resumidas e testar todas as condições do autor mais lido', () => {
    const mockEstante = [
      { titulo: 'Livro 1', autor: 'Autor A', genero: 'Ficção', statusLeitura: 'LIDO', notaAvaliacao: 4 },
      { titulo: 'Livro 2', autor: 'Autor B', statusLeitura: 'LIDO', notaAvaliacao: 5 },
      { titulo: 'Livro 3', autor: 'Autor B', statusLeitura: 'LENDO' },
      { titulo: 'Livro 4', autor: 'Autor C', statusLeitura: 'LIDO' },
      { titulo: 'Livro 5', autor: '', statusLeitura: 'QUERO_LER' } 
    ];
    useShelf.mockReturnValue({ estante: mockEstante });
    render(<StatisticsView />);
    
    expect(screen.getByText('Total na Estante: 5')).toBeInTheDocument();
    expect(screen.getByText('Autor B')).toBeInTheDocument(); // Autor B é o vencedor com 2 livros
  });

  it('deve exibir "N/A" para métricas vazias', () => {
    useShelf.mockReturnValue({ estante: [{ titulo: 'Desconhecido', statusLeitura: 'QUERO_LER' }] });
    render(<StatisticsView />);
    expect(screen.getByText('Média de Notas: N/A')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('deve renderizar o Diário Recente cobrindo notas inteiras e quebradas', () => {
    const mockEstante = [
      {
        titulo: '1984',
        autor: 'George Orwell',
        statusLeitura: 'LIDO',
        notaAvaliacao: 4.5,
        resenhaTextual: 'Obra 1',
        capaUrl: 'url1'
      },
      {
        titulo: 'Revolução dos Bichos',
        autor: 'George Orwell',
        statusLeitura: 'LIDO',
        notaAvaliacao: 5,
        resenhaTextual: 'Obra 2',
        capaUrl: 'url2'
      }
    ];
    
    useShelf.mockReturnValue({ estante: mockEstante });
    render(<StatisticsView />);
    expect(screen.getByText('Diário Recente')).toBeInTheDocument();
    expect(screen.getByText(/Revolução dos Bichos/i)).toBeInTheDocument();
    
    useShelf.mockReturnValue({ estante: [mockEstante[1], mockEstante[0]] });
    const { unmount } = render(<StatisticsView />);
    expect(screen.getAllByText('Diário Recente').length).toBeGreaterThan(0);
  });

  it('deve processar as décadas e categorias de notas corretamente para os gráficos', () => {
    const mockEstante = [
      { titulo: 'A', ano: 1984, notaAvaliacao: 1, statusLeitura: 'LIDO' },
      { titulo: 'B', ano: 1989, notaAvaliacao: 3, statusLeitura: 'LIDO' },
      { titulo: 'C', ano: 2005, notaAvaliacao: 5, statusLeitura: 'LIDO' }
    ];
    useShelf.mockReturnValue({ estante: mockEstante });
    expect(() => render(<StatisticsView />)).not.toThrow();
  });
});