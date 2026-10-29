from rest_framework import serializers

from .models import (
    Employee,
    Department,
    Company,
    Designation,
    Location,
    EmployeeType
)


# ============================================================
# DEPARTMENT
# ============================================================

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = "__all__"

    def validate_code(self, value):

        value = value.strip()

        queryset = Department.objects.filter(
            code__iexact=value
        )

        # When editing, don't compare with itself
        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                f'Department code "{value}" already exists.'
            )

        return value

    def validate_name(self, value):

        value = value.strip()

        queryset = Department.objects.filter(
            name__iexact=value
        )

        # When editing, don't compare with itself
        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                f'Department name "{value}" already exists.'
            )

        return value


# ============================================================
# COMPANY
# ============================================================

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = "__all__"


# ============================================================
# DESIGNATION
# ============================================================

class DesignationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Designation
        fields = "__all__"


# ============================================================
# LOCATION
# ============================================================

class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = "__all__"


# ============================================================
# EMPLOYEE TYPE
# ============================================================

class EmployeeTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmployeeType
        fields = "__all__"


# ============================================================
# EMPLOYEE
# ============================================================

class EmployeeSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    designation_name = serializers.CharField(
        source="designation.name",
        read_only=True
    )

    employee_type_name = serializers.CharField(
        source="employee_type.name",
        read_only=True
    )

    location_name = serializers.CharField(
        source="location.name",
        read_only=True
    )

    class Meta:
        model = Employee
        fields = "__all__"

    def validate_employee_id(self, value):

        queryset = Employee.objects.filter(
            employee_id=value
        )

        if self.instance:

            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                "Employee ID already exists."
            )

        return value

    def validate_email(self, value):

        queryset = Employee.objects.filter(
            email__iexact=value
        )

        if self.instance:

            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                "Email address already exists."
            )

        return value