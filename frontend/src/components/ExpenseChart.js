'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Cores profissionais para cada categoria
const COLORS = {
  'Alimentação': '#E63946', // Vermelho suave
  'Moradia': '#457B9D',     // Azul
  'Transporte': '#1D3557',  // Azul escuro
  'Lazer': '#F4A261',       // Laranja
  'Saúde': '#2A9D8F',       // Verde água
  'Outros': '#6C757D'       // Cinza
}

export default function ExpenseChart({ data }) {
  // Transforma o objeto { "Alimentação": 100 } em array [{ name: "Alimentação", value: 100 }]
  const chartData = Object.keys(data || {}).map(key => ({
    name: key,
    value: data[key]
  })).filter(item => item.value > 0) // Só mostra o que tem valor > 0

  if (chartData.length === 0) {
    return (
      <div className="chart-container empty">
        <p>Sem dados para gráfico</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Gastos por Categoria</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Faz virar uma rosca (buraco no meio)
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#000'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}