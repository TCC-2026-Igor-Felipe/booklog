import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useSearch from './useSearch';

describe('Hook: useSearch', () => {
    const mockCatalogo = [
        { titulo: '1984', autor: 'George Orwell', genero: 'Ficção', ano: 1949 },
        { titulo: 'Duna', autor: 'Frank Herbert', genero: 'Ficção', ano: 1965 },
        { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', ano: 1937 }
    ];

    it('deve filtrar os livros pelo texto de busca', () => {
        const { result } = renderHook(() => useSearch(mockCatalogo));

        expect(result.current.livrosFiltrados).toHaveLength(3);

        act(() => {
            result.current.setTermoBusca('1984');
        });

        expect(result.current.livrosFiltrados).toHaveLength(1);
        expect(result.current.livrosFiltrados[0].titulo).toBe('1984');
    });


    it('deve filtrar os livros pelo género selecionado', () => {
        const { result } = renderHook(() => useSearch(mockCatalogo));

        act(() => {
            result.current.setFiltroGenero('Fantasia');
        });

        expect(result.current.livrosFiltrados).toHaveLength(1);
        expect(result.current.livrosFiltrados[0].titulo).toBe('O Hobbit');
    });

    it('deve filtrar os livros pelo ano utilizando correspondência parcial (startsWith)', () => {
        const { result } = renderHook(() => useSearch(mockCatalogo));

        act(() => {
            result.current.setFiltroAno('19');
        });

        expect(result.current.livrosFiltrados).toHaveLength(3);

        act(() => {
            result.current.setFiltroAno('196');
        });

        expect(result.current.livrosFiltrados).toHaveLength(1);
        expect(result.current.livrosFiltrados[0].titulo).toBe('Duna');
    });

    it('deve lidar com obras do catálogo que não possuem atributos definidos', () => {
        const catalogoIncompleto = [{}];
        const { result } = renderHook(() => useSearch(catalogoIncompleto));
        
        act(() => { result.current.setTermoBusca('fantasia'); });

        expect(result.current.livrosFiltrados).toHaveLength(0);
    });

    it('deve retornar vazio ao filtrar por ano em um livro sem ano definido', () => {
        const catalogoIncompleto = [{ titulo: 'Mistério Sem Data' }];
        const { result } = renderHook(() => useSearch(catalogoIncompleto));
        
        act(() => { result.current.setFiltroAno('2020'); });
        
        expect(result.current.livrosFiltrados).toHaveLength(0);
    });
});