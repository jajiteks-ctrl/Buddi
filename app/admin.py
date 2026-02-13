from django.contrib import admin

# Register your models here.
from django.contrib import admin
from app.models import Category,Product

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id","name")
    
class ProductAdmin(admin.ModelAdmin):
    list_display = ("category","name","description","price","quantity","image",)
    
admin.site.register(Category,CategoryAdmin)
    

    
admin.site.register(Product,ProductAdmin)
    

