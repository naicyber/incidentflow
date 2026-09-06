# IncidentFlow

IncidentFlow é uma API de gerenciamento de incidentes integrada ao IBM App Connect, PostgreSQL e Slack.

## Arquitetura

Cliente
→ IBM App Connect
→ validação e normalização
→ HTTP Connector
→ Private Network / Secure Agent
→ Node.js / Express
→ PostgreSQL
→ classificação por severidade
→ Slack para incidentes críticos

## Severidades

- `low` → salva no PostgreSQL, sem alerta no Slack
- `medium` → salva no PostgreSQL, sem alerta no Slack
- `high` → salva no PostgreSQL e envia alerta no Slack
- `critical` → salva no PostgreSQL e envia alerta crítico no Slack

## Exemplo de resposta

```json
{
  "incidentId": "INC-2026-0009",
  "title": "Multiple failed login attempts",
  "severity": "medium",
  "ip": "10.0.0.45",
  "user": "employee09"
}