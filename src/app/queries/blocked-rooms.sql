;WITH PatternDates AS (
    SELECT
        DATEADD(MINUTE, -@SetupTime, TRY_CAST(value AS datetime2(3))) AS Pattern_Start_Date,
        DATEADD(MINUTE, @EventLengthMinutes + @CleanupTime, TRY_CAST(value AS datetime2(3))) AS Pattern_End_Date
    FROM STRING_SPLIT(@PatternString, ',')
)
SELECT
    ER.Event_Room_ID,
    ER.Event_ID,
    ER.Room_ID,
    E.Event_Start_Date,
    E.Event_End_Date,
    E.Event_Title
FROM Event_Rooms ER
JOIN Rooms R ON R.Room_ID = ER.Room_ID
JOIN Buildings B ON B.Building_ID = R.Building_ID
JOIN Events E ON E.Event_ID = ER.Event_ID
JOIN PatternDates PD 
    ON E.Event_End_Date > PD.Pattern_Start_Date 
       AND E.Event_Start_Date < PD.Pattern_End_Date
WHERE
    B.Location_ID = @LocationID
    AND E.Cancelled = 0
ORDER BY ER.Room_ID;