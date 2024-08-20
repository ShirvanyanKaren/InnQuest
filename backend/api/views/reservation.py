from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers.reservation import ReservationSerializer
from api.models import Reservation, Room, Hotel
from django.http import JsonResponse, HttpResponse
import smtplib, ssl, os, datetime as dt
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from django.db.models import Count
from rest_framework.response import Response
from dotenv import load_dotenv


load_dotenv()


class ReservationAPIView(mixins.ListModelMixin,
                         mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         generics.GenericAPIView):
    """
    Date: (August 8th, 2024)
    Author: Karen Shirvanyan
    Description: This class is a view for the Reservation model. It allows users to create a new reservation, list all reservations, update a reservation, and delete a reservation.
    """
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    email_body = '''
    <html>
        <head>
            <title>Reservation Confirmation</title>
            <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700&display=swap" rel="stylesheet">
            <style>
                body {{
                    font-family: "Nunito", sans-serif;
                    margin: 0;
                    padding: 0;
                }}
                body {{
                    background-color: #f4f6f9;
                }}
                .container {{
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                    border: 1px solid #e1e1e1;
                }}
                h2 {{
                    font-size: 24px;
                    font-weight: bold;
                }}
                h3 {{
                    font-size: 20px;
                    font-weight: bold;
                }}
                p {{
                    font-size: 16px;
                    font-weight: bold;
                }}
                .header {{
                    background-color: #004aad;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px 0 rgba(0,0,0,0.3);
                    margin-bottom: 20px;
                    height: fit-content;
                    z-index: 1000;
                }}
                .inn {{
                    color: #004aad;
                    background-color: #f4f6f9;
                    border-radius: 5px;
                    margin-right: 1px;
                }}
                .content {{
                    padding: 20px;
                    border-radius: 5px;
                }}
                .image {{
                    display: block;
                    margin: 20px auto;
                    width: 400px;
                    object-fit: cover;
                }}
                .details {{
                    margin: auto;
                    width:40%;
                    text-align: left;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1> <span
                        class="inn">inn</span>Quest<span>.com</span>
                </div>
                <div class="content">
                    <h2>Thank you for booking with us!</h2>
                    <img src="{image_url}" alt="Hotel"
                    class="image" />
                    <h3>Your reservation at {hotel_name} has been confirmed.</h3>
                    <div class="details">
                    <p>Check-in: {check_in_date} at 3:00 PM</p>
                    <p>Check-out: {check_out_date} at 11:00 AM</p>
                    <p>Room Type: {roomtype}</p>
                    <p>Number of Rooms: {num_of_rooms}</p>
                    <p>Total Price: {total_price}</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    '''


    def get_permissions(self):
        """
        @return: List of permissions
        Description: This method returns a list of permissions based on the request method.
        """
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def list(self, request, *args, **kwargs):
        if request.user.is_superuser:
            if 'start' in request.query_params and 'end' in request.query_params:
                reservations_by_month = self.bookings_by_months(request)
                return Response(reservations_by_month)
            if 'revenue_start' in request.query_params:
                revenue_by_month = self.booking_revenue_by_month(request)
                return Response(revenue_by_month)
            else:
                return self.list_all(request, *args, **kwargs)
        else:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

    
    
    def bookings_by_months(self, request):
        """
        @param request: Request object
        @return: List of reservations
        @precondition: User is superuser
        Description: This method returns the number of reservations made by month.
        """
        query_set = Reservation.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        reservations = query_set.filter(check_in_date__gte=start)
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        reservations_by_month = {}
        for reservation in reservations:
            month = reservation.check_in_date.month
            month_name = months[int(month) - 1]
            reservations_by_month[month_name] = reservations_by_month.get(month_name, {})
            reservations_by_month[month_name]['reservations'] = reservations_by_month.get(month_name, {}).get('reservations', 0) + 1
            reservations_by_month[month_name]['revenue'] = reservations_by_month.get(month_name, {}).get('revenue', 0) + reservation.reservation_price
        reservations_by_month = dict(sorted(reservations_by_month.items(), key=lambda x: months.index(x[0])))
        return reservations_by_month
    
    def get_queryset(self):
        """
        @return: List of reservations
        @precondition: hotel_id: int, check_in_date: str, check_out_date: str
        @exception: If user is authenticated, return list of their reservations else return list of all reservations
        Description: This method returns a list of reservations based on the user's authentication status.
        """
        user = self.request.user
        query_set = Reservation.objects.all()
        hotel_id = self.request.query_params.get('hotel_id')
        check_in_date = self.request.query_params.get('check_in_date')
        check_out_date = self.request.query_params.get('check_out_date')
        if user.is_authenticated:
            reservations = query_set.filter(email=user.email, guest=None)
            for reservation in reservations:
                reservation.guest = user
                reservation.save()
            return query_set.filter(guest=user)
        else:
            query_set = query_set.filter(hotel=hotel_id) if hotel_id else query_set
            query_set = query_set.filter(check_in_date__gte=check_in_date, check_out_date__lte=check_out_date) if check_in_date and check_out_date else query_set
        return query_set
    
    def check_availability(self, request_data):
        """
        @param request_data: dict
        @return: int
        @precondition: hotel: int, room: int, check_in_date: str, check_out_date: str, num_of_rooms: int, email: str
        @exception: If there are not enough rooms available, return an error message
        Description: This method checks if there are enough rooms available based on the hotel, room, check in date, check out date, and number of rooms.
        """
        reservations = Reservation.objects.filter(
            hotel=request_data['hotel'],
            room=request_data['room'],
            check_in_date__lte=request_data['check_out_date'],
            check_out_date__gte=request_data['check_in_date']
        )
        reserved_rooms = 0
        for reservation in reservations:
            reserved_rooms += reservation.num_of_rooms
        room = Room.objects.get(id=request_data['room'])
        return room.quantity - reserved_rooms
    
    def send_email(self, reservation):
        """
        @param reservation: Reservation object
        @return: None
        Description: This method sends an email to the user confirming their reservation.
        """
        hotel = Hotel.objects.get(id=reservation.hotel.id)
        hotel_name = hotel.name
        image_url = hotel.image_urls[0]
        check_in_date = dt.datetime.strptime(reservation.check_in_date, '%Y-%m-%d').strftime('%B %d, %Y')
        check_out_date = dt.datetime.strptime(reservation.check_out_date, '%Y-%m-%d').strftime('%B %d, %Y')
        port = 465
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(os.getenv("SMTP_HOST"), port,context=context) as server:
            server.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASSWORD"))
            msg = MIMEMultipart()
            msg['From'] = os.getenv("SMTP_EMAIL")
            msg['To'] = reservation.email
            msg['Subject'] = "Reservation Confirmation"
            email_body = self.email_body.format(image_url=image_url, hotel_name=hotel_name, check_in_date=check_in_date, check_out_date=check_out_date, roomtype=reservation.room.type, num_of_rooms=reservation.num_of_rooms, total_price=f"${reservation.reservation_price:.2f}")
            msg.attach(MIMEText(email_body, 'html'))
            server.sendmail(os.getenv("SMTP_EMAIL"), reservation.email, msg.as_string
            ())


    def post(self, request, *args, **kwargs):
        check_availability = self.check_availability(request.data)
        if check_availability < request.data['num_of_rooms']:
            return JsonResponse({'error': 'Not enough rooms available'}, status=409)
        else:
            reservation = Reservation.objects.create(
                hotel_id=request.data['hotel'],
                room_id=request.data['room'],
                check_in_date=request.data['check_in_date'],
                reservation_price=request.data['reservation_price'],
                check_out_date=request.data['check_out_date'],
                num_of_rooms=request.data['num_of_rooms'],
                email=request.data['email'] if not self.request.user.is_authenticated else self.request.user.email
            )
            self.send_email(reservation)
            return JsonResponse({'message': 'Reservation created successfully', 'reservation': ReservationSerializer(reservation).data}, status=201)

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            # If a primary key is provided, use the RetrieveModelMixin
            return self.retrieve(request, *args, **kwargs)
        else:
            # If no primary key is provided, list all reservations
            return self.list(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        @param request: Request object
        @precondition: id: int
        @exception: If user is authenticated, update reservation
        @return: HttpResponse object
        """
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        @param request: Request object
        @precondition: id: int
        @return: HttpResponse object
        @exception: If user is authenticated, delete reservation
        """
        return self.destroy(request, *args, **kwargs)
    

    def perform_create(self, serializer):
        """
        @param serializer: ReservationSerializer object
        @return: None
        @exception: If user is authenticated, save reservation to user
        Description: This method saves the reservation to the user if they are authenticated.
        """
        user = self.request.user
        serializer.save(guest=user)

    def perform_update(self, serializer):
        """
        @param serializer: ReservationSerializer object
        @return: None
        @exception: If user is authenticated, save updated reservation to user
        Description: This method saves the updated reservation to the user if they are authenticated.
        """
        user = self.request.user
        serializer.save(guest=user)