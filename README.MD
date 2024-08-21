# innQuest Hotels

| Badge Name | Badge | Link
| --- | --- | ---
| AWS | ![badge](https://img.shields.io/badge/AWS-✓-orange) | [AWS](https://aws.amazon.com/)
| Bootstrap | ![badge](https://img.shields.io/badge/Bootstrap-✓-blueviolet) | [Bootstrap](https://getbootstrap.com/)
| Sass | ![badge](https://img.shields.io/badge/Sass-✓-pink) | [Sass](https://sass-lang.com/)
| React | ![badge](https://img.shields.io/badge/React-✓-blue) | [React](https://reactjs.org/)
| Vite | ![badge](https://img.shields.io/badge/Vite-✓-brightgreen) | [Vite](https://vitejs.dev/)
| Django | ![badge](https://img.shields.io/badge/Django-✓-green) | [Django](https://www.djangoproject.com/)
| Stripe | ![badge](https://img.shields.io/badge/Stripe-✓-blue) | [Stripe](https://stripe.com/)
| Google | ![badge](https://img.shields.io/badge/Google-✓-red) | [Google](https://www.google.com/)
| JWT | ![badge](https://img.shields.io/badge/JWT-✓-yellow) | [JWT](https://jwt.io/)
| Chart.js | ![badge](https://img.shields.io/badge/Chart.js-✓-orange) | [Chart.js](https://www.chartjs.org/)
| Axios | ![badge](https://img.shields.io/badge/Axios-✓-darkred) | [Axios](https://axios-http.com/)

## Description

InnQuest hotels is a hotel reservation system with integrations made for admin and customers wanting to reserve hotels. Customers can create, update, and and cancel reservations for hotels they search for through  filters like amenities, price,and location. The admin panel includes visualzied data for the company's performance. This project is a React + Django web app with the integration of various technologies such as aws-sdk, google geolocation, sass, bootstrap, vite, stripe, and more.

[Deployed Site](https://innquest.lol)

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup and Deployment](#setup-and-deployment)
* [Key Features](#key-features)
* [Contributions](#contributions)
* [Credits](#credits)
* [Tests](#tests)
* [License](#license)
* [Questions](#questions) 

## Installation

Before installing, esnure that you have [NodeJS](https://nodejs.org/en/download/package-manager), [Python](https://www.python.org/downloads/release/python-3125/), and [PostgreSQL](https://www.postgresql.org/download/) (if using locally) installed. 

```git clone git@github.com:ShirvanyanKaren/InnQuest.git```

To install first clone the repository from github. Then open the project in VS code, or IDE of your choice and run the command npm install which will install all the dependencies for python venv for the backend and react frontend. 

## Setup and Deployment 

To use the project, set up a .env file with the following environments for your frontend and backend: Make sure you have Postgresql installed if you are using a local database and input the listed details above.


### Environment Variables
For both local and remote use, you will need to setup the following environmental variables in a .env file.

#### Frontend
```
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_AWS_S3_BUCKET_NAME=your_aws_s3_bucket_name
VITE_AWS_S3_REGION=your_bucket_region
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

#### Backend
```
DB_NAME='your_db_name'
DB_USER='your_user'
DB_PASSWORD='your_password'
DB_HOST='localhost'
DB_PORT='5432'
STRIPE_API_KEY='your_stripe_key'
STRIPE_SUCCESS_URL='https://example.com/success'
STRIPE_CANCEL_URL='https://example.com/'
SMTP_HOST='smtp.gmail.com'
SMTP_PORT=465
SMTP_EMAIL=example@gmail.com
SMTP_PASSWORD='your_smtp_password'
```

If you plan on deploying, you can serve the vite static dist folder and backend server seperately using [Netlify](https://www.netlify.com/) and/ or [Heroku](https://www.heroku.com/) or as one project with [Choreo](https://choreo.dev/). 

For deploying the frontend, make sure to specify the run and build command in your settings on the hosting site. With vite, it's npm run build.
```json
"build": "vite build",
```

For deploying the backend, if you are using Heroku add the following files
### runtime.txt
```txt
python-3.11.5
```

### Procfile
```yaml
web: gunicorn backend.wsgi:application --log-file - 
```

## Key Features

### Model View Controller
![MVC](/images/MVC.png)
The Model View Controller (MVC) design patter is utilized in the project to acconmplish the above user stories and features.



### Model
Our models are represented in our Postgresql database, where we can perform CRUD operations based on the actions of the client enforced by the 
```py
class Hotel(models.Model):
    """  
    Hotel
    07/24/2024
    Karen Shirvanyan & Robert Paronyan
    Hotel model that will be used for DB, backend and front end. This defines what attributes the Hotel class contains

    """
    name = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100, default=None)
    state= models.CharField(max_length=100, default=None)
    city = models.CharField(max_length=100, default=None)
    amenities = ArrayField(models.CharField(max_length=100, blank=True, null=True), default=list)
    description = models.TextField(default=None, null=True)
    country = models.CharField(max_length=100, default=None)
    image_urls = ArrayField(models.CharField(max_length=300), default=list)

```

### Views
The router below demonstrates our views via React DOM (Document Object Model), representing the entire UI displayed to the client.
```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage/>,
    children : [
      {
        indexes: true, 
        path: '/',
        element: <Home />
      },
      {
        path: '/search',
        element: <Hotels />
      },
      ...
    ]
  }
]
);

```

### Controller
The controller is demonstrated below as our Django API, enabling the client to make HTTP requests like ```GET, PUT, DELETE, POST, HEAD```. The Hotel API class below demonstrates such methods via Object Oriented design.
```py
class HotelAPIView(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):
     queryset = Hotel.objects.all()
     serializer_class = HotelSerializer 
     ...
     def post(self, request, *args, **kwargs):
        if request.user.is_superuser:
            self.create(request, *args, **kwargs)
            return Response({'message': 'Hotel created successfully'})
        else:
            return Response({'message': 'You are not authorized to create a hotel'}, status=403)
    
     def get(self, request, *args, **kwargs):
          return self.list(request, *args, **kwargs)
    
     def delete(self, request, *args, **kwargs):
          if request.user.is_superuser:
               self.destroy(request, *args, **kwargs)
               return Response({'message': 'Hotel deleted successfully'})
          else:
               return Response({'message': 'You are not authorized to delete this hotel'}, status=403)

```

### MVC in the form of a User Story
| ```As a user``` | ```I want to be able to search and filter hotels``` | ```So that I can find the best hotel for my preferences``` |
| --- | --- | --- |
### Searching Hotel
The user can choose the search for hotels given the name of the city or state that the hotel is located in and specify the check-in, check-out, and number of rooms.

![Searching](/images/Searching.png)

Client makes a request to get hotels based on the search parameters they enters. This request is handled by the **Controller**, in this case the **Hotel API controller**.
```js
 export const getHotels= async (params) => {
    try {
        const response = await api.get("/api/hotel/", {
            params: params
        });
        return response;
    } catch (error) {
        return error;
    }
}
```

Parameters entered by client accessed through URL.

```jsx
  const [search, setSearch] = useState({
    query: params.get("query") || "",
    check_in: params.get("check_in") || "",
    check_out: params.get("check_out") || "",
    rooms: params.get("rooms") || 1,
  });
```

### Filtering Hotels
The user can then filter the hotels based on services like the amenities offered or by price of the rooms.
![Filtering](/images/Filtering.png)

The client request is handled by the controller which accesses the **Model**, in this case the **Hotel model**, and returns a response based on the client's request parameters.
```py
     def get_queryset(self):
          """
          @return: List of hotels
          Description: This method returns a list of hotels based on the query params.
          """
          params = self.request.query_params
          if params.get('hotel_id'):
               queryset = self.get_by_id(params.get('hotel_id'))
          elif params.get('query'):
            #hotel model below is accessed within the Hotel Controller to filter and return appropriate response to client based on their request params. 
               queryset = Hotel.objects.filter(city__icontains=params.get('query')) | Hotel.objects.filter(state__icontains=params.get('query'))
               if params.get('amenities'):
                    amenities = params.get('amenities').split(',')
                    queryset = queryset.filter(amenities__contains=amenities)
          else:
               queryset = Hotel.objects.all()
          return queryset if queryset.exists() else Hotel.objects.none()
```



### Choosing Hotel
The user can then choose the hotel they want to stay at or view and are then presented with a list of rooms offered at the hotel.
![Choosing](/images/Choosing.png)

After the client requests a certain hotel and its listed rooms, this request is handled by the **Hotel API controller** that returns said response by filtering through the models based on Primary Key (PK). The client's request then returns a response that contains data that is then presented to the client as a **View**.

```jsx
  useEffect(() => {
    const hotelId = window.location.pathname.split("/")[2];
    const params = new URLSearchParams(location.search);
    params.set("hotel_id", hotelId);
    setHotelId(hotelId);
    getHotelRooms(params).then((response) => {
      setRooms(response?.data);
      setLoading(false);
    });
  }, [params]);
...
    return (
    <>
    {rooms.map(room => (
      <div className="col-md-4" key={room.id}>
        <div className="card mt-3">
          <ImagesSlider images={room.room_images} />
          <div className="card-body" key={room.id}>
            <h5 className="card-title">{room.type}</h5>
            <div className="d-flex flex-column">
            <ToolTip amenity={"Bed"} description={`${room.beds} ${room.bed_type} ${room.beds > 1 ? "Beds" : "Bed"}`} />
            <ToolTip amenity={"Guests"} description={`Sleeps ${room.sleeps}`} />
            <ToolTip amenity={"Footage"} description={`${room.footage} sq ft`} />
            </div>
            ...
            </div>
            </div>
        </div>
    ))})

```

        
## Contributions 
        
This project was developed by Karen Shirvanyan, Robert Paronyan, Porfirio Tavira, and Simran Shetye for our CSUN Comp 380 class;

## Credits

Credits to all team members as well as professor Abhishek Verma who was our instructor for this project and gave us the initial idea.


## Tests

We performed tests on the website to check for vulnerabilites in our Django API. This was done through Django Rest Frameworks built in unit test module. Within our tests, we checked for vulnerabilites in methods of classes like HotelView, RoomView, and ReservationView.
        
## License 
![badge](https://img.shields.io/badge/license-MIT-blue.svg)


## Questions 

* Check out my other projects on my [my Github](https://github.com/ShirvanyanKaren)
* For any additional questions or concerns, please email me at kshirvanyan2000@gmail.com