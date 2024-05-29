SELECT
  Event_ID,
  Event_Title,
  ET.Event_Type,
  CO.Congregation_Name,
  L.Location_Name,
  Meeting_Instructions,
  E.Description,
  P.Program_Name,
  C.Display_Name,
  Participants_Expected,
  Minutes_for_Setup,
  Minutes_for_Cleanup,
  Event_Start_Date,
  Event_End_Date,
  Cancelled,
  Featured_On_Calendar
FROM Events E
LEFT JOIN Programs P ON P.Program_ID = E.Program_ID
LEFT JOIN Contacts C ON C.Contact_ID = E.Primary_Contact
LEFT JOIN Congregations CO ON CO.Congregation_ID = E.Congregation_ID
LEFT JOIN Locations L ON L.Location_ID = E.Location_ID
LEFT JOIN Event_Types ET ON ET.Event_Type_ID = E.Event_Type_ID
WHERE
  Event_Start_Date BETWEEN @startDate AND @endDate
ORDER BY Event_Start_Date;
