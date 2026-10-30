# EduPath â€” Student Education Platform on Kubernetes

A full-stack education platform for students after Class 12, offering course guidance, CBSE subject solutions, and NCERT book access. Deployed on Kubernetes with a complete production-grade setup.

---

## Architecture

```
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚          student-platform namespace       â”‚
                         â”‚                                           â”‚
  Browser â”€â”€â–º NodePort   â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
              :30080  â”€â”€â”€â”¼â”€â”€â–ºâ”‚ frontend  â”‚      â”‚    Ingress    â”‚   â”‚
                         â”‚   â”‚  (nginx)  â”‚      â”‚ nginx-ingress â”‚   â”‚
                         â”‚   â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
                         â”‚         â”‚ /api               â”‚           â”‚
                         â”‚         â–¼                    â–¼           â”‚
                         â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
                         â”‚   â”‚     backend  (Node.js/Express)    â”‚  â”‚
                         â”‚   â”‚     2 replicas + HPA (2-5)        â”‚  â”‚
                         â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
                         â”‚                      â”‚                    â”‚
                         â”‚                      â–¼                    â”‚
                         â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
                         â”‚   â”‚     MongoDB 6.0 (1 replica)       â”‚  â”‚
                         â”‚   â”‚     PersistentVolume: 5Gi         â”‚  â”‚
                         â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
                         â”‚                                           â”‚
                         â”‚   CronJob: daily DB health check          â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker Desktop | 4.x+ | Container runtime |
| kubectl | 1.27+ | Kubernetes CLI |
| minikube | 1.30+ | Local Kubernetes cluster |
| Node.js | 18+ | (optional) local dev |

Install minikube: https://minikube.sigs.k8s.io/docs/start/

---

## Step-by-Step Setup

### 1. Start Minikube

```bash
minikube start --memory=4096 --cpus=2
```

Verify it is running:
```bash
minikube status
kubectl get nodes
```

### 2. Point Docker CLI to Minikube's Docker daemon

**Linux / macOS:**
```bash
eval $(minikube docker-env)
```

**Windows PowerShell:**
```powershell
minikube docker-env | Invoke-Expression
```

> Important: run all `docker build` commands in the same terminal session after this step.

### 3. Build Docker Images inside Minikube

From the project root (`newSkill1/`):

```bash
docker build -t student-platform-backend:latest ./backend
docker build -t student-platform-frontend:latest ./frontend
```

Verify images exist:
```bash
docker images | grep student-platform
```

### 4. Apply Kubernetes Manifests (in order)

```bash
# Namespace first
kubectl apply -f k8s/namespace.yaml

# Config and secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# RBAC
kubectl apply -f k8s/serviceaccount.yaml
kubectl apply -f k8s/role.yaml
kubectl apply -f k8s/rolebinding.yaml

# Storage
kubectl apply -f k8s/mongo-pv.yaml
kubectl apply -f k8s/mongo-pvc.yaml

# MongoDB
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/mongo-service.yaml

# Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Ingress, autoscaling, network policies, scheduled jobs
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/networkpolicy.yaml
kubectl apply -f k8s/cronjob.yaml
```

Apply everything at once (after namespace):
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

### 5. Wait for Pods to be Ready

```bash
kubectl get pods -n student-platform -w
```

All pods should show `Running` status. This may take 1-2 minutes on first run while images load.

### 6. Seed the Database

Once the backend and MongoDB pods are running, exec into the backend pod:

```bash
# Get the backend pod name
kubectl get pods -n student-platform -l app=backend

# Exec into it and run the seed script
kubectl exec -it <backend-pod-name> -n student-platform -- node seed/seedData.js
```

Or run it as a one-off Job:
```bash
kubectl run seed-job \
  --image=student-platform-backend:latest \
  --restart=Never \
  --namespace=student-platform \
  --env="MONGO_URI=mongodb://mongo-service:27017/studentplatform" \
  -- node seed/seedData.js
```

### 7. Access the Application

**Option A â€” minikube service (recommended):**
```bash
minikube service frontend-service -n student-platform
```
This opens the app in your browser automatically.

**Option B â€” NodePort via minikube IP:**
```bash
minikube ip
# Browse to http://<minikube-ip>:30080
```

**Option C â€” Enable Ingress addon and use host:**
```bash
minikube addons enable ingress

# Add to your hosts file (Windows: C:\Windows\System32\drivers\etc\hosts)
# <minikube-ip>  student-platform.local

# Then browse to http://student-platform.local
```

---

## Useful kubectl Commands

```bash
# --- Namespace overview ---
kubectl get all -n student-platform

# --- Pod management ---
kubectl get pods -n student-platform
kubectl describe pod <pod-name> -n student-platform
kubectl logs <pod-name> -n student-platform
kubectl logs -f <pod-name> -n student-platform          # follow logs

# --- Exec into a container ---
kubectl exec -it <pod-name> -n student-platform -- sh

# --- Deployments ---
kubectl get deployments -n student-platform
kubectl rollout status deployment/backend -n student-platform
kubectl rollout restart deployment/backend -n student-platform

# --- Services ---
kubectl get services -n student-platform
kubectl describe service frontend-service -n student-platform

# --- ConfigMap & Secrets ---
kubectl get configmap -n student-platform
kubectl get secret -n student-platform
kubectl describe configmap student-platform-config -n student-platform

# --- HPA (autoscaling) ---
kubectl get hpa -n student-platform
kubectl describe hpa backend-hpa -n student-platform

# --- CronJob ---
kubectl get cronjobs -n student-platform
kubectl get jobs -n student-platform

# --- PersistentVolume ---
kubectl get pv
kubectl get pvc -n student-platform

# --- RBAC ---
kubectl get serviceaccounts -n student-platform
kubectl get roles -n student-platform
kubectl get rolebindings -n student-platform

# --- Network Policy ---
kubectl get networkpolicies -n student-platform

# --- Scale manually ---
kubectl scale deployment backend --replicas=3 -n student-platform

# --- Delete everything (cleanup) ---
kubectl delete namespace student-platform
kubectl delete pv mongo-pv
```

---

## Kubernetes Concepts Covered

This project demonstrates 16+ Kubernetes concepts:

| # | Concept | File(s) |
|---|---------|---------|
| 1 | **Namespace** â€” resource isolation | `namespace.yaml` |
| 2 | **Deployment** â€” declarative pod management | `backend-deployment.yaml`, `frontend-deployment.yaml`, `mongo-deployment.yaml` |
| 3 | **Service (ClusterIP)** â€” internal cluster communication | `mongo-service.yaml`, `backend-service.yaml` |
| 4 | **Service (NodePort)** â€” external access | `frontend-service.yaml` |
| 5 | **ConfigMap** â€” non-sensitive configuration injection | `configmap.yaml` |
| 6 | **Secret** â€” sensitive data (base64 encoded) | `secret.yaml` |
| 7 | **PersistentVolume (PV)** â€” durable storage provisioning | `mongo-pv.yaml` |
| 8 | **PersistentVolumeClaim (PVC)** â€” storage request binding | `mongo-pvc.yaml` |
| 9 | **Ingress** â€” HTTP routing with host/path rules | `ingress.yaml` |
| 10 | **HorizontalPodAutoscaler (HPA)** â€” CPU-based auto-scaling | `hpa.yaml` |
| 11 | **NetworkPolicy** â€” pod-level firewall / traffic control | `networkpolicy.yaml` |
| 12 | **ServiceAccount** â€” pod identity for API access | `serviceaccount.yaml` |
| 13 | **Role** â€” namespace-scoped permissions (RBAC) | `role.yaml` |
| 14 | **RoleBinding** â€” attaches Role to ServiceAccount | `rolebinding.yaml` |
| 15 | **CronJob** â€” scheduled/recurring tasks | `cronjob.yaml` |
| 16 | **Liveness & Readiness Probes** â€” health checking | `backend-deployment.yaml` |
| 17 | **Resource Requests & Limits** â€” CPU/memory guardrails | all deployment files |
| 18 | **Multi-stage Docker builds** â€” optimized images | `frontend/Dockerfile` |

---

## Environment Variables Reference

| Variable | Source | Description |
|----------|--------|-------------|
| `MONGO_URI` | ConfigMap | MongoDB connection string |
| `NODE_ENV` | ConfigMap | Node environment (production) |
| `PORT` | ConfigMap | Backend server port |
| `FRONTEND_URL` | ConfigMap | Allowed CORS origin |
| `GMAIL_USER` | Secret | Gmail SMTP sender address |
| `GMAIL_APP_PASSWORD` | Secret | Google App Password used by Gmail SMTP |
| `JWT_SECRET` | Secret | Secret used to sign login tokens |
| `MONGO_USERNAME` | Secret | MongoDB username (base64) |
| `MONGO_PASSWORD` | Secret | MongoDB password (base64) |
| `MONGO_INITDB_ROOT_USERNAME` | Secret | MongoDB root user |
| `MONGO_INITDB_ROOT_PASSWORD` | Secret | MongoDB root password |

The backend NetworkPolicy permits DNS, MongoDB, and outbound Gmail SMTP on TCP port 465. Local `backend/.env` changes do not update Kubernetes Secrets; update the Secret in the cluster, apply `networkpolicy.yaml`, then rebuild and push the backend image before restarting the deployment.

---

## Project Structure

```
newSkill1/
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ public/index.html
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/    # Navbar, Footer, CourseCard, BookCard
â”‚   â”‚   â”œâ”€â”€ pages/         # Home, Courses, Solutions, Books
â”‚   â”‚   â”œâ”€â”€ App.js
â”‚   â”‚   â”œâ”€â”€ App.css
â”‚   â”‚   â””â”€â”€ index.js
â”‚   â”œâ”€â”€ Dockerfile         # Multi-stage: build â†’ nginx
â”‚   â”œâ”€â”€ nginx.conf
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ models/            # Course, Solution, Book (Mongoose schemas)
â”‚   â”œâ”€â”€ routes/            # /api/courses, /api/solutions, /api/books
â”‚   â”œâ”€â”€ seed/seedData.js   # Populates DB with sample data
â”‚   â”œâ”€â”€ server.js
â”‚   â”œâ”€â”€ Dockerfile
â”‚   â””â”€â”€ package.json
â””â”€â”€ k8s/                   # All Kubernetes manifests
    â”œâ”€â”€ namespace.yaml
    â”œâ”€â”€ configmap.yaml
    â”œâ”€â”€ secret.yaml
    â”œâ”€â”€ mongo-pv.yaml
    â”œâ”€â”€ mongo-pvc.yaml
    â”œâ”€â”€ mongo-deployment.yaml
    â”œâ”€â”€ mongo-service.yaml
    â”œâ”€â”€ backend-deployment.yaml
    â”œâ”€â”€ backend-service.yaml
    â”œâ”€â”€ frontend-deployment.yaml
    â”œâ”€â”€ frontend-service.yaml
    â”œâ”€â”€ ingress.yaml
    â”œâ”€â”€ hpa.yaml
    â”œâ”€â”€ networkpolicy.yaml
    â”œâ”€â”€ serviceaccount.yaml
    â”œâ”€â”€ role.yaml
    â”œâ”€â”€ rolebinding.yaml
    â”œâ”€â”€ cronjob.yaml
    â””â”€â”€ README.md
```

---

## Troubleshooting

**Pods stuck in `Pending`:**
```bash
kubectl describe pod <pod-name> -n student-platform
# Look for Events section â€” usually a PVC binding or image pull issue
```

**ImagePullBackOff:**
- Make sure you ran `minikube docker-env | Invoke-Expression` before building images
- Verify `imagePullPolicy: Never` is set in the deployment

**MongoDB connection refused:**
- Check mongo pod is Running: `kubectl get pods -n student-platform -l app=mongo`
- Verify the PVC bound: `kubectl get pvc -n student-platform`

**Frontend shows no data:**
- Check backend pod logs: `kubectl logs -l app=backend -n student-platform`
- Ensure the database was seeded (Step 6)
- Verify `MONGO_URI` in configmap points to `mongo-service:27017`

