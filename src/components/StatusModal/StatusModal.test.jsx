import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusModal from './StatusModal';

describe('Componente: StatusModal', () => {
    const mockLivro = { titulo: 'O Hobbit', statusLeitura: '' };

    it('não deve renderizar nada se a propriedade isOpen for false', () => {
        render(<StatusModal livro={mockLivro} isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
        expect(screen.queryByText(/O Hobbit/i)).not.toBeInTheDocument();
    });

    it('deve renderizar o conteúdo corretamente quando isOpen for true', () => {
        render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

        expect(screen.getByText(/O Hobbit/i)).toBeInTheDocument();

        expect(screen.getByRole('combobox')).toBeInTheDocument(); // O <select>
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('deve chamar a função onSave com o status escolhido e fechar o modal', () => {
        const mockOnSave = vi.fn();
        const mockOnClose = vi.fn();

        render(<StatusModal livro={mockLivro} isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

        const selectStatus = screen.getByRole('combobox');
        fireEvent.change(selectStatus, { target: { value: 'LENDO' } });

        const botaoSalvar = screen.getByRole('button', { name: /salvar/i });
        fireEvent.click(botaoSalvar);

        expect(mockOnSave).toHaveBeenCalledWith('LENDO');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('deve exibir o botão de excluir e chamar onDelete se o livro já estiver na estante', () => {
        const mockOnDelete = vi.fn();
        const livroSalvo = { titulo: '1984', statusLeitura: 'LENDO' };

        render(
            <StatusModal
                livro={livroSalvo}
                isOpen={true}
                onClose={vi.fn()}
                onSave={vi.fn()}
                onDelete={mockOnDelete}
            />
        );

        const botaoExcluir = screen.getByRole('button', { name: '🗑' });
        expect(botaoExcluir).toBeInTheDocument();

        fireEvent.click(botaoExcluir);
        expect(mockOnDelete).toHaveBeenCalled();
    });
});