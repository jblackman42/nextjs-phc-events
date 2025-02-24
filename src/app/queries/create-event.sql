-- Variables/Tables

DECLARE @AuditUserName NVARCHAR(254) = @Display_Name
	, @AuditUserID INT = 0
	DECLARE @ToBeAudited mp_ServiceAuditLog
DECLARE @CreatedEvents TABLE (Event_ID INT)
DECLARE @InsertedEvents TABLE 
(
    Event_ID INT,
    Event_Title NVARCHAR(254)
)




-- Create Events

INSERT INTO Events WITH (TABLOCKX) (Domain_ID, _Approved, _Web_Approved, Event_Title, Event_Type_ID, Congregation_ID, Location_ID, Description, Program_ID, Primary_Contact, Minutes_for_Setup, Minutes_for_Cleanup, Visibility_Level_ID, Event_Start_Date, Event_End_Date, Participants_Expected, Created_By_User)
OUTPUT 
    INSERTED.Event_ID,
    INSERTED.Event_Title
INTO @InsertedEvents
SELECT
    1,
    0,
    0,
    Event_Title,
    Event_Type_ID,
    Congregation_ID,
    Location_ID,
    Event_Description AS Description,
    Program_ID,
    Primary_Contact_ID AS Primary_Contact,
    Setup_Time AS Minutes_for_Setup,
    Cleanup_Time AS Minutes_for_Cleanup,
    CASE WHEN [Public] = 'true' THEN 4 ELSE 1 END as Visibility_Level_ID,
    Event_Start_Date,
    Event_End_Date,
    Estimated_Attendance,
    @User_ID AS Created_By_User
FROM OPENJSON(@Events)
WITH (
  Event_Title NVARCHAR(254),
  Event_Type_ID INT,
  Congregation_ID INT,
  Location_ID INT,
  Event_Description NVARCHAR(MAX),
  Program_ID INT,
  Primary_Contact_ID INT,
  Setup_Time INT,
  Cleanup_Time INT,
  [Public] NVARCHAR(10) '$.Public',
  Event_Start_Date DATETIME,
  Event_End_Date DATETIME,
  Estimated_Attendance INT
) AS Events;

INSERT INTO @CreatedEvents (Event_ID)
SELECT Event_ID FROM @InsertedEvents;




-- Optimize Sequence handling by removing redundant operations
IF (SELECT COUNT(*) FROM @CreatedEvents) > 1
BEGIN
    INSERT INTO dp_Sequences DEFAULT VALUES;
    DECLARE @SeqID INT = SCOPE_IDENTITY();

    -- Batch insert sequence records
    INSERT INTO dp_Sequence_Records (Record_ID, Table_Name, Domain_ID, Sequence_ID)
    SELECT Event_ID, 'Events', 1, @SeqID
    FROM @CreatedEvents;
END




-- Optimize Room insertion with table-valued parameter approach
IF (@Selected_Rooms IS NOT NULL)
BEGIN
    INSERT INTO Event_Rooms (Domain_ID, Event_ID, Room_ID, _Approved)
    SELECT 1, ce.Event_ID, r.value, 1
    FROM @CreatedEvents ce
    CROSS APPLY STRING_SPLIT(@Selected_Rooms, ',') r;
END



-- Batch insert audit logs instead of using table variable
INSERT INTO @ToBeAudited
SELECT 
    'Events', 
    Event_ID, 
    'Created', 
    @AuditUserID, 
    @AuditUserName, 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    NULL
FROM @InsertedEvents;

EXEC dbo.util_createauditlogentries @ToBeAudited;

-- Keep the cursor for task processing since we need to use stored procedures
DECLARE @Event_ID INT;
DECLARE record_cursor CURSOR LOCAL FAST_FORWARD FOR  -- Optimized cursor declaration
SELECT Event_ID FROM @CreatedEvents;

OPEN record_cursor;
FETCH NEXT FROM record_cursor INTO @Event_ID;

WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC dbo.dp_Create_Process_Submissions @DomainId = 1, 
        @TableName = 'Events', 
        @RecordId = @Event_ID, 
        @UserId = @User_ID, 
        @ChangedFields = 'Event_Title, Event_Type_ID, Congregation_ID, Location_ID, Event_Description, Program_ID, Primary_Contact_ID, Setup_Time, Cleanup_Time, Visibility_Level_ID, Event_Start_Date, Event_End_Date, Estimated_Attendance, Created_By_User', 
        @ChangeType = 2;

    DECLARE @TaskId INT = (SELECT TASK_ID 
                          FROM dp_Tasks 
                          WHERE Assigned_User_ID = @User_ID 
                            AND _Record_ID = @Event_ID 
                            AND Completed = 0 
                            AND _Table_Name = 'Events');

    EXEC dbo.dp_Complete_Task @DomainId = 1, 
        @UserId = @User_ID, 
        @Result = 1, 
        @Comments = 'Event Created via phc.events', 
        @TaskId = @TaskId;

    FETCH NEXT FROM record_cursor INTO @Event_ID;
END;

CLOSE record_cursor;
DEALLOCATE record_cursor;






SELECT Event_ID FROM @CreatedEvents;