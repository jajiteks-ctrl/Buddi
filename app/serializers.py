from rest_framework import serializers

from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username","first_name","last_name","email","password"]

    
    def validate_username(self,value):
        if User.objects.filter(username = value).exists():
            raise serializers.ValidationError("User already exist")
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exist")
        return value
    
            
    def create(self,validated_data):
        return User.objects.create_user(**validated_data)
        
   
   
from app.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","first_name","last_name","email"]
        
   
   
from rest_framework import serializers
from app.models import Product, Category


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


        
class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "products"]



from rest_framework import serializers
from app.models import Cart,CartItem

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    def create(self, validated_data):
        user = self.context["request"].user

        # STEP 1: get or create cart
        cart, _ = Cart.objects.get_or_create(user=user)

        # STEP 2: get or create cart item
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=validated_data["product_id"]
        )

        # STEP 3: if item already exists, increase quantity
        if not created:
            item.quantity += 1
            item.save()

        return item


from rest_framework import serializers

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    image = serializers.URLField(
        source="product.image",
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",   # ✅ IMPORTANT
            "product_name",
            "price",
            "quantity",
            "image"
        ]


# // Decrese serializers
from rest_framework import serializers
from app.models import Cart, CartItem
from django.shortcuts import get_object_or_404


class DecreaseCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()  # product id

    def create(self, validated_data):
        user = self.context["request"].user
        cart = Cart.objects.get(user=user)
        item = get_object_or_404(CartItem, cart=cart, product_id=validated_data["product_id"])

        if item.quantity > 1:
            item.quantity -= 1
            item.save()
        else:
            item.delete()
            return None
        return item


#item serializers 

from rest_framework import serializers
from .models import Order, OrderItem

from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    image = serializers.URLField(source="product.image", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["product_name", "image", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "address", "total_amount", "status", "items", "created_at"]


from rest_framework import serializers
from .models import Wishlist, WishlistItem
from app.models import Product


class WishlistItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.URLField(source="product.image", read_only=True)

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "added_at",
        ]


class AddWishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        product = Product.objects.get(id=validated_data["product_id"])

        item, _ = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product
        )
        return item

