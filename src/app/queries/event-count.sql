-- Temporary table to hold the dates
IF OBJECT_ID('tempdb..#Dates') IS NOT NULL DROP TABLE #Dates;

-- Split the comma-separated string into individual dates
;WITH SplitDates AS (
    SELECT 
        value AS DateString
    FROM 
        STRING_SPLIT(@dateList, ',')
)
-- Insert the split dates into the temporary table
SELECT 
    CAST(LTRIM(RTRIM(DateString)) AS DATE) AS [Date]
INTO 
    #Dates
FROM 
    SplitDates;

-- Main query
SELECT
    d.[Date] AS [Date],
    
    -- Count of non-cancelled events
    (
        SELECT COUNT(*)
        FROM Events E
        WHERE 
            CAST(E.Event_Start_Date AS DATE) = d.[Date]
            AND E.Cancelled = 0
            AND (E.Location_ID = @Location_ID OR @Location_ID IS NULL)
            AND (
                EXISTS (
                    SELECT 1 
                    FROM Event_Rooms ER
                    WHERE ER.Event_ID = E.Event_ID
                    AND (ER.Room_ID = @Room_ID OR @Room_ID IS NULL)
                )
                OR @Room_ID IS NULL
            )
            AND (
                EXISTS (
                    SELECT 1
                    FROM Buildings B
                    JOIN Rooms R ON R.Building_ID = B.Building_ID
                    JOIN Event_Rooms ER ON ER.Room_ID = R.Room_ID
                    WHERE ER.Event_ID = E.Event_ID
                    AND (B.Building_ID = @Building_ID OR @Building_ID IS NULL)
                )
                OR @Building_ID IS NULL
            )
    ) AS [Event_Count],
    
    -- Count of cancelled events
    (
        SELECT COUNT(*)
        FROM Events E
        WHERE 
            CAST(E.Event_Start_Date AS DATE) = d.[Date]
            AND E.Cancelled = 1
            AND (E.Location_ID = @Location_ID OR @Location_ID IS NULL)
            AND (
                EXISTS (
                    SELECT 1 
                    FROM Event_Rooms ER
                    WHERE ER.Event_ID = E.Event_ID
                    AND (ER.Room_ID = @Room_ID OR @Room_ID IS NULL)
                )
                OR @Room_ID IS NULL
            )
            AND (
                EXISTS (
                    SELECT 1
                    FROM Buildings B
                    JOIN Rooms R ON R.Building_ID = B.Building_ID
                    JOIN Event_Rooms ER ON ER.Room_ID = R.Room_ID
                    WHERE ER.Event_ID = E.Event_ID
                    AND (B.Building_ID = @Building_ID OR @Building_ID IS NULL)
                )
                OR @Building_ID IS NULL
            )
    ) AS [Cancelled_Count]
    
FROM
    #Dates d
ORDER BY
    d.[Date];

-- Cleanup
DROP TABLE #Dates;