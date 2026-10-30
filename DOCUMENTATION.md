# Student Education Platform — Complete Documentation

## Project Overview

A full-stack web application for students to explore courses after 12th and discover NCERT books. Deployed on Kubernetes using Docker containers.

### Access control

Guests can access the login, registration, and email verification pages. A signed-in user can access the website, courses, and books. The `/admin` dashboard is available only to the account whose email matches the backend `ADMIN_EMAIL` setting. Set `ADMIN_EMAIL` in `backend/.env` for local development and as `ADMIN_EMAIL` in the `student-platform-secret` Kubernetes secret for deployment. Course, book, and solution APIs require a valid login token.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + React Router + Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB 6.0 |
| Containerization | Docker |
| Orchestration | Kubernetes (kind via Docker Desktop) |
| Web Server | Nginx (serve React build) |
| Local Registry | Docker Registry v2 |

---

## Project Structure

```
newSkill1/
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── CourseCard.js
│   │   │   └── BookCard.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Courses.js
│   │   │   ├── Solutions.js
│   │   │   └── Books.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── Course.js
│   │   ├── Solution.js
│   │   └── Book.js
│   ├── routes/
│   │   ├── courses.js
│   │   ├── solutions.js
│   │   └── books.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secret.yaml
    ├── mongo-pv.yaml
    ├── mongo-pvc.yaml
    ├── mongo-deployment.yaml
    ├── mongo-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    ├── networkpolicy.yaml
    ├── serviceaccount.yaml
    ├── role.yaml
    ├── rolebinding.yaml
    ├── cronjob.yaml
    └── README.md
```

---

## Website Features

### 1. Home Page
- Hero section with tagline "Find Your Path After 12th"
- Feature cards: Courses and Books
- Navigation to all sections

### 2. Courses Page
- Filter courses by area: Science / Medical / Commerce / Arts / Other
- Course cards with title, description, duration, career scope
- Course areas include engineering, medicine and allied health, commerce and finance, arts and social sciences, hospitality, travel, aviation, sports and vocational degrees

### 3. Books Page
- NCERT textbook catalog by class for Classes 6–12, linked to the official textbook portal
- Subject, class, board (CBSE) info
- Links to NCERT official website

---

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/courses | List all courses |
| GET | /api/courses?stream=Science | Filter by stream |
| GET | /api/courses/:id | Single course |
| GET | /api/solutions | List all solutions |
| GET | /api/solutions?class=12&subject=Maths | Filter solutions |
| GET | /api/solutions/:id | Single solution |
| GET | /api/books | List all books |
| GET | /api/books?class=12 | Filter by class |
| GET | /api/books/:id | Single book |

---

## Kubernetes Concepts Used

| Manifest | Kind | Purpose |
|----------|------|---------|
| namespace.yaml | Namespace | Isolate all resources in `student-platform` |
| configmap.yaml | ConfigMap | Store MONGO_URI, NODE_ENV, PORT |
| secret.yaml | Secret | Store MongoDB credentials (base64) |
| mongo-pv.yaml | PersistentVolume | 5Gi storage for MongoDB data |
| mongo-pvc.yaml | PersistentVolumeClaim | 2Gi claim for MongoDB pod |
| mongo-deployment.yaml | Deployment | Run MongoDB 6.0 container |
| mongo-service.yaml | Service (ClusterIP) | Internal access to MongoDB |
| backend-deployment.yaml | Deployment | Run Node.js API (2 replicas) |
| backend-service.yaml | Service (ClusterIP) | Internal access to backend |
| frontend-deployment.yaml | Deployment | Run React app via Nginx (2 replicas) |
| frontend-service.yaml | Service (NodePort) | Expose frontend on port 30080 |
| ingress.yaml | Ingress | Route / → frontend, /api → backend |
| hpa.yaml | HorizontalPodAutoscaler | Scale backend 2–5 pods at 50% CPU |
| networkpolicy.yaml | NetworkPolicy | frontend→backend, backend→mongo only |
| serviceaccount.yaml | ServiceAccount | Identity for backend pods |
| role.yaml | Role | Pod read permissions |
| rolebinding.yaml | RoleBinding | Bind role to service account |
| cronjob.yaml | CronJob | Daily database health check job |

---

## Step-by-Step Deployment Guide

### Prerequisites
- Windows 10/11 with WSL 2
- Docker Desktop installed and running
- Kubernetes enabled in Docker Desktop

---

### Step 1 — Verify WSL 2
```powershell
wsl --version
```

---

### Step 2 — Build Docker Images
```powershell
cd C:\Users\Prabhat\OneDrive\Desktop\newSkill1

# Build frontend
docker build -t student-platform-frontend:latest ./frontend

# Build backend
docker build -t student-platform-backend:latest ./backend

# Verify images
docker images
```

---

### Step 3 — Start Local Docker Registry
```powershell
docker run -d -p 5000:5000 --restart=always --name local-registry registry:2
```

---

### Step 4 — Push Images to Local Registry
```powershell
docker tag student-platform-frontend:latest localhost:5000/student-platform-frontend:latest
docker tag student-platform-backend:latest localhost:5000/student-platform-backend:latest

docker push localhost:5000/student-platform-frontend:latest
docker push localhost:5000/student-platform-backend:latest
```

---

### Step 5 — Deploy Kubernetes Manifests (in order)
```powershell
cd C:\Users\Prabhat\OneDrive\Desktop\newSkill1\k8s

kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongo-pv.yaml
kubectl apply -f mongo-pvc.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml
kubectl apply -f serviceaccount.yaml
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f hpa.yaml
kubectl apply -f networkpolicy.yaml
kubectl apply -f ingress.yaml
kubectl apply -f cronjob.yaml
```

---

### Step 6 — Update Deployments to Use Registry Images
```powershell
kubectl set image deployment/frontend frontend=localhost:5000/student-platform-frontend:latest -n student-platform
kubectl set image deployment/backend backend=localhost:5000/student-platform-backend:latest -n student-platform
```

---

### Step 7 — Verify All Pods Running
```powershell
kubectl get pods -n student-platform
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxx                1/1     Running   0          2m
backend-xxxx                1/1     Running   0          2m
frontend-xxxx               1/1     Running   0          2m
frontend-xxxx               1/1     Running   0          2m
mongo-xxxx                  1/1     Running   0          2m
```

---

### Step 8 — Seed the Database
```powershell
kubectl exec -it -n student-platform deployment/backend -- node seed/seedData.js
```

---

### Step 9 — Access the Website

Open two PowerShell windows:

**Window 1 — Frontend:**
```powershell
kubectl port-forward svc/frontend-service 3000:80 -n student-platform
```

**Window 2 — Backend:**
```powershell
kubectl port-forward svc/backend-service 5001:5000 -n student-platform
```

Open browser:
- Website → http://localhost:3000
- API Health → http://localhost:5001/api/health
- Courses API → http://localhost:5001/api/courses
- Books API → http://localhost:5001/api/books

---

## Troubleshooting

### Login returns 401 after registration
New accounts must verify their email before login. If the verification message did not arrive, use **Resend verification email** on the login page after configuring Gmail SMTP as described below. A failed email send leaves the account pending so registration can be retried or the verification email resent.

### Gmail verification email is not sent
For local development, copy `backend/.env.example` to `backend/.env` and set `GMAIL_USER` to the sender Gmail address and `GMAIL_APP_PASSWORD` to a valid Google App Password. The backend sends through Gmail SMTP over SSL. A normal Gmail account password will not work. Restart the backend after changing these values. On Kubernetes, set the same values in the `student-platform-secret` Secret and restart the backend deployment.

Keep `.env` and real credentials out of source control. Credentials previously placed in manifests or documentation should be replaced with newly generated credentials.

### ErrImageNeverPull
**Cause:** Kubernetes cannot find the image in its container runtime.
**Fix:** Push images to a local registry and use `imagePullPolicy: Always`.

### CrashLoopBackOff (Backend)
**Cause:** MongoDB connection timeout — wrong URI or blocked by NetworkPolicy.
**Fix:** Update MONGO_URI in ConfigMap to include credentials:
```
mongodb://admin:studentplatform123@mongo-service:27017/studentplatform?authSource=admin
```

### NetworkPolicy blocking traffic
**Cause:** A single broad NetworkPolicy blocked all pod egress.
**Fix:** Use separate NetworkPolicy per app (frontend, backend, mongo).

### Port already in use
**Cause:** Port 8080 already occupied on host.
**Fix:** Use a different port: `kubectl port-forward svc/frontend-service 3000:80`

### kind cluster — NodePort not accessible on localhost
**Cause:** kind runs inside a VM, NodePorts don't bind to host localhost.
**Fix:** Use `kubectl port-forward` instead of NodePort for local access.

---

## Useful kubectl Commands

```powershell
# View all resources
kubectl get all -n student-platform

# View logs
kubectl logs -n student-platform deployment/backend
kubectl logs -n student-platform deployment/frontend

# Describe a pod
kubectl describe pod <pod-name> -n student-platform

# Scale deployment
kubectl scale deployment backend --replicas=3 -n student-platform

# Check HPA status
kubectl get hpa -n student-platform

# Check ConfigMap
kubectl get configmap student-platform-config -n student-platform -o yaml

# Check NetworkPolicy
kubectl get networkpolicy -n student-platform

# Delete all resources
kubectl delete namespace student-platform
```

---

## Architecture Diagram

```
Browser
   |
   | port-forward :3000
   |
Frontend Pod (Nginx + React)
   |
   | ClusterIP :5000
   |
Backend Pod (Node.js + Express)
   |
   | ClusterIP :27017
   |
MongoDB Pod
   |
PersistentVolume (5Gi)
```

---

*Project built and deployed on: October 2026*
*Platform: Windows 11 + WSL2 + Docker Desktop + Kubernetes (kind)*
