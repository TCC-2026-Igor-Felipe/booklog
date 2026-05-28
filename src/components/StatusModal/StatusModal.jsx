import { useState } from 'react';

export default function StatusModal({ livro, isOpen, onClose, onSave }) {
    const [status, setStatus] = useState(livro?.statusLeitura || 'QUERO_LER');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(status);
        onClose();
    };

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

                <div className="modal-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSave}>Salvar</button>
                </div>
            </div>
        </div>
    );
}