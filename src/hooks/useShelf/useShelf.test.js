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
});