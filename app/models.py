from django.db import models
from django.contrib.auth.models import User 

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username 
    
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products",blank=True,null=True
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    image =  models.URLField(max_length=500, blank=True, null=True)
    ratings = models.DecimalField(
        max_digits=3,        # total digits including before and after decimal
        decimal_places=2,    # digits after the decimal
        default=3.5          # optional default rating
    )

    def __str__(self):
        return self.name
# image = models.ImageField(upload_to="products/", blank=True, null=True)  # 👈 new field
   
class Cart(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    
    def __str__(self):
        self.user.username
        
class CartItem(models.Model):
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return self.product.name



# create order model

from django.db import models
from django.contrib.auth.models import User
from .models import Product  # adjust import if needed

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("PLACED", "Placed"),
        ("DELIVERED", "Delivered"),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PLACED")

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.product.name



from django.db import models
from django.contrib.auth.models import User
from .models import Product


class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("wishlist", "product")  # 👈 prevent duplicates

    def __str__(self):
        return self.product.name
