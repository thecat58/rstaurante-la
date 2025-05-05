from django.urls import path
from app.controllers import users, mesa, menuC, plato,pedido, login,Logout,detallefactura,factura
from django.urls import path # type: ignore

urlpatterns = [
    path('login/', login.LoginView.as_view(), name='login'),
    path('api/logout/', Logout.LogoutView.as_view(), name='logout'),
    path('users/', users.UsersPerView.as_view(), name='users_per'),
    path('mesa/', mesa.Mesaclass.as_view(), name='mesas'),   
    path('mesa/<int:mesa_id>/', mesa.Mesaclass.as_view(), name='mesa_detail'),  # Para obtener, actualizar o eliminar una mesa específica
    path('mesaD/<int:mesa_id>/', mesa.Mesaclass.as_view(), name='delete_mesa'),  # Ruta para eliminar una mesa
    path('menu/', menuC.MenuView.as_view(), name='menu'),
    path('plato/', plato.PlatoView.as_view(), name='plato'),
    path('api/plato/<int:plato_id>/',  plato.PlatoView.as_view()),  # Para obtener un plato específico
    path('pedido/',pedido.PedidoView.as_view(), name='get'),  # Para obtener 
    path('pedidoU/<int:pedido_id>/', pedido.PedidoView.as_view(), name='pedido_update'),
    path('pedido/<int:pedido_id>/',pedido.PedidoView.as_view(), name='get_or_delete_pedido'),  # Para obtener o eliminar un pedido
    path('detallefactura/', detallefactura.DetalleFacturClass.as_view(), name='detallefactura_list'),  # Para GET (todos) y POST
    path('detallefactura/<int:detalle_id>/', detallefactura.DetalleFacturClass.as_view(), name='detallefactura_detail'),  # Para obtener un detalle específico
    path('detallefactura/<int:detalle_id>/', detallefactura.DetalleFacturClass.as_view(), name='delete_detalle_factura'),
    path('facturas/', factura.FacturaClass.as_view(), name='facturas'),  
    path('facturas/<int:factura_id>/', factura.FacturaClass.as_view(), name='factura_detail'),



]