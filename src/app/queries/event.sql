SELECT

  E.Event_ID,
  E.Event_Title,
  ET.Event_Type,
  CO.Congregation_Name,
  L.Location_Name,
  L.Location_ID,
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
  VL.Visibility_Level,
  UC.Display_Name AS "Created_By",
  CONCAT(
    (SELECT Base_URI FROM dp_Domains WHERE Domain_ID = 1),
    (SELECT TOP 1 Page_ID FROM dp_Pages PG WHERE PG.Display_Name = 'Events'),
    '/', E.Event_ID
  ) AS Event_Path,
  COALESCE((
    SELECT DISTINCT
      B.Building_ID,
      B.Building_Name
    FROM Event_Rooms ER
    JOIN Rooms R ON R.Room_ID = ER.Room_ID
    JOIN Buildings B ON B.Building_ID = R.Building_ID
    WHERE ER.Event_ID = E.Event_ID AND ER.Cancelled = 0
    FOR JSON PATH
  ), '[]') AS Booked_Buildings,
  COALESCE((
    SELECT DISTINCT
      R.Room_ID,
      R.Room_Name,
      R.Building_ID
    FROM Event_Rooms ER
    JOIN Rooms R ON R.Room_ID = ER.Room_ID
    WHERE ER.Event_ID = E.Event_ID AND ER.Cancelled = 0
    ORDER BY R.Room_Name
    FOR JSON PATH
  ), '[]') AS Booked_Rooms,
  COALESCE((
    SELECT DISTINCT
      S.Service_Name,
      C.Display_Name AS 'Service_Contact',
      ES._Approved AS 'Approved'
    FROM Event_Services ES
    JOIN Servicing S ON S.Service_ID = ES.Service_ID
    JOIN Contacts C ON C.Contact_ID = S.Contact_ID
    WHERE ES.Event_ID = E.Event_ID AND ES.Cancelled = 0
    ORDER BY S.Service_Name
    FOR JSON PATH
  ), '[]') AS Requested_Services,
  COALESCE((
    SELECT DISTINCT
      EQ.Equipment_Name,
      EE.Quantity,
      EE._Approved AS 'Approved'
    FROM Event_Equipment EE
    JOIN Equipment EQ ON EQ.Equipment_ID = EE.Equipment_ID
    WHERE EE.Event_ID = E.Event_ID AND EE.Cancelled = 0
    ORDER BY EQ.Equipment_Name
    FOR JSON PATH
  ), '[]') AS Requested_Equipment
FROM Events E
LEFT JOIN Programs P ON P.Program_ID = E.Program_ID
LEFT JOIN Contacts C ON C.Contact_ID = E.Primary_Contact
LEFT JOIN dp_Users U ON U.User_ID = E.Created_By_User
LEFT JOIN Contacts UC ON UC.Contact_ID = U.Contact_ID
LEFT JOIN Congregations CO ON CO.Congregation_ID = E.Congregation_ID
LEFT JOIN Locations L ON L.Location_ID = E.Location_ID
LEFT JOIN Event_Types ET ON ET.Event_Type_ID = E.Event_Type_ID
LEFT JOIN Visibility_Levels VL ON VL.Visibility_Level_ID = E.Visibility_Level_ID

WHERE E.Event_ID = @Event_ID