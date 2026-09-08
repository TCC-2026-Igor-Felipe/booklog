import { useState, useEffect } from 'react';

export default function useCustomLists() {
    const [listas, setListas] = useState(() => {
        const listasSalvas = window.localStorage.getItem('booklog_listas');
        return listasSalvas ? JSON.parse(listasSalvas) : [];
    });

    const obterListasAtuais = () => {
        return JSON.parse(window.localStorage.getItem('booklog_listas') || '[]');
    };

    const salvarListas = (novasListas) => {
        window.localStorage.setItem('booklog_listas', JSON.stringify(novasListas));
        setListas(novasListas);
        window.dispatchEvent(new Event('booklog_listas_atualizadas'));
    };

    const criarLista = (titulo, descricao) => {
        const listasAtuais = obterListasAtuais();
        const novaLista = {
            id: Date.now().toString(),
            titulo,
            descricao,
            livros: []
        };
        salvarListas([...listasAtuais, novaLista]);
    };

    const adicionarLivroNaLista = (idLista, livro) => {
        const listasAtuais = obterListasAtuais();
        const novasListas = listasAtuais.map((lista) => {
            if (lista.id === idLista) {
                const jaExiste = lista.livros.find((l) => l.titulo === livro.titulo);
                if (jaExiste) return lista;
                return { ...lista, livros: [...lista.livros, livro] };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    const removerLivroDaLista = (idLista, tituloLivro) => {
        const listasAtuais = obterListasAtuais();
        const novasListas = listasAtuais.map((lista) => {
            if (lista.id === idLista) {
                return {
                    ...lista,
                    livros: lista.livros.filter((l) => l.titulo !== tituloLivro)
                };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    const removerLista = (idLista) => {
        const listasAtuais = obterListasAtuais();
        const novasListas = listasAtuais.filter((lista) => lista.id !== idLista);
        salvarListas(novasListas);
    };

    const atualizarLivrosDaLista = (idLista, novosLivros) => {
        const listasAtuais = obterListasAtuais();
        const novasListas = listasAtuais.map((lista) => {
            if (lista.id === idLista) {
                return { ...lista, livros: novosLivros };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    useEffect(() => {
        const sincronizarListas = () => {
            const listasSalvas = window.localStorage.getItem('booklog_listas');
            setListas(listasSalvas ? JSON.parse(listasSalvas) : []);
        };

        window.addEventListener('booklog_listas_atualizadas', sincronizarListas);
        return () => window.removeEventListener('booklog_listas_atualizadas', sincronizarListas);
    }, []);

    return {
        listas,
        criarLista,
        adicionarLivroNaLista,
        removerLivroDaLista,
        removerLista,
        atualizarLivrosDaLista,
    };
}