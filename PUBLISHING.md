# Publish the site on Render

This project can run as one Render web service: Express serves both the React build and `/api` routes from the same public URL. MongoDB Atlas hosts the database.

## Before deploying

1. Rotate the Gmail App Password and MongoDB credentials previously stored in `k8s/secret.yaml`. Treat both as exposed; do not reuse them.
2. Create a MongoDB Atlas database and database user. In Atlas Network Access, allow Render to connect (for a first deployment, `0.0.0.0/0` works with a strong database password; restrict access further when practical). Copy the Atlas connection string and replace its username, password, and database name as needed.
3. Push this project to a GitHub repository. Do not commit `.env` files or real credentials.

## Deploy

1. In Render, choose **New > Blueprint**, connect the GitHub repository, and select the branch to publish. Render reads the root `render.yaml`.
2. During setup, enter the Atlas connection string for `MONGO_URI` and the rotated Gmail sender and App Password. Render generates `JWT_SECRET`.
3. Create the Blueprint and wait for the deploy to finish. The API health check is `/api/health`; the frontend and API share the resulting `https://<service>.onrender.com` address.
4. In the Gmail sender account, confirm Google 2-Step Verification and App Password access are enabled. Sign-up verification links use the Render public URL automatically.
5. If the database is empty, seed it once from a connected local terminal with `MONGO_URI` set to the same Atlas connection string: `npm --prefix backend run seed`.

The free Render web service may sleep after inactivity, so the first request after idle time can take longer. Atlas free tier availability and limits depend on the selected region and current Atlas account options.
