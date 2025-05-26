from rest_framework.response import Response
from app.serializers import RoleSerializer, PermissionSerializer
from rest_framework.views import APIView
from rest_framework import status
from app.modeloP import Role, Permission, RolePermission


class RoleClass(APIView):
    def get(self, request):
        """
        Obtener todos los roles con sus permisos relacionados.
        """
        try:
            roles = Role.objects.all()
            data = []
            for role in roles:
                permissions = Permission.objects.filter(rolepermission__role=role)
                data.append({
                    'id': role.id,
                    'name': role.name,
                    'description': role.description,
                    'permissions': PermissionSerializer(permissions, many=True).data
                })
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Crear un nuevo rol y asociar permisos.
        Espera: { "name": "...", "description": "...", "permissions": [id1, id2, ...] }
        """
        data = request.data
        serializer = RoleSerializer(data=data)
        if serializer.is_valid():
            role = serializer.save()
            permisos = data.get('permissions', [])
            for perm_id in permisos:
                try:
                    permiso = Permission.objects.get(id=perm_id)
                    RolePermission.objects.create(role=role, permission=permiso)
                except Permission.DoesNotExist:
                    continue
            return Response(RoleSerializer(role).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, role_id=None):
        """
        Actualizar un rol y sus permisos.
        Espera: { "name": "...", "description": "...", "permissions": [id1, id2, ...] }
        """
        if not role_id:
            return Response({'error': 'Id del rol no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return Response({'error': 'Rol no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RoleSerializer(role, data=request.data, partial=True)
        if serializer.is_valid():
            role = serializer.save()
            # Actualizar permisos
            permisos = request.data.get('permissions', None)
            if permisos is not None:
                # Eliminar permisos actuales
                RolePermission.objects.filter(role=role).delete()
                # Agregar nuevos permisos
                for perm_id in permisos:
                    try:
                        permiso = Permission.objects.get(id=perm_id)
                        RolePermission.objects.create(role=role, permission=permiso)
                    except Permission.DoesNotExist:
                        continue
            return Response(RoleSerializer(role).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
