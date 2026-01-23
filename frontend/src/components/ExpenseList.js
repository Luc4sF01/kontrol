'use client'

import { useState } from 'react'

export default function ExpenseList({ transactions, onTransactionChange }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ descricao: '', valor: '', categoria: '', data: '' })

  const handleDelete = async (id, type) => {
    if (!confirm('Excluir este item?')) return
    const endpoint = type === 'income' ? 'income' : 'expenses'
    try {
      const response = await fetch(`http://localhost:3333/${endpoint}/${id}`, { method: 'DELETE' })
      if (response.ok && onTransactionChange) onTransactionChange()
    } catch (error) { console.error('Erro:', error) }
  }

  const startEditing = (item) => {
    setEditingId(item._id)
    const dateStr = item.dateObj ? new Date(item.dateObj).toISOString().split('T')[0] : '';
    setEditForm({ 
      descricao: item.descricao, 
      valor: item.valor, 
      categoria: item.categoria || 'Outros',
      data: dateStr
    })
  }

  const saveEdit = async (id, type) => {
    const endpoint = type === 'income' ? 'income' : 'expenses'
    const body = { ...editForm, createdAt: editForm.data }
    try {
      const res = await fetch(`http://localhost:3333/${endpoint}/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (res.ok) { setEditingId(null); if (onTransactionChange) onTransactionChange() }
    } catch (error) { console.error('Erro:', error) }
  }

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const getDay = (d) => new Date(d).getDate().toString().padStart(2, '0')
  const getMonth = (d) => new Date(d).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()

  return (
    <div className="expense-list-container">
      <h3 className="expense-list-title">Histórico</h3>
      
      {transactions.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', opacity: 0.6, padding: '2rem', fontStyle: 'italic' }}>
          Sem movimentos neste período.
        </div>
      ) : (
        <ul className="expense-list">
          {transactions.map((item) => (
            <li key={item._id} className="expense-item-glass">
              
              {editingId === item._id ? (
                // --- MODO EDIÇÃO RESPONSIVO ---
                <div className="edit-row-glass">
                   {/* Data */}
                   <div className="edit-field-group" style={{flex: '0 0 140px'}}>
                      <span className="edit-label-sm">Data</span>
                      <input type="date" className="input-edit-glass" value={editForm.data} onChange={e => setEditForm({...editForm, data: e.target.value})} />
                   </div>
                   {/* Descrição */}
                   <div className="edit-field-group" style={{flexGrow: 2}}>
                      <span className="edit-label-sm">Descrição</span>
                      <input className="input-edit-glass" value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} placeholder="Descrição" />
                   </div>
                   {/* Categoria */}
                   {item.type === 'expense' && (
                    <div className="edit-field-group">
                      <span className="edit-label-sm">Categoria</span>
                      <select className="input-edit-glass" value={editForm.categoria} onChange={e => setEditForm({...editForm, categoria: e.target.value})}>
                        <option>Alimentação</option><option>Moradia</option><option>Transporte</option><option>Lazer</option><option>Saúde</option><option>Outros</option>
                      </select>
                    </div>
                   )}
                   {/* Valor */}
                   <div className="edit-field-group" style={{flex: '0 0 100px'}}>
                      <span className="edit-label-sm">Valor</span>
                      <input type="number" className="input-edit-glass" value={editForm.valor} onChange={e => setEditForm({...editForm, valor: e.target.value})} />
                   </div>
                   {/* Botões Mobile Friendly */}
                   <div className="edit-actions-row">
                     <button onClick={() => saveEdit(item._id, item.type)} className="btn-save-sm">Salvar</button>
                     <button onClick={() => setEditingId(null)} className="btn-cancel-sm">Cancelar</button>
                   </div>
                </div>
              ) : (
                // --- MODO VISUALIZAÇÃO RESPONSIVO ---
                <>
                  <div className="expense-info">
                    <div className="expense-date-box">
                      <span className="date-day">{getDay(item.dateObj)}</span>
                      <span className="date-month">{getMonth(item.dateObj)}</span>
                    </div>
                    <div>
                      <span className="expense-category">{item.categoria}</span>
                      <span className="expense-desc">{item.descricao}</span>
                    </div>
                  </div>

                  {/* Wrapper para Valor e Botões ficarem alinhados no mobile */}
                  <div className="mobile-actions-wrapper">
                    <span 
                      className="expense-value" 
                      style={{ 
                        color: item.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)',
                        fontWeight: item.type === 'income' ? '800' : '600'
                      }}
                    >
                      {item.type === 'expense' ? '- ' : '+ '}{formatMoney(item.valor)}
                    </span>
                    
                    <div className="actions-buttons">
                      <button onClick={() => startEditing(item)} className="btn-icon" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(item._id, item.type)} className="btn-icon" title="Excluir">🗑️</button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}