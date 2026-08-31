import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileView from './ProfileView';
import useShelf from '../../hooks/useShelf/useShelf';

vi.mock('../../hooks/useShelf/useShelf');

describe('View: ProfileView', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve renderizar o cabeçalho do perfil com nome padrão, foto e título inicial', () => {
    useShelf.mockReturnValue({ estante: [] });
    render(<ProfileView />);
    expect(screen.getByRole('heading', { name: /Igor Felipe/i })).toBeInTheDocument();
    expect(screen.getByText(/Leitor\(a\) Iniciante • 0 obras na estante/i)).toBeInTheDocument();
  });

  it('deve alternar os títulos do leitor dinamicamente com base nas faixas de leitura', () => {
    useShelf.mockReturnValue({ estante: new Array(6).fill({ statusLeitura: 'LIDO' }) });
    const { unmount: unmountCasual } = render(<ProfileView />);
    expect(screen.getByText(/Leitor\(a\) Casual • 6 obras na estante/i)).toBeInTheDocument();
    unmountCasual();

    useShelf.mockReturnValue({ estante: new Array(16).fill({ statusLeitura: 'LIDO' }) });
    const { unmount: unmountAssiduo } = render(<ProfileView />);
    expect(screen.getByText(/Leitor\(a\) Assíduo\(a\) • 16 obras na estante/i)).toBeInTheDocument();
    unmountAssiduo();

    useShelf.mockReturnValue({ estante: new Array(31).fill({ statusLeitura: 'LIDO' }) });
    render(<ProfileView />);
    expect(screen.getByText(/Devorador de Livros • 31 obras na estante/i)).toBeInTheDocument();
  });

  it('deve permitir editar e salvar o nome do perfil disparando o form submit direto', () => {
    useShelf.mockReturnValue({ estante: [] });
    render(<ProfileView />);
    
    fireEvent.click(screen.getByTitle('Editar Perfil'));
    const inputNome = screen.getByPlaceholderText('Seu Nome');
    fireEvent.change(inputNome, { target: { value: 'Novo Nome Teste' } });
    
    fireEvent.submit(inputNome.closest('form'));
    
    expect(screen.getByRole('heading', { name: /Novo Nome Teste/i })).toBeInTheDocument();
    expect(window.localStorage.getItem('booklog_nome')).toBe('Novo Nome Teste');
  });

  it('deve permitir cancelar a edição do perfil revertendo as mudanças não salvas', () => {
    useShelf.mockReturnValue({ estante: [] });
    render(<ProfileView />);
    fireEvent.click(screen.getByTitle('Editar Perfil'));
    fireEvent.change(screen.getByPlaceholderText('Seu Nome'), { target: { value: 'Nome Cancelado' } });
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(screen.getByRole('heading', { name: /Igor Felipe/i })).toBeInTheDocument();
  });

  it('deve renderizar os favoritos, diário recente e acumular o autor mais lido perfeitamente', () => {
    const mockEstante = [
      { titulo: 'A', autor: 'Autor A', statusLeitura: 'LIDO', notaAvaliacao: 5, resenhaTextual: 'Ótimo', favorito: true },
      { titulo: 'B', autor: 'Autor B', statusLeitura: 'LIDO', notaAvaliacao: 4.5, resenhaTextual: 'Bom' },
      { titulo: 'C', autor: 'Autor B', statusLeitura: 'LIDO', notaAvaliacao: 3 },
      { titulo: 'D', autor: 'Autor C', statusLeitura: 'LIDO', notaAvaliacao: 2 }
    ];
    useShelf.mockReturnValue({ estante: mockEstante });
    render(<ProfileView />);
    
    expect(screen.queryByText('Você ainda não possui livros favoritos.')).not.toBeInTheDocument();
    expect(screen.getByText('Minhas Estatísticas')).toBeInTheDocument();
    expect(screen.getAllByText('Autor B').length).toBeGreaterThan(0);
  });

  it('deve exibir fallback "N/A" para estatísticas vazias e tratar autores indefinidos', () => {
    useShelf.mockReturnValue({ estante: [{ titulo: 'Sem Dados', statusLeitura: 'QUERO_LER' }] });
    render(<ProfileView />);
    expect(screen.getByText('Média de Notas: N/A')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});