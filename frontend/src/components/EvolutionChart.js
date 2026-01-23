'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function EvolutionChart({ transactions, currentDate }) {
  
  // Lista manual para evitar erros de navegador
  const MONTH_NAMES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  // 1. Gera os 6 meses terminando no mês selecionado
  const getChartRange = () => {
    const months = []
    const baseDate = currentDate ? new Date(currentDate) : new Date()
    
    // Loop para pegar o mês atual e os 5 anteriores
    for (let i = 5; i >= 0; i--) {
      // Clona a data para não alterar a original
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1)
      
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` // Ex: "2026-02"
      const label = MONTH_NAMES[d.getMonth()] // Ex: "FEV"
      
      months.push({
        key,
        name: label,
        Receitas: 0,
        Despesas: 0
      })
    }
    return months
  }

  // 2. Preenche os dados
  const processData = () => {
    const skeleton = getChartRange()

    if (!transactions || transactions.length === 0) return skeleton

    transactions.forEach(item => {
      const date = new Date(item.dateObj || item.date || item.createdAt)
      // Ajuste para garantir fuso horário correto
      // Cria a chave baseada no ano e mês real do objeto Date
      const itemKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      const monthSlot = skeleton.find(m => m.key === itemKey)

      if (monthSlot) {
        if (item.type === 'income') {
          monthSlot.Receitas += item.valor
        } else {
          monthSlot.Despesas += item.valor
        }
      }
    })

    return skeleton
  }

  const data = processData()

  return (
    <div className="chart-container">
      <h3 className="chart-title">Evolução Semestral</h3>
      
      {/* CORREÇÃO AQUI: Altura fixa em pixels para não sumir */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#999', fontSize: 12, fontWeight: 600 }} 
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#999', fontSize: 12 }} 
              tickFormatter={(value) => `R$${value/1000}k`} 
            />
            
            <Tooltip 
              cursor={{ fill: '#F5F5F5' }}
              contentStyle={{ 
                borderRadius: '0px', 
                border: '1px solid #EAEAEA', 
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                fontFamily: 'var(--font-primary)'
              }}
              formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            
            <Legend 
              verticalAlign="top" 
              height={40} 
              iconType="square"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}
            />
            
            {/* Barras Minimalistas (Preto e Cinza) */}
            <Bar 
              dataKey="Receitas" 
              fill="#111111"  
              radius={[0, 0, 0, 0]} 
              maxBarSize={60} 
            />
            <Bar 
              dataKey="Despesas" 
              fill="#BBBBBB" 
              radius={[0, 0, 0, 0]} 
              maxBarSize={60} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}