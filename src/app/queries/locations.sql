SELECT
  L.Location_ID,
  L.Location_Name,
  C.Congregation_Name
FROM Locations L
LEFT JOIN Congregations C ON L.Congregation_ID = C.Congregation_ID
WHERE
  L.Location_ID != 3