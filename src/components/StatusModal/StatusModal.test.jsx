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

    // Clica na metade da quinta estrela (nota 4.5)
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