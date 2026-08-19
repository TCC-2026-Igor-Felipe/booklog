import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import StatusModal from './StatusModal';
import fs from 'fs';
import path from 'path';

describe('Componente: StatusModal', () => {
  const mockLivro = { titulo: 'O Hobbit', statusLeitura: '' };

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, './StatusModal.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssContent;
    document.head.appendChild(styleElement);
  });

  it('não deve renderizar nada se a propriedade isOpen for false', () => {
    render(<StatusModal livro={mockLivro} isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByText(/O Hobbit/i)).not.toBeInTheDocument();
  });

  it('deve renderizar o conteúdo corretamente quando isOpen for true', () => {
    render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText(/O Hobbit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('deve aplicar as propriedades CSS estruturais corretas no overlay do modal', () => {
    render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    const overlay = document.querySelector('.modal-overlay');
    const estilosComputados = window.getComputedStyle(overlay);
    expect(estilosComputados.position).toBe('fixed');
  });

  it('deve exibir o componente de estrelas e a resenha apenas quando o status for "LIDO"', () => {
    render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    expect(screen.queryByText(/Avaliação:/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/resenha/i)).not.toBeInTheDocument();

    const selectStatus = screen.getByRole('combobox');
    fireEvent.change(selectStatus, { target: { value: 'LIDO' } });

    expect(screen.getByText(/Avaliação:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resenha/i)).toBeInTheDocument();
  });

  it('deve enviar a nota em estrelas e a resenha ao salvar um livro como LIDO', () => {
    const mockOnSave = vi.fn();
    render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={mockOnSave} />);

    const selectStatus = screen.getByRole('combobox');
    fireEvent.change(selectStatus, { target: { value: 'LIDO' } });

    const estrelaQuatroEMeia = screen.getByRole('button', { name: /4.5 estrelas/i });
    fireEvent.click(estrelaQuatroEMeia);

    const inputResenha = screen.getByLabelText(/resenha/i);
    fireEvent.change(inputResenha, { target: { value: 'Obra prima!' } });

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(botaoSalvar);

    expect(mockOnSave).toHaveBeenCalledWith({
      statusLeitura: 'LIDO',
      notaAvaliacao: 4.5,
      resenhaTextual: 'Obra prima!'
    });
  });

  it('deve exibir um seletor de listas e chamar onAddToList ao clicar em adicionar', () => {
    const mockOnAddToList = vi.fn();
    const mockListas = [{ id: '1', titulo: 'Ficção Científica' }];

    render(
      <StatusModal
        livro={mockLivro}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        listas={mockListas}
        onAddToList={mockOnAddToList}
      />
    );

    const selectListas = screen.getByLabelText(/Adicionar à Lista:/i);
    fireEvent.change(selectListas, { target: { value: '1' } });

    const botaoAddLista = screen.getByRole('button', { name: /➕/i });
    fireEvent.click(botaoAddLista);

    expect(mockOnAddToList).toHaveBeenCalledWith('1');
  });
});