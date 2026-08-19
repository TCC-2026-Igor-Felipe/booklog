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

    it('deve calcular e exibir as métricas resumidas corretamente', () => {
        const mockEstante = [
            { titulo: 'Livro 1', statusLeitura: 'LIDO', notaAvaliacao: 4 },
            { titulo: 'Livro 2', statusLeitura: 'LIDO', notaAvaliacao: 5 },
            { titulo: 'Livro 3', statusLeitura: 'LENDO' }
        ];

        useShelf.mockReturnValue({ estante: mockEstante });

        render(<StatisticsView />);

        expect(screen.getByText('Total na Estante: 3')).toBeInTheDocument();
        expect(screen.getByText('Concluídos: 2')).toBeInTheDocument();

        expect(screen.getByText('Média de Notas: 4.5')).toBeInTheDocument();
    });
});