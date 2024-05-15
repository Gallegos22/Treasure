-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

 insert into "customers"
   ("name", "address","email","phoneNumber","userId")
   values
     ('Eduardo Gallegos', '123 Sesame Street', 'gallegoseduardo414@gmail.com', '323 672 5787', 1),
     ('Anakin Skywalker', 'Tatooine', 'skyguy@gmail.com', '342 645 8677', 2),
     ('Luke Skywalker', 'Tatooine', 'shortStormtrooper@gmail.com', '424 520 7752', 3),
     ('Obiwan Kenobi', 'Stewjon', 'theGOAT@gmail.com', '389 658 4395', 4),
     ('Ashoka Tano', 'Shili', 'snips@gmail.com', '538 878 5482', 5);

insert into "jobs"
   ("jobDetails","quantity","perCost","dateOfJob","customerId", "userId")
   values
    ('Box Truck wash B-07 B-03', '2', '95', '4/22/2024', 1 , 1),
    ('Sprinter exterior waterless wash', '33', '25', '4/22/2024', 2 ,2 ),
    ('S 12 Mercedes Interior Deatail/Wash', '1', '120', '4/13/2024', 3, 3 ),
    ('Sprinter exterior waterless wash', '30', '25', '3/10/2024', 4 , 4),
    ('Sprinter exterior waterless wash', '13' , '25', '3/19/2024', 5 , 5);
