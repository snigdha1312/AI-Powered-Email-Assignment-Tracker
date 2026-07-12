from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.management import call_command
from .models import Assignment
from .serializers import AssignmentSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assignments to be viewed, edited, created, or deleted.
    """
    serializer_class = AssignmentSerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned assignments,
        by filtering against a `status` query parameter in the URL.
        """
        queryset = Assignment.objects.all().order_by('deadline')
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset

@api_view(['POST'])
def sync_emails(request):
    """
    Endpoint mapping directly to the fetch_emails management script.
    Calling this endpoint forces the backend to scrape the IMAP server.
    """
    try:
        call_command('fetch_emails')
        return Response({"status": "Sync Complete"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
