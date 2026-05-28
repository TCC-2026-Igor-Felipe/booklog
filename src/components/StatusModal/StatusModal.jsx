import { useState, useEffect } from 'react';

export default function StatusModal({ livro, isOpen, onClose, onSave, onDelete }) {
    const [status, setStatus] = useState('QUERO_LER');

    useEffect(() => {
        if (livro?.statusLeitura) {
            setStatus(livro.statusLeitura);
        } else {
            setStatus('QUERO_LER');
        }
    }, [livro, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(status);
        onClose();
    };

    const handleDecreaseOrDelete = () => {
        if (onDelete) {
            onDelete();
        }
        onClose();
    };

    const estaNaEstante = Boolean(livro?.statusLeitura);

    return (
        <div className="modal-overlay" style={{ border: '1px solid black', padding: '20px', margin: '10px 0', backgroundColor: '#f9f9f9' }}>
            <div className="modal-content">
                <h3>Atualizar Estante</h3>
                <p>Livro: <strong>{livro?.titulo}</strong></p>

                <div>
                    <label htmlFor="status-select">Status de Leitura: </label>
                    <select
                        id="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="QUERO_LER">Quero Ler</option>
                        <option value="LENDO">Lendo</option>
                        <option value="LIDO">Lido</option>
                        <option value="ABANDONADO">Abandonado</option>
                    </select>
                </div>

                <div className="modal-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSave}>Salvar</button>

                    {estaNaEstante && (
                        <button
                            onClick={handleDecreaseOrDelete}
                            style={{ marginLeft: 'auto', cursor: 'pointer', backgroundColor: '#ffcccc' }}
                            title="Excluir da estante"
                        >
                            🗑
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}