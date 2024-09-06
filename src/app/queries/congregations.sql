SELECT
	C.Congregation_ID,
	C.Congregation_Name,
	C.Description,
	C.Start_Date,
	L.Location_Name AS Location,
	C.Time_Zone
FROM Congregations C
LEFT JOIN Locations L ON L.Location_ID = C.Location_ID
WHERE Available_Online = 1 
  AND (C.End_Date IS NULL OR GETDATE() < C.End_Date)
ORDER BY 
	CASE WHEN C.Online_Sort_Order IS NULL
		THEN 1
		ELSE 0
	END,
	C.Online_Sort_Order ASC;