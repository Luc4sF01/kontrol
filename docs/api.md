# API – Kontrol

## Autenticação
POST /auth/register
POST /auth/login

## Renda
POST /income
GET /income?month=&year=

## Gastos
POST /expenses
GET /expenses?month=&year=
DELETE /expenses/:id

## Dashboard
GET /dashboard?month=&year=
