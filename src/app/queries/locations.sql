SELECT
  L.Location_ID,
  L.Location_Name,
  (SELECT CAST(CASE WHEN L.Move_Out_Date < GETDATE() THEN 1 ELSE 0 END AS BIT)) AS 'Retired',
  COALESCE((
    SELECT
      B.Building_ID,
      B.Building_Name,
      COALESCE((
        SELECT
          R.Room_ID,
          R.Room_Name
        FROM Rooms R
        WHERE R.Building_ID = B.Building_ID AND R.Bookable = 1
        ORDER BY R.Room_Name
        FOR JSON PATH
      ), '[]') AS Rooms
    FROM Buildings B
    WHERE (B.Date_Retired IS NULL OR B.Date_Retired > GETDATE()) AND B.Location_ID = L.Location_ID
    ORDER BY B.Building_Name
    FOR JSON PATH, INCLUDE_NULL_VALUES
  ), '[]') AS Buildings
FROM Locations L