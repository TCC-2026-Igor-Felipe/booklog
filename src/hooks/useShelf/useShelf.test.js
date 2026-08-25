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

        act(() => {
            result.current.adicionarLivro(novoLivro, { statusLeitura: 'QUERO_LER' });
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
            result.current.adicionarLivro(livro, { statusLeitura: 'QUERO_LER' });
        });

        act(() => {
            result.current.adicionarLivro(livro, { statusLeitura: 'LENDO' });
        });

        expect(result.current.estante).toHaveLength(1);
        expect(result.current.estante[0].statusLeitura).toBe('LENDO');
    });

    it('deve salvar a nota e a resenha ao adicionar um livro como LIDO', () => {
        const { result } = renderHook(() => useShelf());
        const livro = { titulo: 'Clean Code', autor: 'Robert C. Martin' };

        const atualizacoes = {
            statusLeitura: 'LIDO',
            notaAvaliacao: 5,
            resenhaTextual: 'Leitura obrigatória!'
        };

        act(() => {
            result.current.adicionarLivro(livro, atualizacoes);
        });

        expect(result.current.estante).toHaveLength(1);
        expect(result.current.estante[0].notaAvaliacao).toBe(5);
        expect(result.current.estante[0].resenhaTextual).toBe('Leitura obrigatória!');
    });

    it('deve remover um livro da estante e do localStorage', () => {
        const { result } = renderHook(() => useShelf());
        const livro = { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien' };

        act(() => {
            result.current.adicionarLivro(livro, { statusLeitura: 'LIDO' });
        });

        act(() => {
            result.current.removerLivro(livro.titulo);
        });

        expect(result.current.estante).toHaveLength(0);
    });

    it('deve alternar o status de favorito de um livro existente na estante', () => {
        const { result } = renderHook(() => useShelf());
        const livro = { titulo: 'O Programador Pragmático', autor: 'Andrew Hunt' };

        act(() => {
            result.current.adicionarLivro(livro, { statusLeitura: 'LIDO' });
        });

        act(() => {
            result.current.alternarFavorito(livro.titulo);
        });

        expect(result.current.estante[0].favorito).toBe(true);

        act(() => {
            result.current.alternarFavorito(livro.titulo);
        });

        expect(result.current.estante[0].favorito).toBe(false);
    });

    it('não deve permitir favoritar mais de 5 livros', () => {
        const { result } = renderHook(() => useShelf());

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        for (let i = 1; i <= 6; i++) {
            act(() => {
                result.current.adicionarLivro(
                    { titulo: `Livro ${i}`, autor: 'Autor Desconhecido' }, 
                    { statusLeitura: 'LIDO' }
                );
            });
        }

        for (let i = 1; i <= 5; i++) {
            act(() => {
                result.current.alternarFavorito(`Livro ${i}`);
            });
        }

        act(() => {
            result.current.alternarFavorito('Livro 6');
        });

        const totalFavoritos = result.current.estante.filter(l => l.favorito).length;

        expect(totalFavoritos).toBe(5);
        expect(alertMock).toHaveBeenCalledWith('Você pode ter no máximo 5 livros favoritos.');
        
        alertMock.mockRestore();
    });

    it('deve carregar a estante do localStorage ao inicializar', () => {
        window.localStorage.setItem('booklog_estante', JSON.stringify([{ titulo: 'Fundação' }]));
        const { result } = renderHook(() => useShelf());
        expect(result.current.estante).toHaveLength(1);
        expect(result.current.estante[0].titulo).toBe('Fundação');
    });

    it('não deve fazer nada se alternarFavorito for chamado com um livro inexistente', () => {
        const { result } = renderHook(() => useShelf());
        act(() => { result.current.alternarFavorito('Livro Fantasma'); });
        expect(result.current.estante).toEqual([]);
    });
});