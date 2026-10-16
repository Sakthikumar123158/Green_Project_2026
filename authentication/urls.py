
from django.urls import path
from .views import (
    login_view,
    home_view,
    quiz_view,
    attendance_view,
    resume_view,
    lead_management,
    logout_view,
)

urlpatterns = [
    path("", login_view, name="login"),
    path("home/", home_view, name="home"),
    path("quiz/", quiz_view, name="quiz"),
    path("attendance/", attendance_view, name="attendance"),
    path("resume/", resume_view, name="resume"),
    path("lead-management/", lead_management, name="lead_management"),
    path("logout/", logout_view, name="logout"),
]
