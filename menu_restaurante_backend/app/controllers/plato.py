from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Plato, Menu
from app.serializers import PlatoSerializer

class PlatoView(APIView):
    """
    API para manejar operaciones relacionadas con Platos.
    """

    def post(self, request):
        """
        Crear un plato y relacionarlo con un menú existente.
        """
        data = request.data
        try:
            # Obtener el menú relacionado
            menu = Menu.objects.get(id_menu=data['menu_id'])

            # Crear el plato
            plato = Plato.objects.create(
                nombre=data['nombre'],
                descripcion=data.get('descripcion', ''),
                precio=data['precio'],
                menu_id_menu=menu
            )

            # Serializar y devolver el plato creado
            serializer = PlatoSerializer(plato)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Menu.DoesNotExist:
            return Response({'error': 'Menú no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, plato_id=None):
        """
        Obtener uno o todos los platos.
        """
        try:
            if plato_id:
                # Obtener un plato específico
                plato = Plato.objects.get(id_plato=plato_id)
                serializer = PlatoSerializer(plato)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Obtener todos los platos
                platos = Plato.objects.all()
                serializer = PlatoSerializer(platos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Plato.DoesNotExist:
            return Response({'error': 'Plato no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, plato_id):
        """
        Actualizar un plato existente.
        """
        data = request.data
        try:
            # Obtener el plato a actualizar
            plato = Plato.objects.get(id_plato=plato_id)

            # Actualizar los campos del plato
            plato.nombre = data.get('nombre', plato.nombre)
            plato.descripcion = data.get('descripcion', plato.descripcion)
            plato.precio = data.get('precio', plato.precio)

            # Actualizar el menú relacionado si se proporciona
            if 'menu_id' in data:
                menu = Menu.objects.get(id_menu=data['menu_id'])
                plato.menu_id_menu = menu

            plato.save()

            # Serializar y devolver el plato actualizado
            serializer = PlatoSerializer(plato)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Plato.DoesNotExist:
            return Response({'error': 'Plato no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Menu.DoesNotExist:
            return Response({'error': 'Menú no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, plato_id):
        """
        Eliminar un plato existente.
        """
        try:
            # Obtener el plato a eliminar
            plato = Plato.objects.get(id_plato=plato_id)
            plato.delete()
            return Response({'message': 'Plato eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Plato.DoesNotExist:
            return Response({'error': 'Plato no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)