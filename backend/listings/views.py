from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Listing
from .serializer import ListingSerializer
import google.generativeai as genai
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt


#----------------------------- API Views for Listings -----------------------------#


# List all listings (GET only)
class ListingListView(generics.ListAPIView):
    """
    API view for listing all housing listings (GET requests only).
    Frontend can call: GET /api/listings/
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

# Create new listing (POST only)
class ListingCreateView(generics.CreateAPIView):
    """
    API view for creating new housing listings (POST requests only).
    Frontend can call: POST /api/listings/create/
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

# Update existing listing (PUT only)
class ListingUpdateView(generics.UpdateAPIView):
    """
    API view for updating existing listings (PUT requests only).
    Frontend can call: PUT /api/listings/1/update/
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

# Delete listing (DELETE only)
class ListingDeleteView(generics.DestroyAPIView):
    """
    API view for deleting listings (DELETE requests only).
    Frontend can call: DELETE /api/listings/1/delete/
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

class ListingDetailView(generics.RetrieveAPIView):
    """
    API view for retrieving a single listing by its ID (GET requests only).
    Frontend can call: GET /api/listings/1/
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


#----------------------------- Custom Search API View -----------------------------#


# Custom API view for filtering listings
@api_view(['GET'])  # This decorator specifies that this view only accepts GET requests
def search_listings(request):
    """
    Handles GET requests to search for listings, optionally filtering by city.
    Query Parameters:
        city (str, optional): The city name to filter listings by. Performs a case-insensitive search.
    Returns:
        Response: A JSON response containing a list of serialized listings matching the search criteria.
    """
    city = request.GET.get('city')
    
    listings = Listing.objects.all()
    
    if city:
        listings = listings.filter(city__icontains=city)
    
    serializer = ListingSerializer(listings, many=True)
    if listings.exists():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(
            {"message": "No listings found matching the search criteria."}, 
            status=status.HTTP_404_NOT_FOUND
        )

#----------------------------- Chatbot API View -----------------------------#

# Configure the Gemini API with your key
# IMPORTANT: For production, use environment variables, not hardcoded keys!
GEMINI_API_KEY = 'AIzaSyCx6qf21kiUj40eWlfk7ss9dyVu5KoP798'
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

@csrf_exempt
def chatbot_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message')
            property_context = data.get('property_context', {})

            prompt = f"""
            You are 'Compass AI', the intelligent assistant for 'The Housing Compass', a real estate platform focused on properties.
            Your persona is helpful, professional, and slightly formal.
            Your primary goal is to answer user questions based ONLY on the information provided below. Do not invent information.

            --- KNOWLEDGE BASE ---

            ## About The Housing Compass App:
            - **Functionality**: Users can search for properties, view property details, and filter results by price range and number of bedrooms.
            - **Investment Insights Feature**: On each property's detail page, there is an "Investment Insights" button. When a logged-in user clicks it, a detailed analysis of the property's investment potential is shown.
            - **Founder**: The founder of The Housing Compass is Arpit Agrahari.

            ## Available Property Listings:

            **Property 1:**
            - **Title**: 3BHK Flat in ATS One Hamlet
            - **Location**: Sector 104, Noida, UP
            - **Price**: ₹1,85,00,000 (1.85 Cr)
            - **Details**: 3 Bedrooms, 4 Bathrooms, 2150 sqft.
            - **Description**: A premium, ready-to-move-in apartment in a well-maintained society with a clubhouse, swimming pool, and lush green spaces. Close to the Noida Expressway.

            **Property 2:**
            - **Title**: Modern 2BHK in Gaur City
            - **Location**: Gaur City 2, Sector 16C, Greater Noida West, UP
            - **Price**: ₹65,00,000 (65 Lakhs)
            - **Details**: 2 Bedrooms, 2 Bathrooms, 1050 sqft.
            - **Description**: An affordable and modern 2BHK in a bustling township with access to schools, hospitals, and a dedicated commercial market. Excellent connectivity.

            **Property 3:**
            - **Title**: Luxury Villa in Jaypee Greens
            - **Location**: Sector 128, Noida, UP
            - **Price**: ₹6,50,00,000 (6.5 Cr)
            - **Details**: 5 Bedrooms, 6 Bathrooms, 5500 sqft.
            - **Description**: An exclusive villa overlooking a golf course. Features a private pool, modern architecture, and high-end security. For those who desire a lavish lifestyle.

            **Property 4:**
            - **Title**: Spacious 4BHK in Mahagun Moderne
            - **Location**: Sector 78, Noida, UP
            - **Price**: ₹2,20,00,000 (2.2 Cr)
            - **Details**: 4 Bedrooms, 4 Bathrooms, 2450 sqft.
            - **Description**: A large family apartment with ample sunlight and ventilation. The society has a 3-tier security system, sports facilities, and is metro-connected.

            **Property 5:**
            - **Title**: Studio Apartment for Professionals
            - **Location**: Sector 150, Noida, UP
            - **Price**: ₹45,00,000 (45 Lakhs)
            - **Details**: 1 Bedroom, 1 Bathroom, 650 sqft.
            - **Description**: A compact and smart studio apartment perfect for working professionals. Located in Noida's greenest sector with excellent sports facilities and connectivity.

            --- END OF KNOWLEDGE BASE ---

            Based on the information above, please answer the following user query. If the question is outside of your knowledge base, politely state that you can only answer questions about the properties and features on The Housing Compass.
            
            Current Property Context (if any):
            - Title: {property_context.get('title', 'N/A')}
            - Price: ₹{property_context.get('price', 'N/A')}
            - Location: {property_context.get('location', 'N/A')}

            User's question: "{user_message}"
            
            Your answer:
            """

            response = model.generate_content(prompt)
            return JsonResponse({'reply': response.text})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Invalid request method'}, status=400)