# Prisma + Neon PostgreSQL Setup

## Overview

Set up Prisma ORM with Neon PostgreSQL database.

## Requirements

- Use Neon PostgreSQL (serverless)
- Create initial schema based on data models in project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## References

- Initial data models: `@context/project-overview.md`
- Database standards: `@context/coding-standards.md`
- Prisma docs: https://prisma.io/docs (Use Prisma 7)

## Notes

ALWAYS create migrations and never push directly unless specified.
