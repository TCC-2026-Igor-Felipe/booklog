import { useState } from 'react';

export default function useShelf() {
    const [estante, setEstante] = useState(() => {
        const estanteSalva = window.localStorage.getItem('booklog_estante');
        return estanteSalva ? JSON.parse(estanteSalva) : [];
    });

    const adicionarLivro = (livro, statusLeitura) => {
        setEstante((estanteAnterior) => {
            const indexLivroExistente = estanteAnterior.findIndex(
                (item) => item.titulo === livro.titulo
            );

            let novaEstante;
            if (indexLivroExistente >= 0) {
                novaEstante = [...estanteAnterior];
                novaEstante[indexLivroExistente] = {
                    ...novaEstante[indexLivroExistente],
                    statusLeitura,
                };
            } else {
                const novoLivroComStatus = { ...livro, statusLeitura };
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

    return {
        estante,
        adicionarLivro,
        removerLivro
    };
}