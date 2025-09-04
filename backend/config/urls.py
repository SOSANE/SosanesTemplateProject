"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, re_path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    re_path(r'^$', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    re_path(r'^api/schema/', SpectacularAPIView.as_view(), name='schema'),
    re_path(r'^api/admin/', admin.site.urls),
    re_path(r"^api/auth/", include("djoser.urls")),
    re_path(r"^api/auth/", include("djoser.urls.authtoken")),
    re_path(r"^api/auth/", include("rest_framework.urls", namespace="rest_framework")),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
