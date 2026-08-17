import { useState } from 'react';

export default function useShelf() {
    const [estante, setEstante] = useState(() => {
        const estanteSalva = window.localStorage.getItem('booklog_estante');
        return estanteSalva ? JSON.parse(estanteSalva) : [];
    });

    const adicionarLivro = (livro, dadosAtualizacao) => {
        setEstante((estanteAnterior) => {
            const indexLivroExistente = estanteAnterior.findIndex(
                (item) => item.titulo === livro.titulo
            );

            let novaEstante;

            if (indexLivroExistente >= 0) {
                novaEstante = [...estanteAnterior];
                novaEstante[indexLivroExistente] = {
                    ...novaEstante[indexLivroExistente],
                    ...dadosAtualizacao,
                };
            } else {
                const novoLivroComStatus = { ...livro, ...dadosAtualizacao };
                novaEstante = [...estanteAnterior, novoLivroComStatus];
            }

            window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));
            return novaEstante;
        });
    };

    const removerLivro = (titulo) => {
        setEstante((estanteAnterior) => {
            const novaEstante = estanteAnterior.filter((item) => item.titulo !== titulo);
            window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));
            return novaEstante;
        });
    };

    const alternarFavorito = (titulo) => {
        setEstante((estanteAnterior) => {
            const novaEstante = estanteAnterior.map((item) => {
                if (item.titulo === titulo) {
                    return { ...item, favorito: !item.favorito };
                }
                return item;
            });
            window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));
            return novaEstante;
        });
    };

    return {
        estante,
        adicionarLivro,
        removerLivro,
        alternarFavorito
    };
}