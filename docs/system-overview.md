# FC26 Pro Clubs Tournament System Overview

## Vision
The FC26 platform brings together managers, players, and administrators to run
recurring Pro Clubs leagues. It exposes a public portal for standings and
registration while protecting sensitive management actions behind OAuth2-backed
accounts.

## Technology Stack
- **Frontend**: Angular single-page application (SPA) served via AWS S3/CloudFront.
- **Backend**: Java Spring Boot REST API packaged as a container and deployed on
  AWS (ECS or EKS). Uses Spring Security OAuth2 for authentication/authorization.
- **Database**: PostgreSQL hosted by AWS RDS.
- **Authentication**: OAuth2 with roles (`PLAYER`, `MANAGER`, `ADMIN`).

## Core Personas
| Persona      | Capabilities |
|--------------|--------------|
| Public Visitor | View leagues, standings, club pages and register for a new account. |
| Player | Manage personal profile (email, password, avatar, platform account). |
| Club Manager | Everything a player can do, plus manage club roster and submit match results. |
| Administrator | Manage users, assign roles, create clubs/leagues, and curate schedules. |

## Domain Model
- **User**: OAuth2 identity with profile, platform account (EA / PS5 / Xbox), role(s).
- **Club**: Name, logo, optional description, roster of users, manager relationship.
- **League**: Season metadata, default match day (Sunday), registered clubs, home/away round-robin fixtures.
- **Match Day**: Calendar definition containing up to two fixtures per default match day.
- **Fixture/Result**: Home club, away club, scheduled date, result details entered by club managers.

## Public-Site Requirements
1. **Home**: Display standings for the active league, highlight upcoming Sunday fixtures.
2. **Registration**: Collect email, password, display name, platform account, and platform type. Validate uniqueness.
3. **Club Page**: Show logo, roster, and the two most recent results with links to detailed fixtures.

## Private-Site Requirements
1. **Profile Management**: CRUD for personal data, password change, avatar upload,
   and platform account via the secured `/api/profile` endpoint.
2. **Club Management**
   - Administrators create clubs and assign managers. Creating a club should auto-promote
     the assigned manager to `CLUB_MANAGER` (if necessary) and add them to the roster.
   - Managers invite/remove players and capture match results (score, scorers, notes).
     Roster moves flow through `/api/clubs/{clubId}/players` so we can enforce permissions
     server-side and keep every client in sync with the authoritative roster snapshot.
3. **League Management**
   - Administrators define leagues, assign clubs, generate home/away fixtures.
   - Support manual override of match days per fixture while defaulting to Sundays with two matches.
   - League creation should immediately register clubs and generate a double round-robin schedule.

## High-Level Architecture
```
[ Angular SPA ] --HTTPS--> [ Spring Boot API ] --JPA--> [ PostgreSQL ]
                                     |--S3--> Club logos / profile pictures
```

- SPA authenticates via OAuth2 Authorization Code flow.
- Backend enforces role-based access control (RBAC).
- Background scheduler ensures fixtures are generated and match days pre-populated.

## API Sketch
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/register` | Register new user with platform metadata. | Public |
| GET | `/api/leagues/current/standings` | Retrieve standings for home page. | Public |
| GET | `/api/clubs/{clubId}` | Club page details. | Public |
| GET/PUT | `/api/profile` | Retrieve or update the authenticated profile. | Player+ |
| POST | `/api/clubs` | Create club and assign manager. | Admin |
| POST | `/api/clubs/{clubId}/players` | Add player to club. | Manager/Admin |
| POST | `/api/leagues` | Create a league and match days. | Admin |
| POST | `/api/matches/{matchId}/result` | Submit result. | Manager |

## Data Considerations
- PostgreSQL schemas per environment (dev, staging, prod) with Flyway migrations.
- Auditing columns (`created_at`, `updated_at`, `created_by`).
- Soft-delete for players leaving clubs to retain historical stats.

## Next Steps
1. Scaffold Angular workspace (`frontend/`) and Spring Boot project (`backend/`).
2. Define PostgreSQL schema migrations and entity relationships.
3. Build authentication/authorization and profile workflows.
4. Implement club/league management and fixtures logic.
5. Iterate on UI polish and AWS deployment automation (CI/CD).
