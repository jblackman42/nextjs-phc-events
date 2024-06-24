SELECT
  L.Location_ID,
  L.Location_Name,
  (SELECT CAST(CASE WHEN L.Move_Out_Date < GETDATE() THEN 1 ELSE 0 END AS BIT)) AS 'Retired',
  STUFF(
    (
      SELECT ', ' + B.Building_Name
      FROM Buildings B
      WHERE (B.Date_Retired IS NULL OR B.Date_Retired > GETDATE()) AND B.Location_ID = L.Location_ID
      ORDER BY B.Building_Name
      FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, ''
  ) AS Buildings,
  STUFF(
    (
      SELECT ', ' + B.Building_Name + ':' + R.Room_Name
      FROM Rooms R
      JOIN Buildings B ON B.Building_ID = R.Building_ID
      WHERE (B.Date_Retired IS NULL OR B.Date_Retired > GETDATE()) AND B.Location_ID = L.Location_ID AND R.Bookable = 1
      ORDER BY B.Building_Name
      FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, ''
  ) AS Rooms
FROM Locations L