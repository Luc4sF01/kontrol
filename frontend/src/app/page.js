'use client'

import { useState, useEffect, useCallback } from 'react'
// Header removido!
import StatCard from '../components/StatCard'
import ExpenseList from '../components/ExpenseList'
import TransactionForm from '../components/TransactionForm'
import ExpenseChart from '../components/ExpenseChart'
import EvolutionChart from '../components/EvolutionChart'

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allTransactions, setAllTransactions] = useState([])
  const [filteredData, setFilteredData] = useState({
    saldo: 0, renda: 0, totalGasto: 0, porCategoria: {}, transactions: []
  })
  const [showModal, setShowModal] = useState(false)
  
  const fetchAllData = useCallback(async () => {
    try {
      const [resExpenses, resIncomes] = await Promise.all([
        fetch('http://localhost:3333/expenses'),
        fetch('http://localhost:3333/income')
      ])
      const expenses = await resExpenses.json()
      const incomes = await resIncomes.json()
      const incomesArray = Array.isArray(incomes) ? incomes : [incomes]

      const formattedExpenses = expenses.map(e => ({
        ...e, type: 'expense', dateObj: new Date(e.createdAt)
      }))
      const formattedIncomes = incomesArray.filter(i => i && i.valor).map(i => ({
          _id: i._id, descricao: i.descricao || 'Entrada Mensal', categoria: 'Renda',
          valor: i.valor, type: 'income', dateObj: new Date(i.ano, i.mes - 1, 1) 
        }))
      setAllTransactions([...formattedExpenses, ...formattedIncomes])
    } catch (error) { console.error("Erro ao buscar dados:", error) }
  }, [])

  useEffect(() => { fetchAllData() }, [fetchAllData])

  useEffect(() => {
    const mesAtual = currentDate.getMonth()
    const anoAtual = currentDate.getFullYear()
    const filtrados = allTransactions.filter(item => {
      return item.dateObj.getMonth() === mesAtual && item.dateObj.getFullYear() === anoAtual
    })
    filtrados.sort((a, b) => b.dateObj - a.dateObj)

    let totalRenda = 0, totalGasto = 0, categorias = {}
    filtrados.forEach(item => {
      if (item.type === 'income') { totalRenda += item.valor } 
      else {
        totalGasto += item.valor
        if (!categorias[item.categoria]) categorias[item.categoria] = 0
        categorias[item.categoria] += item.valor
      }
    })
    setFilteredData({
      saldo: totalRenda - totalGasto, renda: totalRenda,
      totalGasto: totalGasto, porCategoria: categorias, transactions: filtrados
    })
  }, [currentDate, allTransactions])

  const nextMonth = () => { const novaData = new Date(currentDate); novaData.setMonth(novaData.getMonth() + 1); setCurrentDate(novaData) }
  const prevMonth = () => { const novaData = new Date(currentDate); novaData.setMonth(novaData.getMonth() - 1); setCurrentDate(novaData) }
  const formatMonthTitle = (date) => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date)
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)

  return (
    <main className="main-container">
      {/* Sem Header aqui! */}

      {/* 1. Seletor de Mês Centralizado */}
      <div className="month-selector">
        <button onClick={prevMonth} className="btn-nav">‹</button>
        <span>{formatMonthTitle(currentDate)}</span>
        <button onClick={nextMonth} className="btn-nav">›</button>
      </div>

      {/* 2. HERO CARD: SALDO GIGANTE (Vidro) */}
      <section className="glass-panel hero-card">
        <div className="hero-label">Saldo Atual</div>
        <div className="hero-value" style={{ color: filteredData.saldo >= 0 ? 'var(--text-primary)' : 'var(--color-expense)' }}>
          {formatMoney(filteredData.saldo)}
        </div>
      </section>

      {/* 3. GRID SECUNDÁRIO: Entradas e Saídas (Vidro) */}
      <div className="secondary-grid">
        <div className="glass-panel card-glass">
          <div className="card-label">Entradas</div>
          <div className="card-value" style={{color: 'var(--color-income)'}}>{formatMoney(filteredData.renda)}</div>
        </div>
        <div className="glass-panel card-glass">
          <div className="card-label">Saídas</div>
          <div className="card-value" style={{color: 'var(--color-expense)'}}>{formatMoney(filteredData.totalGasto)}</div>
        </div>
      </div>

      {/* 4. GRID DE GRÁFICOS (Vidro) */}
      <div className="charts-grid">
        <section className="glass-panel chart-container-glass">
          <ExpenseChart data={filteredData.porCategoria} />
        </section>
        <section className="glass-panel chart-container-glass">
          <EvolutionChart transactions={allTransactions} currentDate={currentDate} />
        </section>
      </div>

      {/* 5. Lista de Transações */}
      <ExpenseList transactions={filteredData.transactions} onTransactionChange={fetchAllData} />
      
      {/* Botão Flutuante */}
      <button className="fab-add-button" onClick={() => setShowModal(true)} aria-label="Novo Registro">+</button>

      {showModal && (
        <TransactionForm onClose={() => setShowModal(false)} onSuccess={fetchAllData} />
      )}
    </main>
  )
}