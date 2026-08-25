import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CustomListView from './CustomListView';
import useCustomLists from '../../hooks/useCustomLists/useCustomLists';

vi.mock('../../hooks/useCustomLists/useCustomLists');

describe('View: CustomListView', () => {
    const mockCriarLista = vi.fn();
    const mockRemoverLista = vi.fn();
    
    const setupMocks = (listas = []) => {
        useCustomLists.mockReturnValue({
            listas,
            criarLista: mockCriarLista,
            removerLista: mockRemoverLista
        });
    };

    const renderView = () => render(
        <BrowserRouter>
            <CustomListView />
        </BrowserRouter>
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar o formulário de criação e a mensagem de lista vazia', () => {
        setupMocks([]);
        renderView();
        
        expect(screen.getByPlaceholderText(/Nome da lista/i)).toBeInTheDocument();
        expect(screen.getByText(/Você ainda não criou nenhuma lista/i)).toBeInTheDocument();
    });

    it('deve exibir as listas cadastradas', () => {
        setupMocks([{ id: '1', titulo: 'Ficção Científica', descricao: 'Livros no espaço', livros: [] }]);
        renderView();
        
        expect(screen.getByText('Ficção Científica')).toBeInTheDocument();
        expect(screen.getByText('Livros no espaço')).toBeInTheDocument();
    });

    it('deve chamar a função criarLista ao enviar o formulário', () => {
        setupMocks([]);
        renderView();
        
        fireEvent.change(screen.getByPlaceholderText(/Nome da lista/i), { target: { value: 'Fantasia' } });
        fireEvent.change(screen.getByPlaceholderText(/Descrição/i), { target: { value: 'Dragões e magia' } });
        fireEvent.click(screen.getByRole('button', { name: /Criar Lista/i }));
        
        expect(mockCriarLista).toHaveBeenCalledWith('Fantasia', 'Dragões e magia');
    });

    it('não deve criar uma lista se o título estiver vazio ou contiver apenas espaços', () => {
        setupMocks([]);
        renderView();

        fireEvent.change(screen.getByPlaceholderText(/Nome da lista/i), { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: /Criar Lista/i }));

        expect(mockCriarLista).not.toHaveBeenCalled();
    });

    it('deve exibir a quantidade de obras caso a lista possua livros', () => {
        setupMocks([{ id: '1', titulo: 'Ficção', descricao: '', livros: [{ titulo: 'Duna' }] }]);
        renderView();
        
        expect(screen.getByText('1 obra(s) nesta lista.')).toBeInTheDocument();
    });

    it('deve renderizar a mensagem de lista vazia caso a lista seja malformada (sem a propriedade livros)', () => {
        setupMocks([{ id: '99', titulo: 'Lista Quebrada', descricao: '' }]); // Faltando array de livros
        renderView();
        
        expect(screen.getByText('Nenhum livro adicionado ainda.')).toBeInTheDocument();
    });

    it('deve chamar a função removerLista ao clicar no botão de excluir', () => {
        setupMocks([{ id: '99', titulo: 'Lista Temporária', descricao: '', livros: [] }]);
        renderView();
        
        fireEvent.click(screen.getByTitle('Excluir lista'));
        
        expect(mockRemoverLista).toHaveBeenCalledWith('99');
    });
});