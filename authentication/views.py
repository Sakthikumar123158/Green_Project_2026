
from django.shortcuts import render, redirect
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
                SELECT full_name, phone_number, role
                FROM users
                WHERE phone_number = %s
                AND password_hash = %s
                AND role = %s
                """,
                [phone_number, password, role]
            )

            user = cursor.fetchone()

        if user:
            # Get actual user details from database
            full_name = user[0]
            user_phone = user[1]
            user_role = user[2]

            # Save user information in Django session
            request.session["user_name"] = full_name
            request.session["user_phone"] = user_phone
            request.session["user_role"] = user_role

            return redirect("/home/")

        else:
            message = "Invalid phone number, password, or role"

    return render(
        request,
        "authentication/login.html",
        {"message": message}
    )


def home_view(request):
    user_name = request.session.get("user_name", "User")
    user_role = request.session.get("user_role", "")

    return render(
        request,
        "authentication/home.html",
        {
            "user_name": user_name,
            "user_role": user_role,
        }
    )
def quiz_view(request):
    user_name = request.session.get("user_name", "User")
    user_role = request.session.get("user_role", "")

    return render(
        request,
        "authentication/quizsep29.html",
        {
            "user_name": user_name,
            "user_role": user_role,
        }
    )
def attendance_view(request):

    user_name = request.session.get("user_name", "User")
    user_role = request.session.get("user_role", "")

    return render(
        request,
        "authentication/attendance.html",
        {
            "user_name": user_name,
            "user_role": user_role,
        }
    )
def resume_view(request):
    user_name = request.session.get("user_name", "User")
    user_role = request.session.get("user_role", "")

    return render(
        request,
        "authentication/resume.html",
        {
            "user_name": user_name,
            "user_role": user_role,
        }
    )





def lead_management(request):
    user_role = request.session.get("user_role", "")

    if not user_role:
        return redirect("login")

    if user_role.strip().lower() != "admin":
        return redirect("home")

    return render(
        request,
        "authentication/lead_management.html",
        {
            "user_name": request.session.get("user_name", "Admin"),
            "user_role": user_role,
        },
    )


def logout_view(request):
    request.session.flush()
    return redirect("login")
