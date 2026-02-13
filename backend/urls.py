# from django.contrib import admin
# from django.urls import path, re_path
# from django.conf import settings
# from django.conf.urls.static import static
# from django.views.generic import TemplateView

# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# from app.views import (
#     ResgisterView,
#     LogoutAPIView,
#     ProfileView,
#     ProductCreateView,
#     ProductDetailAPIView,
#     CategoryWiseProductView,
#     CategoryCreateView,
#     ProductUpate,
#     AddToCartAPIView,
#     ViewCartAPIView,
#     DecreaseCartItemView,
#     RemoveCartItemAPIView,
#     CheckoutCreateAPIView,
#     OrderListAPIView,
#     OrderDetailAPIView,
#     AddWishlistItemView,
#     WishlistListView,
#     WishlistDeleteView,
# )

# urlpatterns = [
#     # Admin
#     path("admin/", admin.site.urls),

#     # Auth
#     path("register/", ResgisterView.as_view()),
#     path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
#     path("logout/", LogoutAPIView.as_view()),
#     path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
#     path("profile/", ProfileView.as_view()),

#     # Products
#     path("products/create/", ProductCreateView.as_view()),
#     path("products/<int:pk>/", ProductDetailAPIView.as_view()),
#     path("products/update/<int:pk>/", ProductUpate.as_view()),
#     path("products/category-wise/", CategoryWiseProductView.as_view()),
#     path("categories/create/", CategoryCreateView.as_view()),

#     # Cart
#     path("cart/add/", AddToCartAPIView.as_view()),
#     path("cart/", ViewCartAPIView.as_view()),
#     path("cart/decrease/", DecreaseCartItemView.as_view()),
#     path("remove/<int:product_id>/", RemoveCartItemAPIView.as_view()),

#     # Orders
#     path("checkout/", CheckoutCreateAPIView.as_view()),
#     path("orders/", OrderListAPIView.as_view()),
#     path("orders/<int:pk>/", OrderDetailAPIView.as_view()),

#     # Wishlist
#     path("wishlist/add/", AddWishlistItemView.as_view()),
#     path("wishlist/", WishlistListView.as_view()),
#     path("wishlist/delete/<int:pk>/", WishlistDeleteView.as_view()),
# ]

# # ----------------------------
# # Serve media & static files in development
# # ----------------------------
# if settings.DEBUG:
#     # Media
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

#     # React static files
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

# # ----------------------------
# # Catch-all route for React frontend (must be LAST)
# # ----------------------------
# urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name='index.html'))]



from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from app.views import (
    ResgisterView,
    LogoutAPIView,
    ProfileView,
    ProductCreateView,
    ProductDetailAPIView,
    CategoryWiseProductView,
    CategoryCreateView,
    ProductUpate,
    AddToCartAPIView,
    ViewCartAPIView,
    DecreaseCartItemView,
    RemoveCartItemAPIView,
    CheckoutCreateAPIView,
    OrderListAPIView,
    OrderDetailAPIView,
    AddWishlistItemView,
    WishlistListView,
    WishlistDeleteView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # AUTH
    path("register/", ResgisterView.as_view()),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("logout/", LogoutAPIView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view()),

    # PRODUCTS
    path("products/create/", ProductCreateView.as_view()),
    path("products/<int:pk>/", ProductDetailAPIView.as_view()),
    path("products/update/<int:pk>/", ProductUpate.as_view()),
    path("products/category-wise/", CategoryWiseProductView.as_view()),
    path("categories/create/", CategoryCreateView.as_view()),

    # CART
    path("cart/add/", AddToCartAPIView.as_view()),
    path("cart/", ViewCartAPIView.as_view()),
    path("cart/decrease/", DecreaseCartItemView.as_view()),
    path("remove/<int:product_id>/", RemoveCartItemAPIView.as_view()),

    # ORDERS
    path("checkout/", CheckoutCreateAPIView.as_view()),
    path("orders/", OrderListAPIView.as_view()),
    path("orders/<int:pk>/", OrderDetailAPIView.as_view()),

    # WISHLIST
    path("wishlist/add/", AddWishlistItemView.as_view()),
    path("wishlist/", WishlistListView.as_view()),
    path("wishlist/delete/<int:pk>/", WishlistDeleteView.as_view()),
]

# ✅ Static & media (development)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# ✅ React frontend fallback (VERY IMPORTANT — always LAST)
urlpatterns += [
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]


