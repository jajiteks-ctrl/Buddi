from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from app.serializers import RegisterSerializer, DecreaseCartItemSerializer,AddToCartSerializer,CartItemSerializer


class ResgisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            {
                "message":f"{user.username} Register Succesfully",
                "data":serializer.data
            },status=status.HTTP_201_CREATED
        ) 
        

# app/views.py
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class LogoutAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return Response({"detail": "Logged out successfully"})


from app.serializers import ProfileSerializer

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
       return self.request.user
    
   

        
       
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


# class ProductCreateView(CreateAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

#===============================================
# BULK POST
#================================================


class ProductCreateView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

   
    
class ProductUpate(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
   

from rest_framework.generics import CreateAPIView

# class CategoryCreateView(CreateAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer


#===============================================
# BULK POST CATEGORY
#================================================
class CategoryCreateView(CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CategoryWiseProductView(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        furniture = Category.objects.filter(
            name__iexact="furniture"
        ).prefetch_related("products")

        others = Category.objects.exclude(
            name__iexact="furniture"
        ).prefetch_related("products")

        return list(furniture) + list(others)

   


from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from app.models import Cart, CartItem
from app.serializers import AddToCartSerializer, DecreaseCartItemSerializer, CartItemSerializer


# ===============================
# Add / Increase Cart Item
# ===============================
class AddToCartAPIView(generics.CreateAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        item = serializer.save()

        # calculate cart total
        cart_items = CartItem.objects.filter(cart=request.user.cart)
        total = sum([ci.product.price * ci.quantity for ci in cart_items])

        return Response({
            "item": CartItemSerializer(item).data,
            "cart_total": total
        }, status=status.HTTP_200_OK)


# ===============================
# View Cart Items
# ===============================
class ViewCartAPIView(generics.ListAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)



class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# ===============================
# Decrease Cart Item
# ===============================

class DecreaseCartItemView(generics.CreateAPIView):
    serializer_class = DecreaseCartItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        item = serializer.save()

        # calculate cart total after decrease
        cart_items = CartItem.objects.filter(cart=request.user.cart)
        total = sum([ci.product.price * ci.quantity for ci in cart_items])

        if item is None:
            return Response(
                {"message": "Item removed from cart", "cart_total": total},
                status=status.HTTP_200_OK
            )

        return Response({
            "item": CartItemSerializer(item).data,
            "cart_total": total
        }, status=status.HTTP_200_OK)


class RemoveCartItemAPIView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id, *args, **kwargs):
        cart = request.user.cart

        item = CartItem.objects.filter(
            cart=cart,
            product_id=product_id
        ).first()

        if not item:
            return Response(
                {"message": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        item.delete()

        cart_items = CartItem.objects.filter(cart=cart)
        total = sum(ci.product.price * ci.quantity for ci in cart_items)

        return Response(
            {"message": "Item removed", "cart_total": total},
            status=status.HTTP_200_OK
        )



from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import CartItem, Order, OrderItem
from app.serializers import OrderSerializer


class CheckoutCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        address = request.data.get("address")

        if not address:
            return Response(
                {"error": "Address is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = CartItem.objects.filter(cart=user.cart)

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(
            user=user,
            address=address,
            total_amount=total
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # clear cart
        cart_items.delete()

        serializer = self.get_serializer(order)

        return Response(
            {
                "message": "Order placed successfully",
                "order": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Wishlist, WishlistItem
from .serializers import (
    WishlistItemSerializer,
    AddWishlistSerializer
)


class AddWishlistItemView(CreateAPIView):
    serializer_class = AddWishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

class WishlistListView(ListAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist.items.all()

class WishlistDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wishlist = get_object_or_404(Wishlist, user=self.request.user)
        return WishlistItem.objects.filter(wishlist=wishlist)
