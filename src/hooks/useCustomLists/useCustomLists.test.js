import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useCustomLists from './useCustomLists';

describe('Hook: useCustomLists', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('deve inicializar com um array vazio se não houver listas salvas', () => {
        const { result } = renderHook(() => useCustomLists());
        expect(result.current.listas).toEqual([]);
    });

    it('deve criar uma nova lista customizada', () => {
        const { result } = renderHook(() => useCustomLists());

        act(() => {
            result.current.criarLista('Ficção Científica', 'Meus favoritos do espaço');
        });

        expect(result.current.listas).toHaveLength(1);
        expect(result.current.listas[0].id).toBeDefined();
        expect(result.current.listas[0].titulo).toBe('Ficção Científica');
        expect(result.current.listas[0].descricao).toBe('Meus favoritos do espaço');
        expect(result.current.listas[0].livros).toEqual([]);
    });

    it('deve adicionar um livro a uma lista existente', () => {
        const { result } = renderHook(() => useCustomLists());

        act(() => {
            result.current.criarLista('Top 10', 'Melhores leituras');
        });

        const idLista = result.current.listas[0].id;
        const mockLivro = { titulo: 'Duna', autor: 'Frank Herbert' };

        act(() => {
            result.current.adicionarLivroNaLista(idLista, mockLivro);
        });

        expect(result.current.listas[0].livros).toHaveLength(1);
        expect(result.current.listas[0].livros[0].titulo).toBe('Duna');
    });

    it('deve remover um livro de uma lista existente', () => {
        const { result } = renderHook(() => useCustomLists());

        act(() => {
            result.current.criarLista('Top 10', 'Melhores leituras');
        });

        const idLista = result.current.listas[0].id;
        const mockLivro = { titulo: '1984', autor: 'George Orwell' };

        act(() => {
            result.current.adicionarLivroNaLista(idLista, mockLivro);
        });

        act(() => {
            result.current.removerLivroDaLista(idLista, mockLivro.titulo);
        });

        expect(result.current.listas[0].livros).toHaveLength(0);
    });

    it('deve excluir uma lista inteira', () => {
        const { result } = renderHook(() => useCustomLists());

        act(() => {
            result.current.criarLista('Lista Temporária', 'Vou apagar');
        });

        const idLista = result.current.listas[0].id;

        act(() => {
            result.current.removerLista(idLista);
        });

        expect(result.current.listas).toHaveLength(0);
    });

    it('deve atualizar toda a lista de livros de uma vez ao salvar a reordenação', () => {
        const { result } = renderHook(() => useCustomLists());
        act(() => { result.current.criarLista('Minha Lista', 'Desc'); });
        const idLista = result.current.listas[0].id;
        
        act(() => {
            result.current.adicionarLivroNaLista(idLista, { titulo: 'Livro A' });
            result.current.adicionarLivroNaLista(idLista, { titulo: 'Livro B' });
        });

        const novaOrdem = [{ titulo: 'Livro B' }, { titulo: 'Livro A' }];
        act(() => {
            result.current.atualizarLivrosDaLista(idLista, novaOrdem);
        });

        const livros = result.current.listas[0].livros;
        expect(livros[0].titulo).toBe('Livro B');
        expect(livros[1].titulo).toBe('Livro A');
    });

    it('não deve adicionar um livro duplicado na mesma lista', () => {
        const { result } = renderHook(() => useCustomLists());
        act(() => { result.current.criarLista('Lista Única', 'Desc'); });
        
        const idLista = result.current.listas[0].id;
        const mockLivro = { titulo: '1984', autor: 'George Orwell' };

        act(() => { result.current.adicionarLivroNaLista(idLista, mockLivro); });
        act(() => { result.current.adicionarLivroNaLista(idLista, mockLivro); });

        expect(result.current.listas[0].livros).toHaveLength(1);
    });

    it('não deve alterar outras listas ao modificar uma lista específica', async () => {
        const { result } = renderHook(() => useCustomLists());
        
        act(() => { 
            result.current.criarLista('Lista Alvo', 'Modificada'); 
        });

        await new Promise((resolve) => setTimeout(resolve, 10));
        
        act(() => { 
            result.current.criarLista('Lista Intocável', 'Não deve mudar'); 
        });
        
        const idAlvo = result.current.listas[0].id;
        const mockLivro = { titulo: 'Duna' };

        act(() => { result.current.adicionarLivroNaLista(idAlvo, mockLivro); });
        act(() => { result.current.removerLivroDaLista(idAlvo, 'Duna'); });
        act(() => { result.current.atualizarLivrosDaLista(idAlvo, [mockLivro]); });

        expect(result.current.listas[1].livros).toHaveLength(0);
        expect(result.current.listas[1].titulo).toBe('Lista Intocável');
    });

    it('deve carregar as listas do localStorage ao inicializar', () => {
        window.localStorage.setItem('booklog_listas', JSON.stringify([{ id: '1', titulo: 'Minha Lista', livros: [] }]));
        const { result } = renderHook(() => useCustomLists());
        expect(result.current.listas).toHaveLength(1);
        expect(result.current.listas[0].titulo).toBe('Minha Lista');
    });
});