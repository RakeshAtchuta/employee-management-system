from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Employee, Department, Company, Designation, Location, EmployeeType
from .serializers import *

class SearchViewSet(viewsets.ModelViewSet):
    permission_classes=[permissions.IsAuthenticated]
    def get_queryset(self):
        qs=self.queryset
        q=self.request.query_params.get("search","").strip()
        if q and hasattr(self,"search_fields"):
            query=Q()
            for f in self.search_fields: query |= Q(**{f+"__icontains":q})
            qs=qs.filter(query)
        return qs.order_by("-id")

class EmployeeViewSet(SearchViewSet):
    queryset=Employee.objects.select_related("department","company","designation","employee_type","location")
    serializer_class=EmployeeSerializer
    search_fields=["employee_id","first_name","last_name","email","department__name","company__name"]

class DepartmentViewSet(SearchViewSet):
    queryset=Department.objects.all(); serializer_class=DepartmentSerializer; search_fields=["code","name"]

class CompanyViewSet(SearchViewSet):
    queryset=Company.objects.all(); serializer_class=CompanySerializer; search_fields=["code","name"]

class DesignationViewSet(SearchViewSet):
    queryset=Designation.objects.all(); serializer_class=DesignationSerializer; search_fields=["code","name"]

class LocationViewSet(SearchViewSet):
    queryset=Location.objects.all(); serializer_class=LocationSerializer; search_fields=["code","name"]

class EmployeeTypeViewSet(SearchViewSet):
    queryset=EmployeeType.objects.all(); serializer_class=EmployeeTypeSerializer; search_fields=["code","name"]

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    return Response({
        "total_employees":Employee.objects.count(),
        "male_employees":Employee.objects.filter(gender="Male").count(),
        "female_employees":Employee.objects.filter(gender="Female").count(),
        "permanent_employees":Employee.objects.filter(employee_type__name__iexact="Permanent").count(),
        "temporary_employees":Employee.objects.filter(employee_type__name__iexact="Temporary").count(),
        "total_departments":Department.objects.count(),
        "total_companies":Company.objects.count(),
    })
