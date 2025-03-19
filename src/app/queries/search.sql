DECLARE @Amount int = 10;
DECLARE @IsStaff bit = (SELECT CASE 
                            WHEN EXISTS(SELECT 1 FROM dp_User_Roles UR 
                                JOIN dp_Users U ON U.User_ID = UR.User_ID 
                                WHERE CONVERT(nvarchar(36), U.User_GUID) = @userGUID)
                            THEN 1
                            ELSE 0
                        END);

-- Create a table variable to hold the initial results
DECLARE @Results TABLE (
    Event_ID INT,
    Event_Title NVARCHAR(255),
    Event_Start_Date DATETIME,
    Cancelled BIT,
    Featured_On_Calendar BIT,
    Visibility_Level_ID INT,
    SortOrder INT
);

-- Insert initial results that meet the date and keyword criteria
INSERT INTO @Results
SELECT TOP (@Amount)
    E.Event_ID,
    E.Event_Title,
    E.Event_Start_Date,
    E.Cancelled,
    E.Featured_On_Calendar,
    E.Visibility_Level_ID,
    CASE 
        WHEN E.Event_Title LIKE '%' + @keyword + '%' THEN 1
        WHEN E.[Description] LIKE '%' + @keyword + '%' THEN 2
        WHEN P.Program_Name LIKE '%' + @keyword + '%' THEN 3
        WHEN M.Ministry_Name LIKE '%' + @keyword + '%' THEN 4
    END AS SortOrder
FROM Events E
LEFT JOIN Programs P ON P.Program_ID = E.Program_ID
LEFT JOIN Ministries M ON M.Ministry_ID = P.Ministry_ID
WHERE E.Event_Start_Date >= @targetDate
  AND E.Cancelled = ISNULL(@showCancelled, 0)
  AND (
      E.Event_Title LIKE '%' + @keyword + '%'
      OR E.[Description] LIKE '%' + @keyword + '%'
      OR P.Program_Name LIKE '%' + @keyword + '%'
      OR M.Ministry_Name LIKE '%' + @keyword + '%'
  )
  AND (
    ((@IsStaff = 1)) 
    OR E.Visibility_Level_ID = 4
)
ORDER BY SortOrder, E.Event_Start_Date;

-- Check if we need more results
DECLARE @Count int;
SELECT @Count = COUNT(*) FROM @Results;

IF @Count < @Amount
BEGIN
    -- Calculate how many more results are needed
    DECLARE @Remaining int = @Amount - @Count;

    -- Append results from before @targetDate
    INSERT INTO @Results
    SELECT TOP (@Remaining)
        E.Event_ID,
        E.Event_Title,
        E.Event_Start_Date,
        E.Cancelled,
        E.Featured_On_Calendar,
        E.Visibility_Level_ID,
        CASE 
            WHEN E.Event_Title LIKE '%' + @keyword + '%' THEN 1
            WHEN E.[Description] LIKE '%' + @keyword + '%' THEN 2
            WHEN P.Program_Name LIKE '%' + @keyword + '%' THEN 3
            WHEN M.Ministry_Name LIKE '%' + @keyword + '%' THEN 4
        END AS SortOrder
    FROM Events E
    LEFT JOIN Programs P ON P.Program_ID = E.Program_ID
    LEFT JOIN Ministries M ON M.Ministry_ID = P.Ministry_ID
    WHERE E.Event_Start_Date < @targetDate
      AND E.Cancelled = ISNULL(@showCancelled, 0)
      AND (
          E.Event_Title LIKE '%' + @keyword + '%'
          OR E.[Description] LIKE '%' + @keyword + '%'
          OR P.Program_Name LIKE '%' + @keyword + '%'
          OR M.Ministry_Name LIKE '%' + @keyword + '%'
      )
      AND (
        ((@IsStaff = 1)) 
        OR E.Visibility_Level_ID = 4
)
    ORDER BY E.Event_Start_Date DESC, SortOrder;  -- Order by most recent first
END

-- Select the final set of results, ordered from closest to @targetDate to furthest
SELECT TOP (@Amount)
    Event_ID,
    Event_Title,
    Event_Start_Date,
    Cancelled,
    Featured_On_Calendar,
    Visibility_Level_ID
FROM @Results
ORDER BY ABS(DATEDIFF(DAY, @targetDate, Event_Start_Date)), SortOrder;