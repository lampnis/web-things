from django.shortcuts import render

# Create your views here.
def index(request):
    """
    Renders the main Maxwell's equations tutorial page.
    Passes an empty context as the content is static within the template.
    """
    context = {}
    return render(request, 'equations_app/index.html', context)
