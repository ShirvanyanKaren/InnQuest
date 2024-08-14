from django.http import JsonResponse
from rest_framework import generics
from rest_framework.permissions import AllowAny
import stripe
import os
from dotenv import load_dotenv

load_dotenv()

class StripeCheckout(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        stripe.api_key = os.getenv('STRIPE_API_KEY')

        product = stripe.Product.create(
            name=f'{data["hotel_name"]} Reservation',
            images=[data['image_url']]
        )
        price = stripe.Price.create(
            unit_amount=int(data['reservation_price'] * 100),
            currency='usd',
            product=product.id
        )
        
        session = stripe.checkout.Session.create(
            success_url=os.getenv('STRIPE_SUCCESS_URL'),
            line_items=[
                {
                    'price': price.id,
                    'quantity': 1
                }
            ],
            mode="payment",
            cancel_url=f"{os.getenv('STRIPE_CANCEL_URL')}rooms/{data['hotel']}?check_in={data['check_in_date']}&check_out={data['check_out_date']}&rooms={data['num_of_rooms']}"
        )
        return JsonResponse({'url': session.url})