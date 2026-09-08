import { useState, useEffect } from 'react';

export default function useShelf() {
    const [estante, setEstante] = useState(() => {
        const estanteSalva = window.localStorage.getItem('booklog_estante');
        return estanteSalva ? JSON.parse(estanteSalva) : [];
    });

    const adicionarLivro = (livro, dadosAtualizacao) => {
        const estanteAtual = JSON.parse(window.localStorage.getItem('booklog_estante') || '[]');
        const indexLivroExistente = estanteAtual.findIndex((item) => item.titulo === livro.titulo);

        if (indexLivroExistente >= 0) {
            estanteAtual[indexLivroExistente] = {
                ...estanteAtual[indexLivroExistente],
                ...dadosAtualizacao,
            };
        } else {
            const novoLivroComStatus = { ...livro, ...dadosAtualizacao };
            estanteAtual.push(novoLivroComStatus);
        }

        window.localStorage.setItem('booklog_estante', JSON.stringify(estanteAtual));
        setEstante(estanteAtual);
        window.dispatchEvent(new Event('booklog_estante_atualizada'));
    };

    const removerLivro = (titulo) => {
        const estanteAtual = JSON.parse(window.localStorage.getItem('booklog_estante') || '[]');
        const novaEstante = estanteAtual.filter((item) => item.titulo !== titulo);

        window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));
        setEstante(novaEstante);
        window.dispatchEvent(new Event('booklog_estante_atualizada'));
    };

    const alternarFavorito = (titulo) => {
        const estanteAtual = JSON.parse(window.localStorage.getItem('booklog_estante') || '[]');
        const livroAlvo = estanteAtual.find((item) => item.titulo === titulo);

        if (!livroAlvo) return;

        if (!livroAlvo.favorito) {
            const totalFavoritos = estanteAtual.filter((item) => item.favorito).length;
            if (totalFavoritos >= 5) {
                window.alert('Você pode ter no máximo 5 livros favoritos.');
                return;
            }
        }

        const novaEstante = estanteAtual.map((item) => {
            if (item.titulo === titulo) {
                return { ...item, favorito: !item.favorito };
            }
            return item;
        });

        window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));
        setEstante(novaEstante);
        window.dispatchEvent(new Event('booklog_estante_atualizada'));
    };

    useEffect(() => {
        const sincronizarEstante = () => {
            const estanteSalva = window.localStorage.getItem('booklog_estante');
            setEstante(estanteSalva ? JSON.parse(estanteSalva) : []);
        };

        window.addEventListener('booklog_estante_atualizada', sincronizarEstante);
        return () => window.removeEventListener('booklog_estante_atualizada', sincronizarEstante);
    }, []);

    return {
        estante,
        adicionarLivro,
        removerLivro,
        alternarFavorito
    };
}