import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
    it('deve renderizar o input de busca na tela', () => {
        render(<SearchBar />);
        const inputElement = screen.getByPlaceholderText('Buscar por título, autor ou ISBN...');

        expect(inputElement).toBeInTheDocument();
    });

    it('deve chamar a função onSearch passando o texto digitado', () => {
        const mockOnSearch = vi.fn();
        
        render(<SearchBar onSearch={mockOnSearch} />);
        
        const inputElement = screen.getByPlaceholderText('Buscar por título, autor ou ISBN...');
            
        fireEvent.change(inputElement, { target: { value: 'Tolkien' } });
        
        expect(mockOnSearch).toHaveBeenCalledWith('Tolkien');
    });
});