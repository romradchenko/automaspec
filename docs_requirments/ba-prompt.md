BA Requirements Preparation
Due November 10, 2025 10:59 PM
BA
Instructions
Задача: В рамках дипломного проектирования выполнить набор бизнес-анализ задач в рамках своего проекта и, как результат, предоставить документ соответствующий требованиям БА, описывающий детали вашего проекта.

Требования БА: BA Requirements for Diplomas.docx

Форма сдачи: Документ (.docx, .pdf) и приложения(атачи), если применимо (Use Case Diagram например, если не добавляете его в основной документ).

Дедлайн: Все работы должны быть сданы до 10-го ноября.


# Business Analysis requirements for passing BA stage of diploma preparation

Description: The goal of this document is to provide students with the overview of what is expected of them to pass the BA stage of diploma preparation.  
<br/>Document includes:

- Minimum based requirements - requirements that must be covered to pass the stage (grade - 5)
- Maximum based requirements - requirements that are expected to be covered to pass the stage with the highest grade (grade - 10).

### Minimum based requirements

- Vision, Problem, Project
  - Vision Statement (like an elevator pitch)
  - Problem Statement (Background/Context) - описание проблемы на решение которой нацелен продукт
  - Business goals and objectives- цели и задачи которых хотим достичь
  - Key stakeholders - ключевые стейкходеры включая ЦА и юзеров
- Scope
  - In-Scope - что входит в рамки проекта (функции, процессы, системы).
  - Out-of-Scope - что точно не будет делаться, чтобы избежать расширения границ.
- High-Level Solution Overview
  - Proposed Solution - общее описание предлагаемого технического решения.
  - Architecture / Integration Landscape (High-Level) - схема или текстовое описание того, какие системы вовлечены и как они связаны.
- Features & Requirements (High-Level)
  - Core Features - список ключевых функциональных возможностей (epics, capabilities).
    - Functional Requirements - Work Breakdown: epics разбиты на list of user stories на уровне скелета
  - Non-Functional Requirements - нефункциональные требования применимые к продукту (производительность, безопасность, масштабируемость, доступность)
  - Regulatory / Compliance Needs - юридические и регуляторные требования (GDPR, ISO и др.) применимые к проекту.
  - Use Case Diagram - графическое представление основных сценариев использования системы (акторы + их взаимодействие с функциями системы).

### Maximum based requirements

- Introduction
  - Purpose of the Document - зачем нужен документ, его структура, цели (например: согласовать границы проекта, дать общее понимание всем сторонам).
  - Audience - для кого предназначен.
- Vision
  - Vision Statement (like an elevator pitch).
  - Problem Statement (Background/Context) - описание бизнес-проблемы и текущей ситуации.
  - Business Goals & Objectives - бизнес-цели и задачи, которых хотим достичь (например: сократить время обработки заказов на 20%).
  - Stakeholders Analysis - анализ стейкходеров включая ЦА и юзеров, а также их влияние/вовлечнность (Influence/Interest matrix).
  - Success Criteria - измеримые критерии успеха проекта (KPI, SLA, метрики).
- Scope
  - In-Scope - что входит в рамки проекта (функции, процессы, системы).
  - Out-of-Scope - что точно не будет делаться, чтобы избежать расширения границ.
  - Assumptions - важные предположения, на которых строится проект (например: доступность API, готовность данных).
  - Constraints - ограничения (бюджет, сроки, технологии, регуляции, доступные ресурсы).
- High-Level Solution Overview
  - Proposed Solution - общее описание предлагаемого технического решения.
  - Architecture / Integration Landscape (High-Level) - схема или текстовое описание того, какие системы вовлечены и как они связаны.
  - Alternatives Considered - какие варианты рассматривались и почему выбран именно этот.
- Features & Requirements
  - Core Features - список ключевых функциональных возможностей (epics, capabilities).
    - Functional Requirements - Work Breakdown: epics разбиты на list of user stories
      - User Stories c полным описанием, ниже предлагаемая структура:
        - Title
        - User Story statement: As a \[role\], I want \[goal\], so that \[benefit\]
        - Context
        - Scope/desired = что должно быть сделано в рамках стори
        - Acceptance Criteria
        - Assumptions
        - Risks/Dependencies
        - Mockups/Attachments
    - Priority labelling - приоритизация на уровне эпиков(фичей) (например MoSCoW) и юзер сторей
  - 5.2 Non-Functional Requirements - нефункциональные требования применимые к проекту (производительность, безопасность, масштабируемость, доступность)
  - Regulatory / Compliance Needs - юридические и регуляторные требования (GDPR, ISO и др.) применимые к проекту.
  - Use Case Diagram - графическое представление основных сценариев использования системы (акторы + их взаимодействие с функциями системы).
- Risks & Dependencies
  - Risks - список рисков (например: нехватка данных, задержки в интеграции).
  - Dependencies - зависимости от других проектов, систем, команд, внешних факторов.
  - Mitigation Strategies - как планируется снижать риски или управлять ими.