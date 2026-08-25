import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchView from './SearchView';

vi.mock('../../components/FilterBar/FilterBar', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        default: (props) => (
            <div>
                <actual.default {...props} />
                <button onClick={() => props.onFilterChange('alienigena', '123')}>Mock</button>
            </div>
        )
    };
});

describe('SearchView Component', () => {
    const mockCatalogo = [
        { titulo: '1984', autor: 'George Orwell', genero: 'Ficção', ano: 1949, capaUrl: 'url1' },
        { titulo: 'Duna', autor: 'Frank Herbert', genero: 'Ficção', ano: 1965, capaUrl: 'url2' },
        { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', ano: 1937, capaUrl: 'url3' },
        { titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Tecnologia', ano: 2008, capaUrl: 'url4' }
    ];

    it('deve renderizar a barra de pesquisa na tela principal', () => {
        render(<SearchView />);
        expect(screen.getByPlaceholderText('Buscar por título ou autor...')).toBeInTheDocument();
    });

    it('deve renderizar BookCard quando houver resultados', () => {
        render(<SearchView resultados={mockCatalogo} />);
        expect(screen.getByText('1984')).toBeInTheDocument();
        expect(screen.getByText('Duna')).toBeInTheDocument();
    });

    it('deve filtrar a lista de livros ao digitar na barra de pesquisa', () => {
        render(<SearchView resultados={mockCatalogo} />);
        const searchInput = screen.getByPlaceholderText('Buscar por título ou autor...');
        fireEvent.change(searchInput, { target: { value: '1984' } });
        
        expect(screen.getByText('1984')).toBeInTheDocument();
        expect(screen.queryByText('Duna')).not.toBeInTheDocument(); // Duna deve sumir
    });

    it('deve filtrar a lista de livros ao selecionar um gênero', () => {
        render(<SearchView resultados={mockCatalogo} />);
        const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });
        fireEvent.change(seletorGenero, { target: { value: 'Fantasia' } });
        
        expect(screen.getByText('O Hobbit')).toBeInTheDocument();
        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument();
    });

    it('deve filtrar a lista de livros ao digitar o ano de publicação', () => {
        render(<SearchView resultados={mockCatalogo} />);
        const inputAno = screen.getByRole('spinbutton', { name: /ano/i });
        fireEvent.change(inputAno, { target: { value: '1965' } });
        
        expect(screen.getByText('Duna')).toBeInTheDocument();
        expect(screen.queryByText('1984')).not.toBeInTheDocument();
    });

    it('deve exibir mensagem de lista vazia quando nenhum livro corresponder à pesquisa', () => {
        render(<SearchView resultados={mockCatalogo} />);
        const searchInput = screen.getByPlaceholderText('Buscar por título ou autor...');
        fireEvent.change(searchInput, { target: { value: 'LivroQueNaoExiste123' } });
        
        expect(screen.getByText('Nenhum livro encontrado com este termo.')).toBeInTheDocument();
    });

    it('não deve quebrar ao receber um tipo de filtro desconhecido do FilterBar', () => {
        render(<SearchView />);
        expect(() => fireEvent.click(screen.getByRole('button', { name: 'Mock' }))).not.toThrow();
    });
});