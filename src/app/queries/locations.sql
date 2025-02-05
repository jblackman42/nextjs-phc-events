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
        ORDER BY 
          CASE 
            WHEN R.Room_Name NOT LIKE '%[0-9]%' THEN 0  -- Rooms without numbers go first
            ELSE 1
          END,
          CASE 
            WHEN R.Room_Name NOT LIKE '%[0-9]%' THEN R.Room_Name  -- Sort non-numbered rooms alphabetically
            ELSE NULL
          END,
          CASE 
            WHEN PATINDEX('%[0-9][0-9][0-9]%', R.Room_Name) > 0 
            THEN CAST(
              SUBSTRING(
                R.Room_Name, 
                PATINDEX('%[0-9][0-9][0-9]%', R.Room_Name), 
                3
              ) AS INT
            )
            ELSE 999999  -- Default high number for rooms without 3-digit numbers
          END,
          R.Room_Name  -- Secondary sort by full name
        FOR JSON PATH
      ), '[]') AS Rooms
    FROM Buildings B
    WHERE (B.Date_Retired IS NULL OR B.Date_Retired > GETDATE()) AND B.Location_ID = L.Location_ID
    ORDER BY B.Building_Name
    FOR JSON PATH, INCLUDE_NULL_VALUES
  ), '[]') AS Buildings
FROM Locations L