# ArenaHub SRS → Implementation Map

The supplied SRS is the authoritative scope. The implementation maps the requested Version 1.0 requirements as follows.

| SRS | Implementation |
|---|---|
| FR-01/02 | Register/login endpoints, bcrypt password hashing, JWT session token |
| FR-03 | Platform Admin console creates host organizations |
| FR-04/05 | Org memberships store exactly one role per user/org; middleware scopes access to org |
| FR-06–09 | Organizer creates/configures tournaments, opens/closes registration, tenant tournament list |
| FR-10–12 | Captain registers teams only while registration is open; roster changes stop after start |
| FR-13–15 | Single-elimination bracket engine with power-of-two sizing, seed positions, byes and automatic advancement |
| FR-16–19 | Result submission, opponent confirmation, match state lifecycle and live Socket.IO events |
| FR-20–23 | Dispute reason, referee notification, uphold/overturn resolution, bracket advancement |
| FR-24/25 | Persistent in-app notifications and read/read-all controls |
| FR-26 | Authenticated Spectator role has read-only tournament/bracket/match views |
| FR-27/28 | Platform Admin aggregate statistics and host suspend/activate controls |
| NFR-03/04/05 | bcrypt, signed JWT expiry, role/tenant middleware |
| NFR-07/08 | Responsive React UI and inline API error messages |
| NFR-10 | Match/dispute state is written directly to PostgreSQL before event emission |
| NFR-13 | Routes → controllers → services → repositories structure |
| NFR-15 | Backend and frontend Dockerfiles + full Docker Compose deployment |

Out-of-scope SRS items remain out of scope: streaming/voice, payments/prizes, native mobile apps, and non-single-elimination tournament formats.
