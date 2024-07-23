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
    COUNT(e.Event_Start_Date) AS [Event_Count],
    COUNT(CASE WHEN e.Cancelled = 1 THEN 1 END) AS [Cancelled_Count]
FROM
    #Dates d
LEFT JOIN
    Events e ON CAST(e.Event_Start_Date AS DATE) = d.[Date]
GROUP BY
    d.[Date]
ORDER BY
    d.[Date];

-- Cleanup
DROP TABLE #Dates;