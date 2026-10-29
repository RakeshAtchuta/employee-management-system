from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
router=DefaultRouter()
router.register("employees",EmployeeViewSet)
router.register("departments",DepartmentViewSet)
router.register("companies",CompanyViewSet)
router.register("designations",DesignationViewSet)
router.register("locations",LocationViewSet)
router.register("employee-types",EmployeeTypeViewSet)
urlpatterns=[path("",include(router.urls)),path("dashboard/",dashboard)]
