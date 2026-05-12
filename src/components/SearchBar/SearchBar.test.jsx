import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
    it('deve renderizar o input de busca na tela', () => {
        render(<SearchBar />);
        const inputElement = screen.getByPlaceholderText('Buscar por título, autor ou ISBN...');

        expect(inputElement).toBeInTheDocument();
    });
});