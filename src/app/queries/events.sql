SELECT
  E.Event_ID,
  E.Event_Title,
  ET.Event_Type,
  CO.Congregation_Name,
  L.Location_Name,
  E.Meeting_Instructions,
  E.Description,
  P.Program_Name,
  C.Display_Name AS Primary_Contact,
  E.Participants_Expected,
  E.Minutes_for_Setup,
  E.Minutes_for_Cleanup,
  E.Event_Start_Date,
  E.Event_End_Date,
  E.Cancelled,
  E.Featured_On_Calendar,
  UC.Display_Name AS "Created_By",
  CONCAT((SELECT Base_URI FROM dp_Domains WHERE Domain_ID = 1), (SELECT TOP 1 Page_ID FROM dp_Pages PG WHERE PG.Display_Name = 'Events'), '/', E.Event_ID) AS "Event_Path",
  STUFF(
    (
      SELECT ', ' + R.Room_Name
      FROM Event_Rooms ER
      JOIN Rooms R ON R.Room_ID = ER.Room_ID
      WHERE ER.Event_ID = E.Event_ID AND ER.Cancelled = 0
      ORDER BY R.Room_Name
      FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, ''
  ) AS Booked_Rooms
FROM Events E
LEFT JOIN Programs P ON P.Program_ID = E.Program_ID
LEFT JOIN Contacts C ON C.Contact_ID = E.Primary_Contact
LEFT JOIN dp_Users U ON U.User_ID = E.Created_By_User
LEFT JOIN Contacts UC ON UC.Contact_ID = U.Contact_ID
LEFT JOIN Congregations CO ON CO.Congregation_ID = E.Congregation_ID
LEFT JOIN Locations L ON L.Location_ID = E.Location_ID
LEFT JOIN Event_Types ET ON ET.Event_Type_ID = E.Event_Type_ID
WHERE
  E.Event_Start_Date BETWEEN @startDate AND @endDate
ORDER BY E.Event_Start_Date;