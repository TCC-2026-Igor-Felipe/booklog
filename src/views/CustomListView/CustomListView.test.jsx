import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CustomListView from './CustomListView';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';

vi.mock('../../hooks/useCustomLists/useCustomLists');

describe('View: CustomListView', () => {
    it('deve renderizar o formulário de criação e a mensagem de lista vazia', () => {
        useCustomLists.mockReturnValue({ listas: [], criarLista: vi.fn(), removerLista: vi.fn() });
        render(
            <BrowserRouter>
                <CustomListView />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText(/Nome da lista/i)).toBeInTheDocument();
        expect(screen.getByText(/Você ainda não criou nenhuma lista/i)).toBeInTheDocument();
    });

    it('deve exibir as listas cadastradas', () => {
        useCustomLists.mockReturnValue({
            listas: [
                { id: '1', titulo: 'Ficção Científica', descricao: 'Livros no espaço', livros: [] }
            ],
            criarLista: vi.fn(),
            removerLista: vi.fn()
        });
        render(
            <BrowserRouter>
                <CustomListView />
            </BrowserRouter>
        );
        expect(screen.getByText('Ficção Científica')).toBeInTheDocument();
        expect(screen.getByText('Livros no espaço')).toBeInTheDocument();
    });

    it('deve chamar a função criarLista ao enviar o formulário', () => {
        const mockCriarLista = vi.fn();
        useCustomLists.mockReturnValue({
            listas: [],
            criarLista: mockCriarLista,
            removerLista: vi.fn()
        });
        render(
            <BrowserRouter>
                <CustomListView />
            </BrowserRouter>
        );
        const inputNome = screen.getByPlaceholderText(/Nome da lista/i);
        const inputDescricao = screen.getByPlaceholderText(/Descrição/i);
        const botaoCriar = screen.getByRole('button', { name: /Criar Lista/i });
        
        fireEvent.change(inputNome, { target: { value: 'Fantasia' } });
        fireEvent.change(inputDescricao, { target: { value: 'Dragões e magia' } });
        fireEvent.click(botaoCriar);
        
        expect(mockCriarLista).toHaveBeenCalledWith('Fantasia', 'Dragões e magia');
    });
});