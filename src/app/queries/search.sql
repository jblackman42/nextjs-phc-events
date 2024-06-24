SELECT
    Event_ID,
    Event_Title,
    Event_Start_Date,
    dbo.LevenshteinDistance(Event_Title, @Keyword) AS TextualSimilarity,
    ABS(DATEDIFF(DAY, GETDATE(), Event_Start_Date)) AS DaysFromToday
FROM Events
WHERE dbo.LevenshteinDistance(Event_Title, @Keyword) <= 5 -- Filter for close matches, adjust threshold as needed
ORDER BY 
    dbo.LevenshteinDistance(Event_Title, @Keyword), -- Lower scores (closer matches) first
    ABS(DATEDIFF(DAY, GETDATE(), Event_Start_Date)) -- Nearest dates first
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY; -- Fetch top 10 matches
