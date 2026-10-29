from django.db import models

class MasterBase(models.Model):
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    class Meta:
        abstract = True
    def __str__(self): return f"{self.code} - {self.name}"

class Department(MasterBase): pass

class Company(MasterBase):
    address = models.TextField(blank=True)
    contact_information = models.CharField(max_length=100, blank=True)

class Designation(MasterBase): pass
class Location(MasterBase): pass
class EmployeeType(MasterBase): pass

class Employee(models.Model):
    GENDER_CHOICES=[("Male","Male"),("Female","Female"),("Other","Other")]
    STATUS_CHOICES=[("Active","Active"),("Inactive","Inactive")]
    employee_id=models.CharField(max_length=30, unique=True)
    first_name=models.CharField(max_length=80)
    last_name=models.CharField(max_length=80)
    email=models.EmailField(unique=True)
    mobile_number=models.CharField(max_length=15)
    gender=models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth=models.DateField()
    date_of_joining=models.DateField()
    department=models.ForeignKey(Department,on_delete=models.PROTECT,related_name="employees")
    company=models.ForeignKey(Company,on_delete=models.PROTECT,related_name="employees")
    designation=models.ForeignKey(Designation,on_delete=models.PROTECT,related_name="employees")
    employee_type=models.ForeignKey(EmployeeType,on_delete=models.PROTECT,related_name="employees")
    location=models.ForeignKey(Location,on_delete=models.PROTECT,related_name="employees")
    status=models.CharField(max_length=10,choices=STATUS_CHOICES,default="Active")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.employee_id} - {self.first_name} {self.last_name}"
