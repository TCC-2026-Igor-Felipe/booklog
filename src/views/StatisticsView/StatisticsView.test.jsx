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

    it('deve calcular e exibir as métricas resumidas e o autor mais lido', () => {
        const mockEstante = [
            { titulo: 'Livro 1', autor: 'Isaac Asimov', genero: 'Ficção', statusLeitura: 'LIDO', notaAvaliacao: 4 },
            { titulo: 'Livro 2', autor: 'Arthur C. Clarke', statusLeitura: 'LIDO', notaAvaliacao: 5 },
            { titulo: 'Livro 3', autor: 'Arthur C. Clarke', statusLeitura: 'LENDO' }
        ];
        useShelf.mockReturnValue({ estante: mockEstante });
        render(<StatisticsView />);

        expect(screen.getByText('Total na Estante: 3')).toBeInTheDocument();
        expect(screen.getByText('Concluídos: 2')).toBeInTheDocument();
        expect(screen.getByText('Média de Notas: 4.5')).toBeInTheDocument();
        expect(screen.getByText('Arthur C. Clarke')).toBeInTheDocument();
    });

    it('deve exibir "N/A" para métricas vazias e não quebrar com livros sem atributos', () => {
        useShelf.mockReturnValue({ estante: [{ titulo: 'Livro Desconhecido', statusLeitura: 'QUERO_LER' }] });
        render(<StatisticsView />);
        
        expect(screen.getByText('Média de Notas: N/A')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument(); 
    });

    it('deve renderizar o Diário Recente se houver livros lidos com resenha cadastrada', () => {
        const mockEstante = [
            { 
                titulo: '1984', 
                autor: 'George Orwell', 
                statusLeitura: 'LIDO', 
                notaAvaliacao: 4.5,
                resenhaTextual: 'Uma obra-prima atemporal.',
                capaUrl: 'url-da-capa'
            }
        ];
        useShelf.mockReturnValue({ estante: mockEstante });
        render(<StatisticsView />);

        expect(screen.getByText('Diário Recente')).toBeInTheDocument();
        expect(screen.getByText(/1984/i)).toBeInTheDocument();
        expect(screen.getByText(/"Uma obra-prima atemporal."/i)).toBeInTheDocument();
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