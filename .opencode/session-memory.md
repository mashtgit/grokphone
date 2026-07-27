# Session Memory

> Проект: grok-phone-agent
> Первая запись: 2026-07-27

## Известные решения

| Дата | Решение | Причина |
|------|---------|--------|
| 2026-07-27 | Использовать graphify для карты кода | Быстрый доступ к структуре без чтения файлов |
| 2026-07-27 | graphify-out/ закоммичен в репозиторий | Чтобы вся команда видела граф |
| 2026-07-27 | graphify global-add в глобальный граф | MCP сервер всегда видит проект |

## Текущая архитектура

- **Voximplant + Grok Voice Agent**: inbound/outbound звонки через xAI Voice API
- **deploy.js**: загружает сценарии и конфиги на Voximplant CI
- **outbound.js**: триггерит исходящий звонок с локальной машины
- **AGENTS.md**: правила для OpenCode-агента (два рантайма, .env secrets)

## Важные ссылки

- Репозиторий: https://github.com/mashtgit/grokphone
- Документация Voximplant: @voximplant/apiclient-nodejs
- xAI Grok Voice API: grok-voice-think-fast-1.0

## Статус

- [x] Graphify установлен и настроен
- [x] Репозиторий создан и запушен
- [x] OpenCode интеграция (build prompt, MCP, plugins)
