import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useShelf from './useShelf';

describe('Hook: useShelf', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('deve inicializar com uma estante vazia se o localStorage estiver limpo', () => {
        const { result } = renderHook(() => useShelf());

        expect(result.current.estante).toEqual([]);
    });

    it('deve adicionar um livro à estante com status de leitura e persistir no localStorage', () => {
        const { result } = renderHook(() => useShelf());

        const novoLivro = { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien' };
        const status = 'QUERO_LER';

        act(() => {
            result.current.adicionarLivro(novoLivro, status);
        });

        expect(result.current.estante).toHaveLength(1);
        expect(result.current.estante[0].titulo).toBe('O Hobbit');
        expect(result.current.estante[0].statusLeitura).toBe('QUERO_LER');

        const estanteSalva = JSON.parse(window.localStorage.getItem('booklog_estante'));
        expect(estanteSalva).toHaveLength(1);
        expect(estanteSalva[0].statusLeitura).toBe('QUERO_LER');
    });

    it('deve atualizar o status do livro se ele já existir na estante, sem duplicar', () => {
        const { result } = renderHook(() => useShelf());

        const livro = { titulo: 'Duna', autor: 'Frank Herbert' };

        act(() => {
            result.current.adicionarLivro(livro, 'QUERO_LER');
        });

        act(() => {
            result.current.adicionarLivro(livro, 'LENDO');
        });

        expect(result.current.estante).toHaveLength(1);

        expect(result.current.estante[0].statusLeitura).toBe('LENDO');

        const estanteSalva = JSON.parse(window.localStorage.getItem('booklog_estante'));
        expect(estanteSalva).toHaveLength(1);
        expect(estanteSalva[0].statusLeitura).toBe('LENDO');
    });

    it('deve remover um livro da estante e do localStorage', () => {
        const { result } = renderHook(() => useShelf());
        const livro = { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien' };

        act(() => {
            result.current.adicionarLivro(livro, 'LIDO');
        });
        expect(result.current.estante).toHaveLength(1);

        act(() => {
            result.current.removerLivro(livro.titulo);
        });

        expect(result.current.estante).toHaveLength(0);
        const estanteSalva = JSON.parse(window.localStorage.getItem('booklog_estante'));
        expect(estanteSalva).toHaveLength(0);
    });
});