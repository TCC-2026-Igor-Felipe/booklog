import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './NavigationBar';

describe('Componente: NavigationBar', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.className = '';
  });

  it('deve renderizar os links de navegação principais', () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );

    const linkPesquisa = screen.getByRole('link', { name: /pesquisa/i });
    const linkEstante = screen.getByRole('link', { name: /minha estante/i });
    const linkPerfil = screen.getByRole('link', { name: /perfil/i });

    expect(linkPesquisa).toBeInTheDocument();
    expect(linkPesquisa).toHaveAttribute('href', '/');
    expect(linkEstante).toBeInTheDocument();
    expect(linkEstante).toHaveAttribute('href', '/estante');
    expect(linkPerfil).toBeInTheDocument();
    expect(linkPerfil).toHaveAttribute('href', '/perfil');
  });

  it('deve iniciar no modo escuro por padrão e alternar para claro ao clicar', () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );

    const btnTema = screen.getByTitle(/alternar tema/i);

    expect(btnTema).toHaveTextContent('☀️');
    expect(document.body.classList.contains('light-mode')).toBe(false);
    expect(window.localStorage.getItem('booklog_theme')).toBe('dark');

    fireEvent.click(btnTema);

    expect(btnTema).toHaveTextContent('🌙');
    expect(document.body.classList.contains('light-mode')).toBe(true);
    expect(window.localStorage.getItem('booklog_theme')).toBe('light');
  });

  it('deve inicializar com o modo claro ativado se estiver salvo no localStorage', () => {
    window.localStorage.setItem('booklog_theme', 'light');
    
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );

    const btnTema = screen.getByTitle(/alternar tema/i);

    expect(btnTema).toHaveTextContent('🌙');
    expect(document.body.classList.contains('light-mode')).toBe(true);
  });
});