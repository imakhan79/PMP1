
# Aslam PM - Modern Project Management SaaS

Aslam PM is a high-performance, developer-centric project management tool built with speed and aesthetics in mind.

## Core Features
- **Multitenancy**: Workspaces with complete isolation.
- **Dynamic Views**: Kanban, List, Calendar, and Timeline.
- **Sprint Management**: Built-in support for Agile workflows.
- **Reporting**: Advanced dashboards for workload and velocity tracking.
- **Wiki/Docs**: Project-specific knowledge bases.
- **Time Tracking**: Log hours directly on tasks.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS.
- **Icons**: Lucide-react.
- **Charts**: Recharts.
- **Storage**: LocalStorage (Simulated PostgreSQL/Prisma backend for this environment).

## Architecture
The application uses a **Service-Store** pattern. All mutations flow through the `AppProvider` which simulates server-side validations and Prisma database logic. RBAC is enforced at the service level.

### Permission Matrix
| Action | Owner | Admin | Member | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| Delete Workspace | ✅ | ❌ | ❌ | ❌ |
| Invite Users | ✅ | ✅ | ❌ | ❌ |
| Create Projects | ✅ | ✅ | ✅ | ❌ |
| Edit Tasks | ✅ | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ |

## Setup
1. Standard React installation: `npm install && npm start`.
2. The `store.tsx` handles initial seeding (1 workspace, 2 projects, 20 tasks).
