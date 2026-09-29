from django.shortcuts import render
from django.db import connection


def login_view(request):
    message = ""

    if request.method == "POST":
        phone_number = request.POST.get("username")
        password = request.POST.get("password")
        role = request.POST.get("role")

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM users
                WHERE phone_number = %s
                AND password_hash = %s
                AND role = %s
                """,
                [phone_number, password, role]
            )

            user = cursor.fetchone()

        if user:
            message = "Login successful"
        else:
            message = "Invalid phone number, password, or role"

    return render(
        request,
        "authentication/login.html",
        {"message": message}
    )