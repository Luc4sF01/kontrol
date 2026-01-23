'use client'
import { useState } from 'react'

export default function TransactionForm({ onClose, onSuccess }) {
  const [type, setType] = useState('expense')
  const [formData, setFormData] = useState({
    valor: '', descricao: '', categoria: 'Outros', data: new Date().toISOString().split('T')[0]
  })

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valorNumber = parseFloat(formData.valor.toString().replace(',', '.'))
    if (!valorNumber) return alert('Digite um valor válido')

    try {
      let url, body;
      if (type === 'expense') {
        url = 'http://localhost:3333/expenses'
        body = {
          valor: valorNumber, descricao: formData.descricao, categoria: formData.categoria, createdAt: formData.data
        }
      } else {
        const [ano, mes, dia] = formData.data.split('-')
        url = 'http://localhost:3333/income'
        body = {
          valor: valorNumber, mes: parseInt(mes), ano: parseInt(ano), descricao: formData.descricao || 'Entrada'
        }
      }
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (response.ok) { onSuccess(); onClose() } else { const err = await response.json(); alert(err.message || 'Erro ao salvar') }
    } catch (error) { console.error(error); alert('Erro de conexão') }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* Usa a nova classe de conteúdo de vidro */}
      <div className="modal-content-glass" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="btn-close-modal">✕</button>
        <h3 className="modal-title">Novo Registro</h3>

        {/* Toggle Glass Colorido */}
        <div className="type-toggle-glass">
          <button 
            className={`toggle-btn-glass ${type === 'expense' ? 'active-glass-expense' : ''}`} 
            onClick={() => setType('expense')}
          >
            Saída
          </button>
          <button 
            className={`toggle-btn-glass ${type === 'income' ? 'active-glass-income' : ''}`} 
            onClick={() => setType('income')}
          >
            Entrada
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input de Valor Gigante Glass */}
          <div className="input-glass-group">
            <input 
              type="number" step="0.01" required className="input-glass"
              value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} 
              placeholder="R$ 0,00"
              style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', color: type === 'expense' ? 'var(--color-expense)' : 'var(--color-income)' }}
            />
          </div>

          <div className="input-glass-group">
            <label className="input-glass-label">Data</label>
            <input type="date" required className="input-glass"
              value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})}
            />
          </div>

          <div className="input-glass-group">
            <label className="input-glass-label">Descrição</label>
            <input type="text" required className="input-glass"
              value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}
              placeholder="Ex: Mercado, Salário..."
            />
          </div>

          {type === 'expense' && (
            <div className="input-glass-group">
              <label className="input-glass-label">Categoria</label>
              <select className="input-glass" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                <option>Alimentação</option><option>Moradia</option><option>Transporte</option><option>Lazer</option><option>Saúde</option><option>Outros</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-submit-glass" style={{background: type === 'expense' ? 'var(--color-expense)' : 'var(--color-income)'}}>
            Confirmar
          </button>
        </form>
      </div>
    </div>
  )
}