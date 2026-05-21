import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookCard from './BookCard';

describe('BookCard Component', () => {
    const livroMock = {
        titulo: 'O Senhor dos Anéis',
        autor: 'J.R.R. Tolkien',
        capaUrl: 'https://via.placeholder.com/150'
    };

    it('deve renderizar o título e autor do livro na tela', () => {
        render(<BookCard livro={livroMock} />);

        const tituloElement = screen.getByText('O Senhor dos Anéis');
        const autorElement = screen.getByText('J.R.R. Tolkien');

        expect(tituloElement).toBeInTheDocument();
        expect(autorElement).toBeInTheDocument();
    });
});