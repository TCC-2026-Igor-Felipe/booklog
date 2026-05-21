import { render, screen } from '@testing-library/react';
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
            { titulo: '1984', autor: 'George Orwell', capaUrl: 'https://via.placeholder.com/150' },
            { titulo: 'Duna', autor: 'Frank Herbert', capaUrl: 'https://via.placeholder.com/150' }
        ];

        render(<SearchView resultados={mockResultados} />);
        
        const livro1 = screen.getByText('1984');
        const livro2 = screen.getByText('Duna');
        
        expect(livro1).toBeInTheDocument();
        expect(livro2).toBeInTheDocument();
        });  
});