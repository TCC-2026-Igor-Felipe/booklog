import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SearchView from './SearchView';

describe('SearchView Component', () => {
    it('deve renderizar a barra de pesquisa na tela principal', () => {
        render(<SearchView />);

        const searchInput = screen.getByPlaceholderText('Buscar por título ou autor...');

        expect(searchInput).toBeInTheDocument();
    });

    it('deve renderizar BookCard quando houver resultados', () => {
        const mockResultados = [
            { titulo: '1984', autor: 'George Orwell', capaUrl: 'https://placehold.co/625x1000' },
            { titulo: 'Duna', autor: 'Frank Herbert', capaUrl: 'https://placehold.co/625x1000' }
        ];

        render(<SearchView resultados={mockResultados} />);

        const livro1 = screen.getByText('1984');
        const livro2 = screen.getByText('Duna');

        expect(livro1).toBeInTheDocument();
        expect(livro2).toBeInTheDocument();
    });

    it('deve filtrar a lista de livros ao digitar na barra de pesquisa', () => {
        const mockResultados = [
            { titulo: '1984', autor: 'George Orwell', capaUrl: 'https://placehold.co/625x1000' },
            { titulo: 'Duna', autor: 'Frank Herbert', capaUrl: 'https://placehold.co/625x1000' }
        ];

        render(<SearchView resultados={mockResultados} />);

        const searchInput = screen.getByPlaceholderText('Buscar por título ou autor...');

        fireEvent.change(searchInput, { target: { value: '1984' } });

        expect(screen.getByText('1984')).toBeInTheDocument();

        expect(screen.queryByText('Duna')).not.toBeInTheDocument();
    });

    it('deve filtrar a lista de livros ao selecionar um gênero', () => {
        const mockResultados = [
            { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', capaUrl: 'https://placehold.co/625x1000' },
            { titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Tecnologia', capaUrl: 'https://placehold.co/625x1000' }
        ];

        render(<SearchView resultados={mockResultados} />);

        const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });

        fireEvent.change(seletorGenero, { target: { value: 'Fantasia' } });

        expect(screen.getByText('O Hobbit')).toBeInTheDocument();

        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument();
    });
});