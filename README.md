# Message Risk Analyzer — Rule-Based Text Intelligence System

Message Risk Analyzer is a backend system that analyzes user-submitted messages and classifies them into risk levels using deterministic, rule-based scoring logic.

The system is designed to be transparent, explainable, and easy to debug.

## Problem
Many platforms need lightweight safety checks on user-generated text without relying on black-box ML models.

This project demonstrates how rule-based systems can be used for:
- Content moderation
- Safety classification
- Explainable decision logic

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT, Bcrypt
- APIs: REST

## Features
- Stateless REST API
- JWT-based authentication
- User registration and login
- Message risk analysis endpoint
- Rule-based scoring engine
- Risk categories:
  - Low
  - Medium
  - High

## Architecture
The system follows a clean layered design:
- Middleware for auth
- Controllers for routing
- Models for data
- Scoring logic isolated from routes

This allows:
- Horizontal scalability
- Easy debugging
- Clear separation of concerns

## Scoring Logic
Messages are evaluated using:
- Weighted keyword heuristics
- Threshold-based classification
- Deterministic outputs (no randomness)

All decisions are explainable and reproducible.

## Status
This is a backend practice project focused on:
- API design
- Authentication
- Modular architecture
- Secure request handling