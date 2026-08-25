import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import StatusModal from './StatusModal';
import fs from 'fs';
import path from 'path';

describe('Componente: StatusModal', () => {
  const mockLivroPadrao = { titulo: 'O Hobbit', statusLeitura: '' };
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnAddToList = vi.fn();

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, './StatusModal.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssContent;
    document.head.appendChild(styleElement);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderModal = (propsCustomizadas = {}) => {
    const propsPadrao = {
      livro: mockLivroPadrao,
      isOpen: true,
      onClose: mockOnClose,
      onSave: mockOnSave,
      ...propsCustomizadas
    };
    return render(<StatusModal {...propsPadrao} />);
  };

  it('não deve renderizar nada se a propriedade isOpen for false', () => {
    renderModal({ isOpen: false }); 
    expect(screen.queryByText(/O Hobbit/i)).not.toBeInTheDocument();
  });

  it('deve renderizar o conteúdo corretamente quando isOpen for true', () => {
    renderModal();
    expect(screen.getByText(/O Hobbit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('deve aplicar as propriedades CSS estruturais corretas no overlay do modal', () => {
    renderModal();
    const overlay = document.querySelector('.modal-overlay');
    expect(window.getComputedStyle(overlay).position).toBe('fixed');
  });

  it('deve exibir o componente de estrelas e a resenha apenas quando o status for "LIDO"', () => {
    renderModal();
    expect(screen.queryByText(/Avaliação:/i)).not.toBeInTheDocument();
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'LIDO' } });
    
    expect(screen.getByText(/Avaliação:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resenha/i)).toBeInTheDocument();
  });

  it('deve enviar a nota em estrelas e a resenha ao salvar um livro como LIDO', () => {
    renderModal();
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'LIDO' } });
    fireEvent.click(screen.getByRole('button', { name: /4.5 estrelas/i }));
    fireEvent.change(screen.getByLabelText(/resenha/i), { target: { value: 'Obra prima!' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    
    expect(mockOnSave).toHaveBeenCalledWith({
      statusLeitura: 'LIDO',
      notaAvaliacao: 4.5,
      resenhaTextual: 'Obra prima!'
    });
  });

  it('deve exibir um seletor de listas e chamar onAddToList ao clicar em adicionar', () => {
    renderModal({ 
      listas: [{ id: '1', titulo: 'Ficção Científica' }], 
      onAddToList: mockOnAddToList 
    });
    
    fireEvent.change(screen.getByLabelText(/Adicionar à Lista:/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    
    expect(mockOnAddToList).toHaveBeenCalledWith('1');
  });

  it('deve fechar o modal mesmo se as funções opcionais (onDelete e onAddToList) não forem passadas', () => {
    renderModal({ livro: { titulo: '1984', statusLeitura: 'LIDO' } });
    
    fireEvent.click(screen.getByTitle('Excluir da estante'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('não deve fazer nada se o botão "+" for clicado com o select de listas vazio', () => {
    renderModal({ listas: [{ id: '1', titulo: 'Lista' }] });
    expect(() => fireEvent.click(screen.getByRole('button', { name: '+' }))).not.toThrow();
  });
});