import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShelfView from './ShelfView';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useShelf/useShelf');

describe('View: ShelfView', () => {
    const mockLivrosEstante = [
        { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', statusLeitura: 'LENDO', capaUrl: 'url1' },
        { titulo: '1984', autor: 'George Orwell', genero: 'Ficção', statusLeitura: 'QUERO_LER', capaUrl: 'url2' }
    ];

    it('deve renderizar o título da estante e os botões de filtro', () => {
        useShelf.mockReturnValue({ estante: [] });
        render(<ShelfView livrosGuardados={mockLivrosEstante} />);

        expect(screen.getByRole('heading', { name: /minha estante/i, level: 2 })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Lendo' })).toBeInTheDocument();
    });

    it('deve filtrar os livros corretamente ao clicar nos botões de status', () => {
        useShelf.mockReturnValue({ estante: mockLivrosEstante });
        render(<ShelfView />);

        expect(screen.getByText('O Hobbit')).toBeInTheDocument();
        expect(screen.getByText('1984')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Lendo' }));
        expect(screen.getByText('O Hobbit')).toBeInTheDocument();
        expect(screen.queryByText('1984')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Quero Ler' }));
        expect(screen.queryByText('O Hobbit')).not.toBeInTheDocument();
        expect(screen.getByText('1984')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Abandonado' }));
        expect(screen.getByText(/Nenhum livro encontrado para este status/i)).toBeInTheDocument();
    });

    it('deve exibir mensagem de estante vazia quando não houver livros', () => {
        useShelf.mockReturnValue({ estante: [] });
        render(<ShelfView livrosGuardados={[]} />);
        
        expect(screen.getByText(/Nenhum livro encontrado para este status/i)).toBeInTheDocument();
    });
});