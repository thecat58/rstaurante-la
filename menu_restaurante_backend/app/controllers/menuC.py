from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Menu, Plato
from app.serializers import MenuSerializer

class MenuView(APIView):
    """
    API para manejar operaciones relacionadas con Menús.
    """

    def post(self, request):
        """
        Crear un menú y agregar platos relacionados.
        """
        data = request.data
        try:
            # Crear el menú
            menu = Menu.objects.create(
                nombre=data['nombre'],
                descripcion=data.get('descripcion', '')
            )

            # Agregar platos al menú
            platos = data.get('platos', [])
            for plato_data in platos:
                Plato.objects.create(
                    nombre=plato_data['nombre'],
                    descripcion=plato_data.get('descripcion', ''),
                    precio=plato_data['precio'],
                    menu_id_menu=menu
                )

            # Serializar y devolver el menú creado
            serializer = MenuSerializer(menu)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, menu_id=None):
        """
        Obtener todos los menús o un menú específico junto con sus platos relacionados.
        """
        try:
            if menu_id:
                # Obtener un menú específico
                menu = Menu.objects.get(id_menu=menu_id)
                serializer = MenuSerializer(menu)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Obtener todos los menús
                menus = Menu.objects.all()
                serializer = MenuSerializer(menus, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Menu.DoesNotExist:
            return Response({'error': 'Menú no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, menu_id):
        """
        Actualizar un menú existente.
        """
        data = request.data
        try:
            # Obtener el menú a actualizar
            menu = Menu.objects.get(id_menu=menu_id)

            # Actualizar los campos del menú
            menu.nombre = data.get('nombre', menu.nombre)
            menu.descripcion = data.get('descripcion', menu.descripcion)
            menu.save()

            # Actualizar los platos relacionados si se proporcionan
            if 'platos' in data:
                # Eliminar los platos existentes relacionados con el menú
                Plato.objects.filter(menu_id_menu=menu).delete()

                # Crear los nuevos platos
                for plato_data in data['platos']:
                    Plato.objects.create(
                        nombre=plato_data['nombre'],
                        descripcion=plato_data.get('descripcion', ''),
                        precio=plato_data['precio'],
                        menu_id_menu=menu
                    )

            # Serializar y devolver el menú actualizado
            serializer = MenuSerializer(menu)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Menu.DoesNotExist:
            return Response({'error': 'Menú no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, menu_id):
        """
        Eliminar un menú existente.
        """
        try:
            # Obtener el menú a eliminar
            menu = Menu.objects.get(id_menu=menu_id)
            menu.delete()
            return Response({'message': 'Menú eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Menu.DoesNotExist:
            return Response({'error': 'Menú no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)