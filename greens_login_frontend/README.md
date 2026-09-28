# Greens Technology — Member 1 Login Frontend

Frontend-only login module prepared for Django integration.

## Files

- `authentication/templates/authentication/login.html`
- `authentication/static/authentication/css/login.css`
- `authentication/static/authentication/js/login.js`
- `authentication/static/authentication/images/campus.jpg`

## Run inside Django

1. Put the `authentication` folder inside the common Django project.
2. Add the app to `INSTALLED_APPS`.
3. Configure Django static files.
4. Create a URL/view that renders `authentication/login.html`.
5. Later replace the frontend login simulation with Django's real authentication flow.

No hard-coded credentials are used.
