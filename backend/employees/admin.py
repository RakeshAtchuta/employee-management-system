from django.contrib import admin
from .models import *
admin.site.register([Employee,Department,Company,Designation,Location,EmployeeType])
