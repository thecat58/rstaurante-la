from django.urls import path
from app.controllers import users, mesa, menuC, plato,pedido, login,Logout,detallefactura

urlpatterns = [
    path('login/', login.LoginView.as_view(), name='login'),
    path('api/logout/', Logout.LogoutView.as_view(), name='logout'),
    path('users/', users.UsersPerView.as_view(), name='users_per'),
    path('mesa/', mesa.Mesaclass.as_view(), name='mesas'),
    path('menu/', menuC.MenuView.as_view(), name='menu'),
    path('plato/', plato.PlatoView.as_view(), name='plato'),
    path('pedido/', pedido.PedidoView.as_view(), name='create_pedido'),  # Para crear un pedido
    path('pedido/<int:pedido_id>/',pedido.PedidoView.as_view(), name='get_or_delete_pedido'),  # Para obtener o eliminar un pedido
    path('detallefactura/', detallefactura.detallefacturaView.as_view(), name='detallefactura'),

]