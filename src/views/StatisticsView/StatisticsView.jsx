import useShelf from '../../hooks/useShelf/useShelf';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './StatisticsView.css';

export default function StatisticsView() {
    const { estante } = useShelf();

    if (estante.length === 0) {
        return (
            <main className="statistics-view">
                <h2>Painel de Estatísticas</h2>
                <p className="mensagem-vazia">Nenhum dado para exibir. Adicione livros à sua estante!</p>
            </main>
        );
    }

    const concluidos = estante.filter((livro) => livro.statusLeitura === 'LIDO');
    const livrosComNota = estante.filter((livro) => livro.notaAvaliacao);
    const somaNotas = livrosComNota.reduce((acc, livro) => acc + livro.notaAvaliacao, 0);
    const mediaNotas = livrosComNota.length > 0 ? (somaNotas / livrosComNota.length).toFixed(1) : 'N/A';

    const autoresContagem = estante.reduce((acc, livro) => {
        if (livro.autor) acc[livro.autor] = (acc[livro.autor] || 0) + 1;
        return acc;
    }, {});
    const autorMaisLido = Object.keys(autoresContagem).length > 0
        ? Object.keys(autoresContagem).reduce((a, b) => autoresContagem[a] > autoresContagem[b] ? a : b)
        : 'N/A';

    const notasContagem = { '1 a 2': 0, '2.5 a 3.5': 0, '4 a 5': 0 };
    livrosComNota.forEach(livro => {
        const nota = livro.notaAvaliacao;
        if (nota <= 2) notasContagem['1 a 2']++;
        else if (nota <= 3.5) notasContagem['2.5 a 3.5']++;
        else notasContagem['4 a 5']++;
    });
    const dadosNotas = Object.keys(notasContagem).map(key => ({ name: key, quantidade: notasContagem[key] }));

    const decadasMap = estante.reduce((acc, livro) => {
        if (livro.ano) {
            const decada = Math.floor(livro.ano / 10) * 10;
            acc[decada] = (acc[decada] || 0) + 1;
        }
        return acc;
    }, {});

    const dadosDecadas = Object.keys(decadasMap)
        .sort((a, b) => Number(a) - Number(b))
        .map(decadaNum => {
            const decada = Number(decadaNum);
            const label = decada >= 2000 ? `Anos ${decada}` : `Anos ${decada.toString().slice(-2)}`;
            return { name: label, quantidade: decadasMap[decadaNum] };
        });

    const generosContagem = estante.reduce((acc, livro) => {
        const genero = livro.genero || 'Outros';
        acc[genero] = (acc[genero] || 0) + 1;
        return acc;
    }, {});
    const dadosGeneros = Object.keys(generosContagem).map(key => ({ name: key, value: generosContagem[key] }));
    const CORES_PIZZA = ['#00b0fa', '#ff4040', '#00e676', '#ffb400', '#9c27b0'];

    const statusContagem = estante.reduce((acc, livro) => {
        const status = livro.statusLeitura;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { QUERO_LER: 0, LENDO: 0, LIDO: 0, ABANDONADO: 0 });
    const dadosStatus = [
        { name: 'Quero Ler', quantidade: statusContagem.QUERO_LER },
        { name: 'Lendo', quantidade: statusContagem.LENDO },
        { name: 'Lido', quantidade: statusContagem.LIDO },
        { name: 'Abandonado', quantidade: statusContagem.ABANDONADO },
    ];

    const livrosResenhados = estante.filter(l => l.statusLeitura === 'LIDO' && l.resenhaTextual);
    const diarioRecente = livrosResenhados.length > 0 ? livrosResenhados[livrosResenhados.length - 1] : null;

    return (
        <main className="statistics-view">
            <h2>Painel de Estatísticas</h2>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h4>Total na Estante: {estante.length}</h4>
                </div>
                <div className="metric-card">
                    <h4>Concluídos: {concluidos.length}</h4>
                </div>
                <div className="metric-card">
                    <h4>Média de Notas: {mediaNotas}</h4>
                </div>
                <div className="metric-card destaque">
                    <h4>Autor Mais Lido: <br /><span>{autorMaisLido}</span></h4>
                </div>
            </div>

            {diarioRecente && (
                <section className="diario-recente-container">
                    <h3>Diário Recente</h3>
                    <div className="diario-card">
                        <img src={diarioRecente.capaUrl} alt={`Capa de ${diarioRecente.titulo}`} />
                        <div className="diario-info">
                            <h4>
                                {diarioRecente.titulo}
                                <span style={{ color: '#ffb400', fontSize: '16px', marginLeft: '10px' }}>
                                    {'★'.repeat(Math.floor(diarioRecente.notaAvaliacao))}
                                    {diarioRecente.notaAvaliacao % 1 !== 0 ? '⯨' : ''}
                                </span>
                            </h4>
                            <p className="diario-autor">{diarioRecente.autor}</p>
                            <blockquote className="diario-resenha">"{diarioRecente.resenhaTextual}"</blockquote>
                        </div>
                    </div>
                </section>
            )}

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Status de Leitura</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosStatus}>
                            <XAxis dataKey="name" stroke="#8c9baf" />
                            <YAxis stroke="#8c9baf" allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#212830', borderColor: '#2c3440' }} />
                            <Bar dataKey="quantidade" fill="#00b0fa" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Distribuição de Notas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosNotas}>
                            <XAxis dataKey="name" stroke="#8c9baf" />
                            <YAxis stroke="#8c9baf" allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#212830', borderColor: '#2c3440' }} />
                            <Bar dataKey="quantidade" fill="#ffb400" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Perfil Temporal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosDecadas}>
                            <XAxis
                                dataKey="name"
                                stroke="#8c9baf"
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="#8c9baf" allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#212830', borderColor: '#2c3440' }} />
                            <Bar dataKey="quantidade" fill="#00e676" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Distribuição por Gênero</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dadosGeneros} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {dadosGeneros.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#212830', borderColor: '#2c3440' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </main>
    );
}