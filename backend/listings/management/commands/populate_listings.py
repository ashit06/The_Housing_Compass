from django.core.management.base import BaseCommand
from listings.models import Listing, PriceHistory
from decimal import Decimal
import json
from datetime import date, timedelta
import random
# from django.db import connection # No longer needed if reset_auto_increment is removed


class Command(BaseCommand):
    help = 'Create sample listings for Noida with price history data'

    def handle(self, *args, **options):
        # Clear existing data
        Listing.objects.all().delete()
        PriceHistory.objects.all().delete()
        # self.reset_auto_increment() # This line is removed for database compatibility

        # ====================================================================
        # Properties from Noida, Uttar Pradesh
        # ====================================================================
        sample_listings = [
            {
                'title': '3BHK Flat in ATS One Hamlet',
                'street_address': 'Sector 104',
                'city': 'Noida',
                'province': 'UP',
                'description': 'A premium, ready-to-move-in apartment in a well-maintained society with a clubhouse, swimming pool, and lush green spaces. Close to the Noida Expressway.',
                'current_price': Decimal('18500000.00'),  # 1.85 Cr INR
                'bedrooms': 3,
                'bathrooms': 4,
                'square_feet': 2150,
                'image_url': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
            },
            {
                'title': 'Modern 2BHK in Gaur City',
                'street_address': 'Gaur City 2, Sector 16C',
                'city': 'Greater Noida West',
                'province': 'UP',
                'description': 'An affordable and modern 2BHK in a bustling township with access to schools, hospitals, and a dedicated commercial market. Excellent connectivity.',
                'current_price': Decimal('6500000.00'),  # 65 Lakhs INR
                'bedrooms': 2,
                'bathrooms': 2,
                'square_feet': 1050,
                'image_url': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
            },
            {
                'title': 'Luxury Villa in Jaypee Greens',
                'street_address': 'Sector 128',
                'city': 'Noida',
                'province': 'UP',
                'description': 'An exclusive villa overlooking a golf course. Features a private pool, modern architecture, and high-end security. For those who desire a lavish lifestyle.',
                'current_price': Decimal('65000000.00'),  # 6.5 Cr INR
                'bedrooms': 5,
                'bathrooms': 6,
                'square_feet': 5500,
                'image_url': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
            },
            {
                'title': 'Spacious 4BHK in Mahagun Moderne',
                'street_address': 'Sector 78',
                'city': 'Noida',
                'province': 'UP',
                'description': 'A large family apartment with ample sunlight and ventilation. The society has a 3-tier security system, sports facilities, and is metro-connected.',
                'current_price': Decimal('22000000.00'),  # 2.2 Cr INR
                'bedrooms': 4,
                'bathrooms': 4,
                'square_feet': 2450,
                'image_url': 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800'
            },
            {
                'title': 'Studio Apartment for Professionals',
                'street_address': 'Sector 150',
                'city': 'Noida',
                'province': 'UP',
                'description': 'A compact and smart studio apartment perfect for working professionals. Located in Noida\'s greenest sector with excellent sports facilities and connectivity.',
                'current_price': Decimal('4500000.00'),  # 45 Lakhs INR
                'bedrooms': 1,
                'bathrooms': 1,
                'square_feet': 650,
                'image_url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
            },
        ]

        # ====================================================================
        # The rest of the script handles creating the listings
        # ====================================================================

        created_listings = []

        for listing_data in sample_listings:
            listing = Listing.objects.create(**listing_data)
            created_listings.append(listing)
            self.stdout.write(
                self.style.SUCCESS(f'Created listing: {listing.title}')
            )

        for listing in created_listings:
            num_entries = random.randint(3, 6)
            current_price = float(listing.current_price)
            price_history = []

            for i in range(num_entries):
                days_back = random.randint(30, 90) * (i + 1)
                entry_date = date.today() - timedelta(days=days_back)

                if i == 0:
                    price = current_price
                else:
                    variation = random.uniform(0.95, 1.1)
                    price = current_price * variation

                price_history.append({
                    'date': entry_date.isoformat(),
                    'price': round(price, 2)
                })

            price_history.sort(key=lambda x: x['date'])

            PriceHistory.objects.create(
                listing=listing,
                price_values=json.dumps(price_history),
                date_recorded=date.today()
            )

            self.stdout.write(
                self.style.SUCCESS(f'Created price history for: {listing.title}')
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_listings)} listings with price history'
            )
        )

    # The reset_auto_increment method is removed as it's SQLite-specific and not needed for PostgreSQL.
    # def reset_auto_increment(self):
    #     """Reset auto-increment counters for SQLite database"""
    #     with connection.cursor() as cursor:
    #         cursor.execute("DELETE FROM sqlite_sequence WHERE name='listings_listing';")
    #         cursor.execute("DELETE FROM sqlite_sequence WHERE name='listings_pricehistory';")
    #
    #     self.stdout.write(
    #         self.style.SUCCESS('Reset auto-increment counters')
    #     )