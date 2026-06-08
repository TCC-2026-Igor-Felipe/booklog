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
    expect(screen.getByRole('combobox')).toBeInTheDocument();
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

  it('deve aplicar as propriedades CSS estruturais corretas no overlay do modal', () => {
    render(<StatusModal livro={mockLivro} isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    
    const overlay = document.querySelector('.modal-overlay');
    
    const estilosComputados = window.getComputedStyle(overlay);

    expect(estilosComputados.position).toBe('fixed');
    expect(estilosComputados.display).toBe('flex');
    expect(estilosComputados.zIndex).toBe('1000');
  });
});